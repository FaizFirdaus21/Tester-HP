#!/usr/bin/env python3
"""Perkaya vo-waktu.json dengan batas bicara dan jangkar kalimat dari audio, untuk sinkron visual (Director).

Pakai: python3 scripts/sinkron_vo.py produksi/<tanggal>-<slug> src/produksi/<slug>/vo-waktu.json
       python3 scripts/sinkron_vo.py produksi/<tanggal>-<slug>/vo-waktu-v2.json src/produksi/<slug>-v2/vo-waktu.json

Untuk tiap blok ditambahkan:
  bicara  : [awal, akhir] suara benar-benar terdengar (detik di file audio), tanpa hening di ujung blok
  jangkar : [{huruf, detik}] posisi huruf di teks VO -> detik relatif terhadap bicara[0]. Diambil dari jeda
            di audio yang cocok dengan tanda baca (. ? ! , :). Di antara jangkar, waktu diinterpolasi per huruf.
File sumber di produksi/ tidak diubah.
"""
import json
import os
import re
import subprocess
import sys

AMBANG_DB = -38  # di bawah ini dianggap hening
JEDA_MIN = 0.18  # detik
CARI = 1.5  # jendela pencocokan jeda vs perkiraan (detik)


def hening(audio):
    keluar = subprocess.run(
        ["ffmpeg", "-v", "info", "-i", audio, "-af", f"silencedetect=noise={AMBANG_DB}dB:d={JEDA_MIN}", "-f", "null", "-"],
        capture_output=True, text=True, check=True,
    ).stderr
    awal = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", keluar)]
    akhir = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", keluar)]
    return list(zip(awal, akhir))


def main():
    folder, tujuan = sys.argv[1], sys.argv[2]
    sumber = folder if os.path.isfile(folder) else os.path.join(folder, "vo-waktu.json")
    vo = json.load(open(sumber))
    sel = hening(os.path.join("public", vo["audio"]))
    for b in vo["blok"]:
        m, s = b["mulai"], b["mulai"] + b["durasi"]
        bm, be = m, s
        for a, e in sel:
            if a <= m + 0.05 and e > m:  # hening di awal blok
                bm = max(bm, e)
            if a < s and e >= s - 0.05 and a > m:  # hening di ujung blok
                be = min(be, a)
        teks = b["teks"].strip()
        n = len(teks)
        dalam = [(a, e) for a, e in sel if a > bm + 0.05 and e < be - 0.05]
        jangkar = [{"huruf": 0, "detik": 0.0}]
        dipakai = set()
        for mt in re.finditer(r"[.?!,:]\s+", teks):
            huruf = mt.end()
            kira = bm + (be - bm) * huruf / n
            calon = [(abs((a + e) / 2 - kira), i, a, e) for i, (a, e) in enumerate(dalam) if i not in dipakai and abs((a + e) / 2 - kira) < CARI]
            if not calon:
                continue
            _, i, a, e = min(calon)
            if e - bm <= jangkar[-1]["detik"]:
                continue  # jaga urutan
            dipakai.add(i)
            jangkar.append({"huruf": huruf, "detik": round(e - bm, 3)})
        jangkar.append({"huruf": n, "detik": round(be - bm, 3)})
        b["bicara"] = [round(bm, 3), round(be, 3)]
        b["jangkar"] = jangkar
    vo["catatan"] = (vo.get("catatan") or "") + " Diperkaya scripts/sinkron_vo.py (bicara + jangkar kalimat)."
    os.makedirs(os.path.dirname(tujuan), exist_ok=True)
    json.dump(vo, open(tujuan, "w"), indent=2, ensure_ascii=False)
    hening_total = sum(b["durasi"] - (b["bicara"][1] - b["bicara"][0]) for b in vo["blok"])
    print(f"{len(vo['blok'])} blok; hening di ujung blok total {hening_total:.1f} s; jangkar: {[len(b['jangkar']) - 2 for b in vo['blok']]}")


if __name__ == "__main__":
    main()
