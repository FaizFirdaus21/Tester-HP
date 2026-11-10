#!/usr/bin/env python3
"""Uji pasang_vo.py tanpa API: WAV buatan di folder sementara, mode demo dan mode --slug.

Pakai: python3 scripts/uji_pasang_vo.py
"""
import json
import os
import subprocess
import sys
import tempfile
import wave

SKRIP = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pasang_vo.py")


def wav_buatan(folder, det=3.0):
    os.makedirs(folder, exist_ok=True)
    with wave.open(os.path.join(folder, "vo.wav"), "wb") as w:
        w.setnchannels(1), w.setsampwidth(2), w.setframerate(24000)
        w.writeframes(b"\x10\x00" * int(24000 * det))
    blok = [{"blok": 0, "mulai": 0.0, "durasi": 1.2, "teks": "Halo."}, {"blok": 1, "mulai": 1.9, "durasi": 1.1, "teks": "Dua."}]
    json.dump({"model": "uji-tts", "suara": "Sulafat", "total": 3.0, "blok": blok}, open(os.path.join(folder, "waktu.json"), "w"))


def jalan(cwd, *a, gagal=False):
    r = subprocess.run([sys.executable, SKRIP, *a], cwd=cwd, capture_output=True, text=True)
    assert (r.returncode != 0) == gagal, r.stdout + r.stderr
    return r.stdout + r.stderr


def durasi(p):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p],
                                capture_output=True, text=True, check=True).stdout)


with tempfile.TemporaryDirectory() as d:
    os.makedirs(os.path.join(d, "src/catatan/demo"))
    prod = os.path.join(d, "produksi/20261109-bunga-deposito-lps")
    os.makedirs(prod)
    json.dump({"slug": "20261109-bunga-deposito-lps", "tahap": "naskah-siap", "catatan": "lama"}, open(os.path.join(prod, "status.json"), "w"))

    # 1. tanpa --slug: perilaku lama
    wav_buatan(os.path.join(d, "out/vo"))
    jalan(d, "out/vo")
    v = json.load(open(os.path.join(d, "src/catatan/demo/vo-waktu.json")))
    assert v["audio"] == "vo/inflasi.mp3" and len(v["blok"]) == 2 and "teks" not in v["blok"][0]
    assert abs(durasi(os.path.join(d, "public/vo/inflasi.mp3")) - 3.0) < 0.1
    print("ok  mode demo -> public/vo/inflasi.mp3 + src/catatan/demo/vo-waktu.json")

    # 2. --slug pendek (tanpa tanggal)
    wav_buatan(os.path.join(prod, "vo"))
    jalan(d, "produksi/20261109-bunga-deposito-lps/vo", "--slug", "bunga-deposito-lps")
    v = json.load(open(os.path.join(prod, "vo-waktu.json")))
    s = json.load(open(os.path.join(prod, "status.json")))
    assert v["audio"] == "vo/bunga-deposito-lps.mp3" and v["blok"][1]["teks"] == "Dua."
    assert os.path.exists(os.path.join(d, "public/vo/bunga-deposito-lps.mp3"))
    assert s["catatan"].startswith("lama | VO ")
    assert s["tahap"] == "vo-siap" and s["slug"] == "20261109-bunga-deposito-lps" and s["diperbarui"].endswith("Z")
    print("ok  --slug bunga-deposito-lps -> public/vo/bunga-deposito-lps.mp3, vo-waktu.json, status vo-siap")

    # 3. --slug lengkap dengan tanggal -> MP3 tetap tanpa tanggal
    jalan(d, "produksi/20261109-bunga-deposito-lps/vo", "--slug", "20261109-bunga-deposito-lps")
    assert json.load(open(os.path.join(prod, "vo-waktu.json")))["audio"] == "vo/bunga-deposito-lps.mp3"
    print("ok  --slug dengan tanggal")

    # 3b. --versi v2: file baru, v1 dan status.json tidak berubah
    sebelum = {f: open(os.path.join(prod, f)).read() for f in ("vo-waktu.json", "status.json")}
    mp3_v1 = open(os.path.join(d, "public/vo/bunga-deposito-lps.mp3"), "rb").read()
    jalan(d, "produksi/20261109-bunga-deposito-lps/vo", "--slug", "bunga-deposito-lps", "--versi", "v2")
    assert json.load(open(os.path.join(prod, "vo-waktu-v2.json")))["audio"] == "vo/bunga-deposito-lps-v2.mp3"
    assert os.path.exists(os.path.join(d, "public/vo/bunga-deposito-lps-v2.mp3"))
    assert all(open(os.path.join(prod, f)).read() == isi for f, isi in sebelum.items())
    assert open(os.path.join(d, "public/vo/bunga-deposito-lps.mp3"), "rb").read() == mp3_v1
    jalan(d, "out/vo", "--versi", "v2", gagal=True)
    print("ok  --versi v2 -> file -v2, v1 dan status.json utuh")

    # 4. slug tidak ada / ganda -> berhenti tanpa menulis
    print("ok  slug tidak ada ditolak:", jalan(d, "out/vo", "--slug", "tidak-ada", gagal=True).strip())
    os.makedirs(os.path.join(d, "produksi/20261201-bunga-deposito-lps"))
    print("ok  slug ganda ditolak:", jalan(d, "out/vo", "--slug", "bunga-deposito-lps", gagal=True).strip()[:70], "...")
print("semua uji lolos")
