#!/usr/bin/env python3
"""Susun storyboard.png dari still Remotion (keluaran scripts/stills.mjs).

Pakai: python3 scripts/storyboard.py <dir-still> <out.png> "<judul>"
"""
import sys, glob, os
from PIL import Image, ImageDraw, ImageFont
d, out, judul = sys.argv[1], sys.argv[2], sys.argv[3]
fs = sorted(glob.glob(os.path.join(d, "*-[0-9][0-9][0-9][0-9][0-9].png")))
W, H, pad, lab, kol = 360, 640, 14, 34, 6
rows = (len(fs) + kol - 1) // kol
img = Image.new("RGB", (kol * (W + pad) + pad, 70 + rows * (H + lab + pad) + pad), "#1d1a17")
dr = ImageDraw.Draw(img)
try:
    f1 = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 22)
    f2 = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 30)
except OSError:
    f1 = f2 = ImageFont.load_default()
dr.text((pad, 20), judul, fill="#f2e8d5", font=f2)
for i, f in enumerate(fs):
    n = int(os.path.basename(f).rsplit("-", 1)[1].split(".")[0])
    x, y = pad + (i % kol) * (W + pad), 70 + (i // kol) * (H + lab + pad)
    img.paste(Image.open(f).convert("RGB").resize((W, H), Image.LANCZOS), (x, y))
    dr.text((x, y + H + 6), f"{i+1:02d} · frame {n} · {n/30:.1f} s", fill="#d9cbb1", font=f1)
img.save(out, optimize=True)
print(out, img.size)
