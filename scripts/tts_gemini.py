#!/usr/bin/env python3
"""Buat voice-over dari naskah per blok dengan Gemini TTS (mesin yang sama dengan AI Studio).

Pakai:
  python3 scripts/tts_gemini.py data/vo-inflasi.json out/vo
  python3 scripts/tts_gemini.py data/vo-inflasi.json out/vo --satu-permintaan
Keluaran:
  out/vo/blok_XX.wav   satu file per blok (+ blok_XX.json: kunci cache & durasi)
  out/vo/vo.wav        gabungan semua blok (dengan jeda antar-blok)
  out/vo/waktu.json    awal & durasi tiap blok (detik) untuk sinkron dengan template

Melanjutkan: blok_XX.wav yang sudah ada dan masih cocok dengan naskah (model, suara,
gaya, teks sama) dipakai ulang tanpa memanggil API. Hapus file blok untuk membuat ulang.

Pemeriksa durasi: model TTS kadang ikut membacakan instruksi gaya. Blok yang terlalu
panjang untuk jumlah katanya (> kata/2,3 x 1,6 + 1,5 detik) dibuat ulang sekali tanpa
instruksi gaya; kalau masih terlalu panjang, script berhenti tanpa menyimpan blok itu.
--tanpa-pangkas: jangan pangkas sunyi awal hook. Pakai untuk revisi satu blok video yang
sudah dirender sebelum aturan pangkas berlaku (17 Nov), agar waktu blok lama tetap sama.
--tanpa-gaya: langsung kirim teks saja (nada diatur lewat tanda baca), paling hemat kuota.

--satu-permintaan (EKSPERIMEN, tidak disarankan): semua blok yang belum ada dikirim dalam
SATU request, lalu audionya dipotong di titik sunyi. Uji nyata 2026-11-10: model
menambahkan kalimat yang tidak ada di naskah dan jeda antar-paragraf tidak lebih panjang
dari jeda biasa, sehingga pemotongan salah. Jangan dipakai untuk video yang akan tayang.

Key: disarankan disimpan sebagai Network secret untuk host generativelanguage.googleapis.com
(header x-goog-api-key), sehingga proxy menyisipkannya dan key tidak pernah terlihat di sesi.
Alternatif: variabel lingkungan GEMINI_API_KEY. Jangan tulis key di file mana pun.
"""
import argparse
import base64
import hashlib
import io
import json
import math
import os
import sys
import time
import urllib.error
import urllib.request
import wave
from array import array

API = "https://generativelanguage.googleapis.com/v1beta"
RATE = 24000  # Gemini TTS mengeluarkan PCM 16-bit mono 24 kHz
VERSI_PROMPT = 3  # naikkan kalau cara menyusun prompt berubah, agar cache lama tidak dipakai


def panggil(url, data=None):
    headers = {"Content-Type": "application/json"}
    key = os.environ.get("GEMINI_API_KEY")
    if key:
        headers["x-goog-api-key"] = key  # kalau tidak ada, proxy Network secrets yang menyisipkan
    req = urllib.request.Request(url, data=json.dumps(data).encode() if data else None, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        if e.code in (401, 403) and not key:
            sys.exit("Ditolak Google (belum ada API key). Tambahkan Network secret untuk generativelanguage.googleapis.com, lalu buka sesi baru.")
        raise


def pilih_model(diminta):
    if diminta:
        return diminta
    daftar = panggil(f"{API}/models?pageSize=200").get("models", [])
    tts = [m["name"].split("/")[-1] for m in daftar if "tts" in m["name"].lower()]
    if not tts:
        sys.exit("Tidak ada model TTS yang tersedia untuk key ini.")
    # utamakan flash: model pro sering berjatah 0 di paket gratis
    tts.sort(key=lambda n: ("pro" in n, "lite" in n, n))
    print("model TTS tersedia:", tts)
    return tts[0]


def prompt(gaya, teks):
    """Pisahkan instruksi gaya dari teks agar instruksinya tidak ikut dibacakan."""
    if not gaya:
        return teks
    return (f"Bacakan transkrip berikut dengan gaya: {gaya.strip()} "
            f"Jangan bacakan instruksi ini.\nTranskrip:\n{teks}")


def prompt_gabungan(gaya_umum, blok):
    """Satu prompt untuk banyak blok: gaya per paragraf di instruksi, transkrip tanpa nomor."""
    daftar = "\n".join(f"Paragraf {i + 1}: {b['gaya'].strip()}" for i, b in enumerate(blok))
    transkrip = "\n\n".join(b["teks"].strip() for b in blok)
    return (f"Bacakan transkrip berikut. Gaya umum: {gaya_umum.strip()}\n"
            f"Transkrip terdiri dari {len(blok)} paragraf. Gaya tiap paragraf:\n{daftar}\n"
            "Beri jeda hening sekitar satu setengah detik di antara paragraf. "
            "Jangan bacakan instruksi, nomor, atau label ini.\n"
            f"Transkrip:\n\n{transkrip}")


def tts(model, suara, teks_prompt):
    data = {
        "contents": [{"parts": [{"text": teks_prompt}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": suara}}},
        },
    }
    for coba in range(4):
        try:
            r = panggil(f"{API}/models/{model}:generateContent", data)
            b64 = r["candidates"][0]["content"]["parts"][0]["inlineData"]["data"]
            return ke_pcm(base64.b64decode(b64))
        except urllib.error.HTTPError as e:
            badan = e.read().decode(errors="replace")
            if e.code == 429 and "per day" in badan.lower():
                sys.exit("Kuota harian Gemini TTS habis untuk model ini. Tunggu reset atau aktifkan billing; "
                         "blok yang sudah jadi tersimpan dan akan dipakai ulang.")
            if coba == 3:
                raise
            print("ulang karena:", e)
            time.sleep(2 ** (coba + 1))
        except KeyError as e:
            if coba == 3:
                raise
            print("ulang karena: respons tanpa audio", e)
            time.sleep(2 ** (coba + 1))


def ke_pcm(data):
    """Kembalikan PCM 16-bit mono 24 kHz mentah.

    Sebagian model (mis. gemini-3.8-flash-tts) mengirim file WAV utuh, lengkap dengan
    header RIFF dan chunk metadata di belakang, bukan PCM mentah. Kalau ditulis
    apa adanya, header dan metadata ikut terdengar sebagai klik/derau. Ambil hanya
    chunk data-nya.
    """
    if data[:4] != b"RIFF" or data[8:12] != b"WAVE":
        return data
    with wave.open(io.BytesIO(data), "rb") as w:
        if (w.getnchannels(), w.getsampwidth(), w.getframerate()) != (1, 2, RATE):
            raise ValueError(f"format audio tidak didukung: {w.getnchannels()} kanal, "
                             f"{8 * w.getsampwidth()} bit, {w.getframerate()} Hz")
        return w.readframes(w.getnframes())


def simpan(path, pcm):
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(pcm)


def kunci(model, suara, gaya, teks):
    isi = json.dumps([VERSI_PROMPT, model, suara, gaya.strip(), teks.strip()], ensure_ascii=False)
    return hashlib.sha1(isi.encode()).hexdigest()


def wajar(detik, kata):
    """Durasi masuk akal untuk jumlah kata? (patokan 2,3 kata/detik)"""
    harap = kata / 2.3
    return 0.4 * harap <= detik <= 1.6 * harap + 1.5


def baca_cache(out, i, k):
    """PCM blok i kalau file-nya sah dan dibuat dari naskah yang sama; selain itu None."""
    wav, meta = os.path.join(out, f"blok_{i:02d}.wav"), os.path.join(out, f"blok_{i:02d}.json")
    try:
        if json.load(open(meta)).get("kunci") != k:
            return None
        with wave.open(wav, "rb") as w:
            if (w.getnchannels(), w.getsampwidth(), w.getframerate()) != (1, 2, RATE):
                return None
            pcm = w.readframes(w.getnframes())
        bersih = ke_pcm(pcm)  # perbaiki cache lama yang masih memuat header WAV
        if bersih is not pcm:
            simpan(wav, bersih)
            pcm = bersih
    except (OSError, ValueError, EOFError, wave.Error):
        return None
    return pcm if len(pcm) / 2 / RATE >= 0.5 else None


def simpan_blok(out, i, k, pcm):
    simpan(os.path.join(out, f"blok_{i:02d}.wav"), pcm)
    json.dump({"kunci": k, "durasi": round(len(pcm) / 2 / RATE, 3)}, open(os.path.join(out, f"blok_{i:02d}.json"), "w"))


# --- pemotongan audio gabungan per blok -------------------------------------------------

def _energi_db(pcm, rate, frame):
    s = array("h")
    s.frombytes(pcm[: len(pcm) // 2 * 2])
    if sys.byteorder != "little":
        s.byteswap()
    n = max(1, int(rate * frame))
    hasil = []
    for a in range(0, len(s) - n + 1, n):
        jumlah = sum(x * x for x in s[a:a + n])
        hasil.append(20 * math.log10(math.sqrt(jumlah / n) / 32768 + 1e-9))
    return hasil


def potong(pcm, kata, rate=RATE, frame=0.02, min_sunyi=0.2, pad=0.08):
    """Potong audio gabungan menjadi len(kata) segmen di titik sunyi.

    Kandidat = rentang sunyi di tengah ucapan. Batas dipilih dengan pemrograman dinamis:
    dekat posisi yang diharapkan dari proporsi jumlah kata, dan sunyi yang lebih panjang
    diutamakan. Jadi jeda dramatis di dalam blok ("...") tidak mudah tertukar dengan jeda
    antar-blok. Mengembalikan daftar (mulai, akhir) dalam detik; ValueError kalau ragu.
    """
    n = len(kata)
    db = _energi_db(pcm, rate, frame)
    if not db:
        raise ValueError("audio kosong")
    urut = sorted(db)
    ambang = max(urut[int(0.95 * (len(urut) - 1))] - 30, -70)
    bunyi = [i for i, v in enumerate(db) if v >= ambang]
    if not bunyi:
        raise ValueError("tidak ada suara terdeteksi")
    s0, e0 = bunyi[0] * frame, (bunyi[-1] + 1) * frame
    if n == 1:
        return [(max(0.0, s0 - pad), e0 + pad)]

    cand, i = [], bunyi[0]
    while i <= bunyi[-1]:
        if db[i] < ambang:
            j = i
            while db[j] < ambang:
                j += 1
            if (j - i) * frame >= min_sunyi:
                cand.append((i * frame, j * frame))
            i = j
        else:
            i += 1
    if len(cand) < n - 1:
        raise ValueError(f"hanya {len(cand)} jeda terdeteksi, butuh {n - 1}")

    total, kum, durasi = sum(kata), 0, e0 - s0
    harap = []
    for k in kata[:-1]:
        kum += k
        harap.append(s0 + durasi * kum / total)
    pjg_maks = max(b - a for a, b in cand)
    sigma = 0.12 * durasi

    def biaya(k, j):
        a, b = cand[j]
        return ((a + b) / 2 - harap[k]) ** 2 / sigma ** 2 - 2.0 * (b - a) / pjg_maks

    m, inf = len(cand), float("inf")
    dp = [[inf] * m for _ in range(n - 1)]
    asal = [[-1] * m for _ in range(n - 1)]
    for j in range(m):
        dp[0][j] = biaya(0, j)
    for k in range(1, n - 1):
        terbaik, idx = inf, -1
        for j in range(m):
            if j > 0 and dp[k - 1][j - 1] < terbaik:
                terbaik, idx = dp[k - 1][j - 1], j - 1
            if idx >= 0:
                dp[k][j] = terbaik + biaya(k, j)
                asal[k][j] = idx
    j = min(range(m), key=lambda x: dp[n - 2][x])
    if dp[n - 2][j] == inf:
        raise ValueError("gagal memilih batas blok")
    pilih = [j]
    for k in range(n - 2, 0, -1):
        j = asal[k][j]
        pilih.append(j)
    pilih.reverse()

    tepi = [s0] + [x for j in pilih for x in cand[j]] + [e0]
    seg = [(max(0.0, tepi[2 * k] - pad), tepi[2 * k + 1] + pad) for k in range(n)]
    bicara = sum(b - a for a, b in seg)
    for k, (a, b) in enumerate(seg):
        rasio = (b - a) / (bicara * kata[k] / total)
        if not 0.45 <= rasio <= 2.2:
            raise ValueError(f"blok {k} berdurasi {b - a:.1f} s, tidak sebanding dengan {kata[k]} kata (rasio {rasio:.2f})")
    return seg


def potong_awal(pcm, sisa=0.05, rate=RATE, frame=0.01):
    """Pangkas sunyi di awal sampai tersisa <= `sisa` detik, dengan fade-in 5 ms agar tidak klik."""
    db = _energi_db(pcm, rate, frame)
    if not db:
        return pcm
    urut = sorted(db)
    ambang = max(urut[int(0.95 * (len(urut) - 1))] - 30, -70)
    pertama = next((i for i, v in enumerate(db) if v >= ambang), 0)
    mulai = max(0.0, pertama * frame - sisa)
    if mulai <= 0:
        return pcm
    hasil = array("h")
    hasil.frombytes(pcm[int(mulai * rate) * 2:])
    if sys.byteorder != "little":
        hasil.byteswap()
    n = min(len(hasil), int(0.005 * rate))
    for k in range(n):
        hasil[k] = int(hasil[k] * k / n)
    if sys.byteorder != "little":
        hasil.byteswap()
    return hasil.tobytes()


def iris(pcm, a, b, rate=RATE):
    return pcm[int(a * rate) * 2:int(b * rate) * 2]


# --- utama ---------------------------------------------------------------------------------

def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("naskah")
    ap.add_argument("out")
    ap.add_argument("--satu-permintaan", action="store_true", help="EKSPERIMEN: semua blok dalam satu request (lihat catatan di atas)")
    ap.add_argument("--tanpa-gaya", action="store_true", help="kirim teks saja, tanpa instruksi gaya")
    ap.add_argument("--tanpa-pangkas", action="store_true",
                    help="jangan pangkas sunyi awal hook (untuk revisi satu blok video lama, agar waktu render tetap berlaku)")
    arg = ap.parse_args(argv)

    naskah = json.load(open(arg.naskah))
    out = arg.out
    os.makedirs(out, exist_ok=True)
    blok = naskah["blok"]
    suara = naskah.get("suara", "Sulafat")
    jeda = int(RATE * naskah.get("jeda_antar_blok", 0.35)) * 2
    gaya_umum = naskah.get("gaya_umum", "")
    gaya = [(gaya_umum + " " + b["gaya"]).strip() for b in blok]

    model = naskah.get("model")
    kata = [len(b["teks"].split()) for b in blok]

    def dari_cache(i):
        for g in (gaya[i], ""):  # blok bisa dibuat dengan atau tanpa instruksi gaya
            p = baca_cache(out, i, kunci(model, suara, g, blok[i]["teks"]))
            if p is not None and wajar(len(p) / 2 / RATE, kata[i]):
                return p
        return None

    pcm = [dari_cache(i) for i in range(len(blok))] if model else [None] * len(blok)
    for i, p in enumerate(pcm):
        if p is not None:
            print(f"blok {i}: pakai yang sudah ada ({len(p) / 2 / RATE:.2f} s)")
    kurang = [i for i, p in enumerate(pcm) if p is None]
    if kurang:
        model = pilih_model(model)

    if kurang and arg.satu_permintaan and len(kurang) > 1:
        print(f"satu request untuk blok {kurang}")
        mentah = tts(model, suara, prompt_gabungan(gaya_umum, [blok[i] for i in kurang]))
        simpan(os.path.join(out, "vo_mentah.wav"), mentah)
        try:
            seg = potong(mentah, [kata[i] for i in kurang])
        except ValueError as e:
            sys.exit(f"Gagal memotong audio gabungan: {e}. Audio mentah: {out}/vo_mentah.wav. "
                     "Coba lagi atau jalankan tanpa --satu-permintaan.")
        for i, (a, b) in zip(kurang, seg):
            pcm[i] = iris(mentah, a, b)
            simpan_blok(out, i, kunci(model, suara, gaya[i], blok[i]["teks"]), pcm[i])
    else:
        for i in kurang:
            g = "" if arg.tanpa_gaya else gaya[i]
            p = tts(model, suara, prompt(g, blok[i]["teks"]))
            if not wajar(len(p) / 2 / RATE, kata[i]) and g:
                print(f"blok {i}: {len(p) / 2 / RATE:.1f} s untuk {kata[i]} kata, instruksi gaya diduga ikut "
                      "terbaca; ulang tanpa instruksi gaya")
                g = ""
                p = tts(model, suara, prompt(g, blok[i]["teks"]))
            if not wajar(len(p) / 2 / RATE, kata[i]):
                sys.exit(f"blok {i}: durasi {len(p) / 2 / RATE:.1f} s tidak wajar untuk {kata[i]} kata; blok tidak disimpan.")
            pcm[i] = p
            simpan_blok(out, i, kunci(model, suara, g, blok[i]["teks"]), p)

    # Hook harus mulai di 0,0 s: sunyi awal blok pertama maksimal 50 ms (pipeline v2).
    sebelum = len(pcm[0]) / 2 / RATE
    if not arg.tanpa_pangkas:
        pcm[0] = potong_awal(pcm[0])
    if len(pcm[0]) / 2 / RATE < sebelum - 0.001:
        print(f"blok 0: sunyi awal dipangkas {sebelum - len(pcm[0]) / 2 / RATE:.2f} s")
    db = _energi_db(pcm[0], RATE, 0.01)
    ambang = max(sorted(db)[int(0.95 * (len(db) - 1))] - 30, -70) if db else 0
    akhir_ucapan = max((k for k, v in enumerate(db) if v >= ambang), default=0) * 0.01 + 0.01
    print(f"blok 0 (hook): ucapan berakhir di {akhir_ucapan:.2f} s")
    if akhir_ucapan > 2.5:
        print(f"PERINGATAN: hook selesai diucapkan di {akhir_ucapan:.2f} s, lebih dari 2,5 s; "
              "pertimbangkan hook <= 4 kata tanpa koma")

    semua, waktu, t = b"", [], 0.0
    for i, b in enumerate(blok):
        dur = len(pcm[i]) / 2 / RATE
        waktu.append({"blok": i, "mulai": round(t, 3), "durasi": round(dur, 3), "teks": b["teks"]})
        print(f"blok {i}: {dur:.2f} s")
        semua += pcm[i] + b"\x00" * jeda
        t += dur + jeda / 2 / RATE
    simpan(os.path.join(out, "vo.wav"), semua)
    json.dump({"model": model, "suara": suara, "total": round(t, 3), "blok": waktu},
              open(os.path.join(out, "waktu.json"), "w"), indent=2, ensure_ascii=False)
    print(f"selesai: {t:.1f} detik -> {out}/vo.wav")


if __name__ == "__main__":
    main()
