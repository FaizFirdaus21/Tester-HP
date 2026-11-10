#!/usr/bin/env python3
"""Pasang hasil TTS agar dipakai Remotion.

Pakai:
  python3 scripts/pasang_vo.py out/vo
      demo inflasi: public/vo/inflasi.mp3 + src/catatan/demo/vo-waktu.json
  python3 scripts/pasang_vo.py produksi/<tanggal>-<slug>/vo --slug <slug>
      video produksi: public/vo/<slug>.mp3 + produksi/<tanggal>-<slug>/vo-waktu.json,
      lalu status.json di folder itu diset ke tahap "vo-siap".
      <slug> boleh dengan atau tanpa awalan tanggal (contoh: bunga-deposito-lps).
"""
import argparse
import datetime
import glob
import json
import os
import subprocess
import sys


def cari_folder(slug, akar="produksi"):
    if os.path.isdir(os.path.join(akar, slug)):
        return os.path.join(akar, slug)
    cocok = sorted(p for p in glob.glob(os.path.join(akar, f"*-{slug}")) if os.path.isdir(p))
    if len(cocok) != 1:
        sys.exit(f"Folder produksi untuk slug '{slug}' {'tidak ditemukan' if not cocok else 'lebih dari satu: ' + ', '.join(cocok)}.")
    return cocok[0]


def slug_pendek(folder):
    """'20261109-bunga-deposito-lps' -> 'bunga-deposito-lps' (awalan tanggal 8 digit dibuang)."""
    nama = os.path.basename(os.path.normpath(folder))
    awal, _, sisa = nama.partition("-")
    return sisa if len(awal) == 8 and awal.isdigit() and sisa else nama


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("src", nargs="?", default="out/vo", help="folder keluaran tts_gemini.py")
    ap.add_argument("--slug", help="pasang untuk video di produksi/*-<slug>")
    arg = ap.parse_args(argv)

    w = json.load(open(os.path.join(arg.src, "waktu.json")))
    if arg.slug:
        folder = cari_folder(arg.slug)
        nama = slug_pendek(folder)
        tujuan_json = os.path.join(folder, "vo-waktu.json")
    else:
        folder, nama, tujuan_json = None, "inflasi", "src/catatan/demo/vo-waktu.json"

    os.makedirs("public/vo", exist_ok=True)
    mp3 = f"public/vo/{nama}.mp3"
    # simpan sebagai MP3 (lebih kecil untuk repo); WAV aslinya tetap di folder sumber
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(arg.src, "vo.wav"),
                    "-c:a", "libmp3lame", "-b:a", "160k", mp3], check=True)
    data = {"audio": f"vo/{nama}.mp3", "catatan": f"Dibuat dengan {w['model']}, suara {w['suara']}.",
            "total": w["total"], "blok": [{"mulai": b["mulai"], "durasi": b["durasi"]} for b in w["blok"]]}
    if folder:
        for d, b in zip(data["blok"], w["blok"]):
            d["teks"] = b["teks"]  # membantu Director menyinkronkan visual per blok
    json.dump(data, open(tujuan_json, "w"), indent=2, ensure_ascii=False)
    print("VO terpasang:", data["total"], "detik,", len(data["blok"]), "blok ->", mp3, "+", tujuan_json)

    if folder:
        jalur = os.path.join(folder, "status.json")
        status = json.load(open(jalur)) if os.path.exists(jalur) else {"slug": os.path.basename(folder)}
        status["tahap"] = "vo-siap"
        lama = status.get("catatan", "")
        status["catatan"] = (lama + " | " if lama else "") + f"VO {data['total']} detik, {len(data['blok'])} blok, {data['audio']} ({w['model']}, suara {w['suara']})."
        status["diperbarui"] = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        json.dump(status, open(jalur, "w"), indent=2, ensure_ascii=False)
        open(jalur, "a").write("\n")
        print("status.json ->", status["tahap"])


if __name__ == "__main__":
    main()
