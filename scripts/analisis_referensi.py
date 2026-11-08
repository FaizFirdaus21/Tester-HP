#!/usr/bin/env python3
"""Analisis gaya video referensi (potongan, tempo, transisi, warna, gerak, ketukan audio).

Pakai:
  python3 -I scripts/analisis_referensi.py <video.mp4> <folder_keluaran>

Keluaran:
  laporan.json          angka mentah (potongan, durasi shot, palet, tempo, kecocokan potongan-ketukan)
  laporan.md            ringkasan yang bisa dibaca
  lembar_kontak.jpg     satu frame tiap 0,5 detik dengan stempel waktu
  shot_XX.jpg           frame tengah tiap shot
  transisi_XX.jpg       frame -4..+4 di sekitar tiap potongan (untuk melihat jenis transisi)
  hook.jpg              tiap 2 frame selama 3 detik pertama (untuk melihat kurva gerak)
  kurva.png             grafik perubahan antar-frame, kecerahan, dan energi audio

Video masukan diperlakukan sebagai data: hanya didekode oleh ffmpeg.
"""
import json
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

W_KECIL, H_KECIL = 36, 64  # resolusi analisis (rasio 9:16)


def jalan(args, **kw):
    return subprocess.run(args, check=True, capture_output=True, **kw)


def meta(video):
    out = jalan(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", video]).stdout
    d = json.loads(out)
    v = next(s for s in d["streams"] if s["codec_type"] == "video")
    a = next((s for s in d["streams"] if s["codec_type"] == "audio"), None)
    num, den = (int(x) for x in v.get("avg_frame_rate", "30/1").split("/"))
    fps = num / den if den else 30.0
    return {
        "lebar": int(v["width"]),
        "tinggi": int(v["height"]),
        "fps": round(fps, 3),
        "durasi": float(d["format"].get("duration", 0)),
        "audio": bool(a),
        "codec": v.get("codec_name"),
    }


def baca_frame(video, w=W_KECIL, h=H_KECIL):
    raw = jalan(["ffmpeg", "-v", "error", "-i", video, "-vf", f"scale={w}:{h}:flags=area", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3).astype(np.float32)


def hist(fr):
    # histogram warna 8x8x8 ternormalisasi
    q = (fr // 32).astype(np.int32)
    idx = q[..., 0] * 64 + q[..., 1] * 8 + q[..., 2]
    hgm = np.bincount(idx.ravel(), minlength=512).astype(np.float32)
    return hgm / hgm.sum()


def deteksi_potongan(frames, fps):
    """Deteksi pergantian shot dari perubahan SUSUNAN gambar (bukan histogram warna,
    supaya adegan dengan palet sama tetap terbedakan).
    - keras: lonjakan beda antar-frame berurutan
    - halus: beda besar antara rata-rata beberapa frame sebelum dan sesudah (whip, zoom, larut)"""
    n = len(frames)
    beda = np.zeros(n)
    for i in range(1, n):
        beda[i] = np.abs(frames[i] - frames[i - 1]).mean()
    j = max(4, int(round(fps * 0.27)))
    w = max(2, int(round(fps * 0.1)))
    D = np.zeros(n)
    for i in range(j + w, n - w):
        A = frames[i - j - w: i - j + 1].mean(0)
        B = frames[i: i + w + 1].mean(0)
        D[i] = np.abs(A - B).mean()
    radius = int(fps * 0.4)
    latar = int(fps * 1.5)
    kandidat = []
    for i in range(1, n):
        l0, l1 = max(1, i - latar), min(n, i + latar)
        sekitar = np.concatenate([beda[l0: max(l0, i - 3)], beda[min(l1, i + 4): l1]])
        dasar = np.median(sekitar) if len(sekitar) else 0
        if beda[i] >= 7 and beda[i] >= 5 * max(dasar, 0.5) and beda[i] >= beda[max(1, i - 3): i + 4].max() - 1e-6:
            kandidat.append((i, "keras", beda[i]))
    for i in range(1, n):
        l0, l1 = max(1, i - latar), min(n, i + latar)
        sekitar = np.concatenate([D[l0: max(l0, i - radius)], D[min(l1, i + radius + 1): l1]])
        dasar = np.median(sekitar) if len(sekitar) else 0
        if D[i] >= 9 and D[i] >= 2.5 * max(dasar, 1) and D[i] >= D[max(1, i - radius): i + radius + 1].max() - 1e-6:
            a_ = max(1, i - j)
            pusat = a_ + int(np.argmax(beda[a_: i + 1]))
            kandidat.append((pusat, "halus", D[i]))
    kandidat.sort()
    pot, jenis = [], []
    jeda = max(3, int(fps * 0.5))
    for i, jn, _ in kandidat:
        if pot and i - pot[-1] < jeda:
            if jn == "keras" and jenis[-1] == "halus":
                pot[-1], jenis[-1] = i, "keras"
            continue
        pot.append(i)
        jenis.append(jn)
    # transisi halus yang ternyata satu lonjakan tajam -> keras
    for k, c in enumerate(pot):
        if jenis[k] == "halus" and beda[c] >= 0.7 * D[min(n - 1, c + 1): min(n, c + j)].max(initial=0) and beda[c] >= 12:
            jenis[k] = "keras"
    return pot, jenis, beda, D


def palet(img, k=6):
    q = img.convert("RGB").resize((90, 160)).quantize(colors=k, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()[: k * 3]
    jumlah = sorted(q.getcolors(), reverse=True)
    hasil = []
    for c, i in jumlah[:k]:
        r, g, b = pal[i * 3: i * 3 + 3]
        hasil.append({"hex": f"#{r:02x}{g:02x}{b:02x}", "porsi": round(c / (90 * 160), 3)})
    return hasil


def ambil_frame(video, t, lebar=360):
    raw = jalan(["ffmpeg", "-v", "error", "-ss", f"{max(0, t):.3f}", "-i", video, "-frames:v", "1", "-vf", f"scale={lebar}:-2", "-f", "image2pipe", "-vcodec", "png", "-"]).stdout
    from io import BytesIO

    return Image.open(BytesIO(raw)).convert("RGB")


def ambil_frame_indeks(video, idx_list, fps, lebar=240):
    # ambil frame tepat berdasarkan nomor frame
    sel = "+".join(f"eq(n\\,{i})" for i in idx_list)
    raw = jalan(["ffmpeg", "-v", "error", "-i", video, "-vf", f"select='{sel}',scale={lebar}:-2", "-vsync", "0", "-f", "image2pipe", "-vcodec", "png", "-"]).stdout
    from io import BytesIO

    hasil = []
    # pisahkan PNG berurutan
    tanda = b"\x89PNG\r\n\x1a\n"
    bagian = raw.split(tanda)[1:]
    for b in bagian:
        hasil.append(Image.open(BytesIO(tanda + b)).convert("RGB"))
    return hasil


def tempel_label(img, teks):
    d = ImageDraw.Draw(img)
    try:
        fnt = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf", 18)
    except OSError:
        fnt = ImageFont.load_default()
    d.rectangle([0, 0, img.width, 26], fill=(0, 0, 0))
    d.text((6, 4), teks, fill=(255, 255, 0), font=fnt)
    return img


def grid(imgs, kolom, jarak=6, latar=(30, 30, 30)):
    if not imgs:
        return Image.new("RGB", (10, 10))
    w, h = imgs[0].size
    baris = (len(imgs) + kolom - 1) // kolom
    kanvas = Image.new("RGB", (kolom * (w + jarak) + jarak, baris * (h + jarak) + jarak), latar)
    for i, im in enumerate(imgs):
        kanvas.paste(im.resize((w, h)), (jarak + (i % kolom) * (w + jarak), jarak + (i // kolom) * (h + jarak)))
    return kanvas


def audio_onset(video, fps):
    try:
        raw = jalan(["ffmpeg", "-v", "error", "-i", video, "-vn", "-ac", "1", "-ar", "16000", "-f", "s16le", "-"]).stdout
    except subprocess.CalledProcessError:
        return None
    x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    if len(x) < 16000:
        return None
    hop = int(16000 / fps)
    win = 1024
    n = (len(x) - win) // hop
    jendela = np.hanning(win)
    mag = np.array([np.abs(np.fft.rfft(x[i * hop: i * hop + win] * jendela)) for i in range(n)])
    flux = np.maximum(0, np.diff(np.log1p(mag * 10), axis=0)).sum(axis=1)
    flux = np.concatenate([[0], flux])
    rms = np.sqrt((mag ** 2).mean(axis=1))
    if flux.max() > 0:
        flux = flux / flux.max()
    # puncak onset
    ambang = np.mean(flux) + 1.2 * np.std(flux)
    onset = [i for i in range(1, len(flux) - 1) if flux[i] > ambang and flux[i] >= flux[i - 1] and flux[i] >= flux[i + 1]]
    # tempo dari autokorelasi envelope onset (60-180 BPM)
    env = flux - flux.mean()
    ac = np.correlate(env, env, mode="full")[len(env) - 1:]
    lag_min = int(fps * 60 / 180)
    lag_max = int(fps * 60 / 60)
    bpm = None
    if lag_max < len(ac):
        lag = lag_min + int(np.argmax(ac[lag_min:lag_max]))
        bpm = round(60 * fps / lag, 1)
    return {"flux": flux, "rms": rms, "onset": onset, "bpm": bpm}


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    video, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    m = meta(video)
    fps = m["fps"]
    print("meta:", m)
    frames = baca_frame(video)
    n = len(frames)
    pot, jenis_pot, beda, skor = deteksi_potongan(frames, fps)
    batas = [0] + pot + [n]
    shots = [(batas[i], batas[i + 1]) for i in range(len(batas) - 1)]
    durasi = [(b - a) / fps for a, b in shots]
    terang = frames.mean(axis=(1, 2, 3))
    mx = frames.max(axis=3)
    mn = frames.min(axis=3)
    satur = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0).mean(axis=(1, 2))

    # frame tengah & palet tiap shot
    info_shot = []
    for i, (a, b) in enumerate(shots):
        t = (a + b) / 2 / fps
        img = ambil_frame(video, t, 360)
        img.save(os.path.join(out, f"shot_{i:02d}.jpg"), quality=88)
        info_shot.append(
            {
                "no": i,
                "mulai": round(a / fps, 2),
                "durasi": round((b - a) / fps, 2),
                "gerak_rata": round(float(beda[a + 1: b].mean()) if b - a > 1 else 0, 2),
                "kecerahan": round(float(terang[a:b].mean()), 1),
                "saturasi": round(float(satur[a:b].mean()), 3),
                "palet": palet(img),
            }
        )

    # strip transisi di sekitar tiap potongan
    for k, c in enumerate(pot):
        idx = [i for i in [c - 4, c - 2, c - 1, c, c + 1, c + 2, c + 4] if 0 <= i < n]
        imgs = ambil_frame_indeks(video, idx, fps, 200)
        imgs = [tempel_label(im, f"{(j - c):+d}f") for im, j in zip(imgs, idx)]
        g = grid(imgs, len(imgs))
        tempel_label(g, f"#{k:02d}  t={c / fps:.2f}s  {jenis_pot[k]}")
        g.save(os.path.join(out, f"transisi_{k:02d}.jpg"), quality=88)

    # lembar kontak tiap 0,5 detik
    tiap = max(1, int(round(fps / 2)))
    idx = list(range(0, n, tiap))
    imgs = ambil_frame_indeks(video, idx, fps, 180)
    imgs = [tempel_label(im, f"{i / fps:05.2f}s") for im, i in zip(imgs, idx)]
    grid(imgs, 10).save(os.path.join(out, "lembar_kontak.jpg"), quality=85)

    # 3 detik pertama, tiap 2 frame
    idx = list(range(0, min(n, int(fps * 3)), 2))
    imgs = ambil_frame_indeks(video, idx, fps, 160)
    imgs = [tempel_label(im, f"f{i}") for im, i in zip(imgs, idx)]
    grid(imgs, 9).save(os.path.join(out, "hook.jpg"), quality=85)

    aud = audio_onset(video, fps) if m["audio"] else None
    cocok = None
    if aud and pot:
        on = np.array(aud["onset"])
        if len(on):
            dekat = [int(np.min(np.abs(on - c))) for c in pot]
            cocok = {
                "potongan_dalam_2_frame_dari_ketukan": round(sum(d <= 2 for d in dekat) / len(dekat), 2),
                "jarak_median_frame": float(np.median(dekat)),
            }

    # kurva
    try:
        import matplotlib

        matplotlib.use("Agg")
        import matplotlib.pyplot as plt

        t = np.arange(n) / fps
        baris = 3 if aud else 2
        fig, ax = plt.subplots(baris, 1, figsize=(14, 2.6 * baris), sharex=True)
        ax[0].plot(t, beda, lw=0.8)
        ax[0].set_ylabel("perubahan")
        for c in pot:
            for a_ in ax:
                a_.axvline(c / fps, color="r", lw=0.6, alpha=0.6)
        ax[1].plot(t, terang, lw=0.8, label="kecerahan")
        ax[1].plot(t, satur * 255, lw=0.8, label="saturasi×255")
        ax[1].legend(loc="upper right")
        if aud:
            ta = np.arange(len(aud["flux"])) / fps
            ax[2].plot(ta, aud["flux"], lw=0.7)
            ax[2].set_ylabel("onset audio")
        ax[-1].set_xlabel("detik")
        fig.tight_layout()
        fig.savefig(os.path.join(out, "kurva.png"), dpi=90)
    except ImportError:
        pass

    laporan = {
        "meta": m,
        "jumlah_frame": n,
        "potongan_detik": [round(c / fps, 3) for c in pot],
        "jenis_potongan": jenis_pot,
        "potongan_keras": jenis_pot.count("keras"),
        "transisi_halus": jenis_pot.count("halus"),
        "jumlah_shot": len(shots),
        "durasi_shot": {
            "rata": round(float(np.mean(durasi)), 2),
            "median": round(float(np.median(durasi)), 2),
            "min": round(float(np.min(durasi)), 2),
            "max": round(float(np.max(durasi)), 2),
        },
        "potongan_per_detik": round(len(pot) / max(0.01, m["durasi"]), 2),
        "gerak_rata_video": round(float(beda.mean()), 2),
        "audio": {"bpm_perkiraan": aud["bpm"], "jumlah_onset": len(aud["onset"])} if aud else None,
        "kecocokan_potongan_ketukan": cocok,
        "shot": info_shot,
    }
    with open(os.path.join(out, "laporan.json"), "w") as fh:
        json.dump(laporan, fh, indent=2, ensure_ascii=False)
    with open(os.path.join(out, "laporan.md"), "w") as fh:
        fh.write(f"# Analisis {os.path.basename(video)}\n\n")
        fh.write(f"- {m['lebar']}×{m['tinggi']}, {m['fps']} fps, {m['durasi']:.2f} detik, audio: {m['audio']}\n")
        fh.write(f"- {len(shots)} shot, {len(pot)} pergantian ({laporan['potongan_keras']} potongan keras, {laporan['transisi_halus']} transisi halus), {laporan['potongan_per_detik']}/detik\n")
        fh.write(f"- durasi shot: rata {laporan['durasi_shot']['rata']} s, median {laporan['durasi_shot']['median']} s, min {laporan['durasi_shot']['min']} s, max {laporan['durasi_shot']['max']} s\n")
        if aud:
            fh.write(f"- tempo perkiraan: {aud['bpm']} BPM; onset: {len(aud['onset'])}\n")
        if cocok:
            fh.write(f"- potongan yang jatuh ≤2 frame dari ketukan: {int(cocok['potongan_dalam_2_frame_dari_ketukan'] * 100)}%\n")
        fh.write("\n| shot | mulai | durasi | gerak | terang | saturasi | palet |\n|---|---|---|---|---|---|---|\n")
        for s in info_shot:
            fh.write(f"| {s['no']} | {s['mulai']} | {s['durasi']} | {s['gerak_rata']} | {s['kecerahan']} | {s['saturasi']} | {' '.join(p['hex'] for p in s['palet'][:4])} |\n")
    print(json.dumps({k: laporan[k] for k in ["jumlah_shot", "durasi_shot", "potongan_per_detik", "audio", "kecocokan_potongan_ketukan"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
