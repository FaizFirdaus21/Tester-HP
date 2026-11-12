#!/usr/bin/env python3
"""QC Reels sebelum tayang otomatis (tanpa persetujuan user).

Pakai: python3 scripts/qc_reels.py produksi/<slug>/final.mp4 src/produksi/<slug>/vo-waktu.json [--awal 0.4] [--jeda 0.4] [--log out/render.log]

Memeriksa:
  1. look.py: G0 (render utuh, ada audio) dan G2 (tidak ada frame kosong) wajib PASS. G3 (end hold) hanya catatan.
  2. Sambungan audio per blok (rapatkanVO): puncak ±5 ms di setiap titik potong harus < -40 dBFS dan lompatan
     sampel < 0,01 (tanpa klik, tanpa ucapan terpotong).
  3. Ekor audio: suara harus berhenti sebelum video berakhir (tidak ada ucapan yang terpotong di akhir).
  4. Log render (bila --log): tidak boleh ada peringatan [jadwal] atau [ilustrasi].
  5. Frame akhir disimpan ke <folder video>/qc-akhir.png untuk dicek dengan mata (tagline utuh, tidak terpotong).
  6. Frame akhir: tidak boleh ada tulisan terang yang menyentuh tepi kiri/kanan layar (indikasi terpotong).
Keluar dengan kode 2 bila ada yang gagal.
"""
import argparse
import json
import os
import re
import subprocess
import sys

import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("video")
ap.add_argument("vo")
ap.add_argument("--awal", type=float, default=0.4)
ap.add_argument("--jeda", type=float, default=0.4)
ap.add_argument("--tepi", type=float, nargs=2, default=[0.06, 0.12])
ap.add_argument("--log")
a = ap.parse_args()

gagal: list[str] = []
catatan: list[str] = []
folder = os.path.dirname(a.video)

# 1. look.py
look = subprocess.run(
    [sys.executable, ".claude/skills/motionmaxxing/scripts/look.py", a.video, "--out", os.path.join("out", "look-qc"), "--expect-audio"],
    capture_output=True, text=True,
).stdout
for gate in ("G0", "G2"):
    m = re.search(rf"^\s*{gate} .*?(PASS|FAIL).*$", look, re.M)
    if not m or m.group(1) != "PASS":
        gagal.append(f"look.py {gate}: {m.group(0).strip() if m else 'tidak ada hasil'}")
m = re.search(r"^\s*G3 .*$", look, re.M)
if m and "FAIL" in m.group(0):
    catatan.append("G3 " + m.group(0).split("FAIL", 1)[1].strip() + " (cek frame akhir dengan mata)")
durasi = float(re.search(r"duration\s+([\d.]+)s", look).group(1))
lufs = re.search(r"integrated (-?[\d.]+) LUFS", look)

# 2 & 3. audio
raw = os.path.join("out", "qc-audio.raw")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.video, "-vn", "-ac", "1", "-ar", "48000", "-f", "s16le", raw], check=True)
x = np.fromfile(raw, dtype=np.int16).astype(np.float32) / 32768
sr = 48000
vo = json.load(open(a.vo))
t = 0.0
terburuk, lompat, n = -200.0, 0.0, 0
for b in vo["blok"]:
    bm, be = b.get("bicara", [b["mulai"], b["mulai"] + b["durasi"]])
    s0, s1 = max(0, bm - a.tepi[0]), be + a.tepi[1]
    for tt in (a.awal + t, a.awal + t + (s1 - s0)):
        k = min(int(round(tt * sr)), len(x) - 1)
        puncak = 20 * np.log10(np.max(np.abs(x[max(0, k - 240) : k + 240])) + 1e-9)
        terburuk = max(terburuk, puncak)
        lompat = max(lompat, abs(float(x[k] - x[k - 1])))
        n += 1
    akhir_suara = a.awal + t + (s1 - s0)
    t += (s1 - s0) + a.jeda
if terburuk > -40 or lompat > 0.01:
    gagal.append(f"sambungan audio: puncak terburuk {terburuk:.1f} dBFS, lompatan {lompat:.4f} (batas -40 dBFS / 0,01)")
if akhir_suara > durasi - 0.2:
    gagal.append(f"suara berakhir {akhir_suara:.2f} s, video {durasi:.2f} s: ucapan bisa terpotong di akhir")

# 4. log render
if a.log and os.path.exists(a.log):
    pesan = sorted(set(re.findall(r"\[(?:jadwal|ilustrasi)\][^\n]*", open(a.log, errors="ignore").read())))
    for p in pesan:
        gagal.append(f"log render: {p}")

# 5. frame akhir
akhir = os.path.join(folder, "qc-akhir.png")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-sseof", "-0.1", "-i", a.video, "-frames:v", "1", "-update", "1", akhir], check=True)

# 6. tulisan menyentuh tepi kiri/kanan layar di frame akhir (indikasi terpotong)
from PIL import Image

g = np.asarray(Image.open(akhir).convert("L"), dtype=np.float32)
pita = g[200:1500]
for nama, kolom in (("kiri", pita[:, :8]), ("kanan", pita[:, -8:])):
    if (kolom > 185).mean() > 0.004:
        gagal.append(f"frame akhir: ada tulisan/coretan terang di tepi {nama} layar (kemungkinan terpotong)")

print(f"video      {a.video}: {durasi:.2f} s, {os.path.getsize(a.video) / 1e6:.1f} MB, {lufs.group(1) if lufs else '?'} LUFS")
print(f"sambungan  {n} titik: puncak terburuk {terburuk:.1f} dBFS, lompatan maks {lompat:.4f}")
print(f"frame akhir {akhir} (cek dengan mata: tagline utuh, tidak terpotong)")
for c in catatan:
    print(f"catatan    {c}")
if gagal:
    print("QC REELS GAGAL:")
    for g in gagal:
        print(f"  - {g}")
    sys.exit(2)
print("QC REELS LOLOS (otomatis). Frame akhir tetap dicek dengan mata.")
