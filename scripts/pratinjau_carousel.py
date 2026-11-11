#!/usr/bin/env python3
"""Lembar pratinjau carousel: slide-01..NN.png berdampingan (3 kolom) dengan judul.

Pakai: python3 scripts/pratinjau_carousel.py <folder-slide> "<judul>" [keluar.png]
"""
import glob
import os
import sys

from PIL import Image, ImageDraw, ImageFont

folder, judul = sys.argv[1], sys.argv[2]
keluar = sys.argv[3] if len(sys.argv) > 3 else os.path.join(folder, "pratinjau.png")
fs = sorted(glob.glob(os.path.join(folder, "slide-[0-9][0-9].png")))
if not fs:
    sys.exit(f"Tidak ada slide-NN.png di {folder}")
W, H, pad, kol = 540, 675, 14, 3
baris = (len(fs) + kol - 1) // kol
img = Image.new("RGB", (kol * W + (kol + 1) * pad, baris * H + (baris + 1) * pad + 50), "#1d1a17")
d = ImageDraw.Draw(img)
try:
    f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 26)
except OSError:
    f = ImageFont.load_default()
d.text((pad, 14), judul, fill="#f2e8d5", font=f)
for i, fn in enumerate(fs):
    img.paste(Image.open(fn).convert("RGB").resize((W, H), Image.LANCZOS), (pad + (i % kol) * (W + pad), 50 + pad + (i // kol) * (H + pad)))
img.save(keluar, optimize=True)
print(keluar)
