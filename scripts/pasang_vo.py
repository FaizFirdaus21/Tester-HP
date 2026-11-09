#!/usr/bin/env python3
"""Salin hasil TTS ke public/vo/ dan isi src/catatan/demo/vo-waktu.json agar template Buku Catatan tersinkron.

Pakai: python3 scripts/pasang_vo.py out/vo
"""
import json
import os
import shutil
import subprocess
import sys

src = sys.argv[1] if len(sys.argv) > 1 else "out/vo"
w = json.load(open(os.path.join(src, "waktu.json")))
os.makedirs("public/vo", exist_ok=True)
# simpan sebagai MP3 (lebih kecil untuk repo); WAV aslinya tetap di out/vo
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(src, "vo.wav"), "-c:a", "libmp3lame", "-b:a", "160k", "public/vo/inflasi.mp3"], check=True)
data = {"audio": "vo/inflasi.mp3", "catatan": f"Dibuat dengan {w['model']}, suara {w['suara']}.", "total": w["total"], "blok": [{"mulai": b["mulai"], "durasi": b["durasi"]} for b in w["blok"]]}
json.dump(data, open("src/catatan/demo/vo-waktu.json", "w"), indent=2, ensure_ascii=False)
print("VO terpasang:", data["total"], "detik,", len(data["blok"]), "blok")
