#!/usr/bin/env python3
"""Uji tts_gemini.py tanpa memanggil API: pemotongan per blok dari WAV buatan, cache, dan mode satu request.

Pakai: python3 scripts/uji_tts_gemini.py
"""
import json
import math
import os
import random
import struct
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tts_gemini as t  # noqa: E402

RATE = t.RATE
NASKAH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "vo-inflasi.json")


def sunyi(det, rng):
    return [rng.gauss(0, 15) for _ in range(int(det * RATE))]  # derau latar ≈ -67 dBFS


def ucapan(det, rng):
    """'Kata-kata' berupa nada termodulasi dengan celah mikro 40–120 ms seperti ucapan asli."""
    s, sisa = [], det
    while sisa > 0:
        p = min(sisa, rng.uniform(0.18, 0.45))
        f, amp = rng.uniform(120, 260), rng.uniform(4000, 12000)
        n = int(p * RATE)
        s += [amp * math.sin(math.pi * i / n) * math.sin(2 * math.pi * f * i / RATE) + rng.gauss(0, 15) for i in range(n)]
        g = rng.uniform(0.04, 0.12)
        s += sunyi(g, rng)
        sisa -= p + g
    return s


def ke_pcm(s):
    return struct.pack(f"<{len(s)}h", *(max(-32768, min(32767, int(x))) for x in s))


def buat(kata, rng, jeda_blok, jeda_dalam, tempo=2.4):
    """Audio gabungan + batas blok sebenarnya (detik). jeda_dalam: {blok: [panjang jeda '...']}."""
    s = sunyi(0.3, rng)
    batas = []
    for k, n in enumerate(kata):
        mulai = len(s) / RATE
        potongan = jeda_dalam.get(k, [])
        bagian = len(potongan) + 1
        for p in range(bagian):
            s += ucapan(n / tempo / bagian, rng)
            if p < len(potongan):
                s += sunyi(potongan[p], rng)
        batas.append((mulai, len(s) / RATE))
        if k < len(kata) - 1:
            s += sunyi(jeda_blok[k], rng)
    s += sunyi(0.4, rng)
    return ke_pcm(s), batas


def cek_potong(nama, kata, jeda_blok, jeda_dalam, seed, tol=0.2):
    rng = random.Random(seed)
    pcm, benar = buat(kata, rng, jeda_blok, jeda_dalam)
    seg = t.potong(pcm, kata)
    assert len(seg) == len(kata), nama
    for k, ((a, b), (ea, eb)) in enumerate(zip(seg, benar)):
        assert abs(a - ea) <= tol and abs(b - eb) <= tol, f"{nama}: blok {k} {a:.2f}-{b:.2f}, seharusnya {ea:.2f}-{eb:.2f}"
    print(f"ok  {nama}: {len(kata)} blok, galat batas maks "
          f"{max(max(abs(a - ea), abs(b - eb)) for (a, b), (ea, eb) in zip(seg, benar)):.2f} s")


def main():
    naskah = json.load(open(NASKAH))
    kata = [len(b["teks"].split()) for b in naskah["blok"]]
    titik = {k: [0.6] * b["teks"].count("...") for k, b in enumerate(naskah["blok"]) if "..." in b["teks"]}
    n = len(kata)

    # 1. jeda antar-blok jelas, jeda "..." pendek
    cek_potong("jeda jelas", kata, [1.4] * (n - 1), titik, 1)
    # 2. jeda antar-blok bervariasi, jeda "..." sampai 0.9 s
    rng = random.Random(2)
    cek_potong("jeda bervariasi", kata, [rng.uniform(0.8, 1.6) for _ in range(n - 1)],
               {k: [rng.uniform(0.5, 0.9) for _ in v] for k, v in titik.items()}, 3)
    # 3. kasus sulit: satu jeda di dalam blok (1.1 s) lebih panjang dari satu jeda antar-blok (0.8 s)
    sulit = dict(titik)
    sulit[3] = [1.1]
    jb = [1.2] * (n - 1)
    jb[5] = 0.8
    cek_potong("jeda dalam > jeda antar-blok", kata, jb, sulit, 4)
    # 4. audio tanpa jeda antar-blok yang cukup -> harus menolak, bukan memotong asal
    rng = random.Random(5)
    pcm, _ = buat(kata, rng, [0.05] * (n - 1), {}, )
    try:
        t.potong(pcm, kata)
        raise AssertionError("seharusnya gagal tanpa jeda")
    except ValueError as e:
        print("ok  tanpa jeda ditolak:", e)

    # 4b. respons berupa file WAV utuh (header RIFF + chunk metadata di belakang)
    import io
    import wave
    pcm = ke_pcm_uji = buat([5], random.Random(9), [], {})[0]
    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        w.setnchannels(1), w.setsampwidth(2), w.setframerate(RATE)
        w.writeframes(pcm)
    berkas = bytearray(buf.getvalue())
    ekor = b"LIST" + struct.pack("<I", 24) + b"INFOtrainedAlgorithmicMd"
    berkas += ekor
    struct.pack_into("<I", berkas, 4, len(berkas) - 8)
    assert t.ke_pcm(bytes(berkas)) == ke_pcm_uji, "header/metadata harus dibuang"
    assert t.ke_pcm(pcm) is pcm, "PCM mentah tidak boleh diubah"
    print("ok  WAV utuh dari API -> hanya chunk data yang dipakai")

    # 4c. sunyi awal hook dipangkas sampai <= 50 ms, isi ucapan tidak hilang
    rng = random.Random(10)
    pcm = struct.pack("<%dh" % int(0.4 * RATE), *[int(rng.gauss(0, 15)) for _ in range(int(0.4 * RATE))])
    suara = buat([3], random.Random(11), [], {})[0]
    gabung = pcm + suara
    hasil = t.potong_awal(gabung)
    buang = (len(gabung) - len(hasil)) / 2 / RATE
    assert 0.6 <= buang <= 0.7, buang  # 0,4 s + 0,3 s sunyi bawaan buat(), sisa 0,05 s
    db = t._energi_db(hasil, RATE, 0.01)
    ambang = max(sorted(db)[int(0.95 * (len(db) - 1))] - 30, -70)
    awal_bunyi = next(i for i, v in enumerate(db) if v >= ambang) * 0.01
    assert awal_bunyi <= 0.06, awal_bunyi
    assert t.potong_awal(suara[: len(suara)]) == t.potong_awal(t.potong_awal(suara)), "harus idempoten"
    print(f"ok  sunyi awal hook: {buang:.2f} s dipangkas, ucapan mulai di {awal_bunyi * 1000:.0f} ms")

    # 5. main() menyeluruh dengan tts tiruan: satu request, lalu cache dipakai ulang
    panggilan = []
    mode = {"baca_instruksi": False}
    naskah_kini = naskah

    def palsu(model, suara, teks_prompt):
        panggilan.append(teks_prompt)
        if "Gaya tiap paragraf" in teks_prompt:
            jumlah = teks_prompt.count("\nParagraf ")
            sub = kata[n - jumlah:]
            return buat(sub, random.Random(6), [1.3] * (len(sub) - 1), {})[0]
        for blk in naskah_kini["blok"]:
            if teks_prompt.endswith(blk["teks"]):
                jml = len(blk["teks"].split())
                if mode["baca_instruksi"] and teks_prompt != blk["teks"]:
                    jml += 40  # model ikut membacakan instruksi gaya
                return buat([jml], random.Random(7), [], {})[0]
        raise AssertionError("prompt tidak dikenal")

    t.tts = palsu
    with tempfile.TemporaryDirectory() as d:
        t.main([NASKAH, d, "--satu-permintaan"])
        assert len(panggilan) == 1, panggilan
        p = panggilan[0]
        assert "Paragraf 1:" in p and naskah["blok"][0]["teks"].strip() in p
        assert "Paragraf 1" not in p.split("Transkrip:")[1], "label paragraf tidak boleh masuk transkrip"
        w = json.load(open(os.path.join(d, "waktu.json")))
        assert len(w["blok"]) == n and all(b["durasi"] > 0.5 for b in w["blok"])
        print(f"ok  satu request -> {n} blok, total {w['total']} s")

        t.main([NASKAH, d, "--satu-permintaan"])
        assert len(panggilan) == 1, "jalan kedua seharusnya memakai cache"
        print("ok  jalan ulang: 0 request (cache)")

        # hapus 2 blok -> hanya 2 blok itu yang dibuat ulang, dalam 1 request
        for i in (2, 5):
            os.remove(os.path.join(d, f"blok_{i:02d}.wav"))
        kata_simpan = kata[:]
        kata[:] = [kata_simpan[2], kata_simpan[5]]
        n_simpan, n = n, 2
        t.main([NASKAH, d, "--satu-permintaan"])
        kata[:], n = kata_simpan, n_simpan
        assert len(panggilan) == 2 and panggilan[1].count("\nParagraf ") == 2
        print("ok  lanjutkan: hanya blok 2 dan 5, 1 request")

        # naskah berubah -> cache blok itu tidak dipakai
        ubah = json.load(open(NASKAH))
        ubah["blok"][0]["teks"] += " Tambahan."
        jalur = os.path.join(d, "naskah.json")
        json.dump(ubah, open(jalur, "w"), ensure_ascii=False)
        naskah_kini = ubah
        t.main([jalur, d])
        assert len(panggilan) == 3 and ubah["blok"][0]["teks"] in panggilan[2]
        print("ok  teks berubah: hanya blok 0 dibuat ulang")

    # 6. pemeriksa durasi: model membacakan instruksi -> ulang tanpa gaya, cache mengenalinya
    naskah_kini = naskah
    mode["baca_instruksi"] = True
    with tempfile.TemporaryDirectory() as d:
        panggilan.clear()
        t.main([NASKAH, d])
        assert len(panggilan) == 2 * n, len(panggilan)
        assert all(panggilan[k] == naskah["blok"][k // 2]["teks"] for k in range(1, 2 * n, 2)), "ulangan harus teks saja"
        w = json.load(open(os.path.join(d, "waktu.json")))
        assert all(t.wajar(b["durasi"], kata[b["blok"]]) for b in w["blok"])
        print(f"ok  instruksi terbaca -> {n} blok diulang tanpa gaya, semua durasi wajar")
        t.main([NASKAH, d])
        assert len(panggilan) == 2 * n
        print("ok  blok tanpa gaya dipakai ulang dari cache")

    # 7. --tanpa-gaya: satu request per blok, prompt = teks saja
    with tempfile.TemporaryDirectory() as d:
        panggilan.clear()
        t.main([NASKAH, d, "--tanpa-gaya"])
        assert panggilan == [b["teks"] for b in naskah["blok"]]
        print(f"ok  --tanpa-gaya: {n} request, teks saja")

    # 8. blok tetap terlalu panjang -> berhenti, blok tidak disimpan
    def selalu_panjang(model, suara, teks_prompt):
        return buat([60], random.Random(8), [], {})[0]
    t.tts = selalu_panjang
    with tempfile.TemporaryDirectory() as d:
        try:
            t.main([NASKAH, d])
            raise AssertionError("seharusnya berhenti")
        except SystemExit as e:
            assert "tidak wajar" in str(e) and not os.path.exists(os.path.join(d, "blok_00.wav"))
            print("ok  durasi tetap tidak wajar -> berhenti, tidak disimpan")
    print("semua uji lolos")


if __name__ == "__main__":
    main()
