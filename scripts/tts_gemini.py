#!/usr/bin/env python3
"""Buat voice-over dari naskah per blok dengan Gemini TTS (mesin yang sama dengan AI Studio).

Pakai:
  GEMINI_API_KEY=... python3 scripts/tts_gemini.py data/vo-inflasi.json out/vo
Keluaran:
  out/vo/blok_XX.wav   satu file per blok
  out/vo/vo.wav        gabungan semua blok (dengan jeda antar-blok)
  out/vo/waktu.json    awal & durasi tiap blok (detik) untuk sinkron dengan template

Key dibaca dari variabel lingkungan GEMINI_API_KEY; jangan ditulis di file mana pun.
"""
import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request
import wave

API = "https://generativelanguage.googleapis.com/v1beta"
RATE = 24000  # Gemini TTS mengeluarkan PCM 16-bit mono 24 kHz


def panggil(url, data=None):
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        sys.exit("GEMINI_API_KEY belum diatur di environment.")
    req = urllib.request.Request(url, data=json.dumps(data).encode() if data else None, headers={"Content-Type": "application/json", "x-goog-api-key": key})
    with urllib.request.urlopen(req, timeout=180) as r:
        return json.loads(r.read())


def pilih_model(diminta):
    if diminta:
        return diminta
    daftar = panggil(f"{API}/models?pageSize=200").get("models", [])
    tts = [m["name"].split("/")[-1] for m in daftar if "tts" in m["name"].lower()]
    if not tts:
        sys.exit("Tidak ada model TTS yang tersedia untuk key ini.")
    tts.sort(key=lambda n: ("pro" not in n, n))  # utamakan kualitas tertinggi
    print("model TTS tersedia:", tts)
    return tts[0]


def tts(model, suara, gaya, teks):
    data = {
        "contents": [{"parts": [{"text": f"{gaya}:\n{teks}"}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": suara}}},
        },
    }
    for coba in range(4):
        try:
            r = panggil(f"{API}/models/{model}:generateContent", data)
            b64 = r["candidates"][0]["content"]["parts"][0]["inlineData"]["data"]
            return base64.b64decode(b64)
        except (urllib.error.HTTPError, KeyError) as e:
            if coba == 3:
                raise
            print("ulang karena:", e)
            time.sleep(2 ** (coba + 1))


def simpan(path, pcm):
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(pcm)


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    naskah = json.load(open(sys.argv[1]))
    out = sys.argv[2]
    os.makedirs(out, exist_ok=True)
    model = pilih_model(naskah.get("model"))
    suara = naskah.get("suara", "Sulafat")
    jeda = int(RATE * naskah.get("jeda_antar_blok", 0.35)) * 2
    semua, waktu, t = b"", [], 0.0
    for i, b in enumerate(naskah["blok"]):
        gaya = naskah["gaya_umum"] + " " + b["gaya"]
        pcm = tts(model, suara, gaya, b["teks"])
        simpan(os.path.join(out, f"blok_{i:02d}.wav"), pcm)
        dur = len(pcm) / 2 / RATE
        waktu.append({"blok": i, "mulai": round(t, 3), "durasi": round(dur, 3), "teks": b["teks"]})
        print(f"blok {i}: {dur:.2f} s")
        semua += pcm + b"\x00" * jeda
        t += dur + jeda / 2 / RATE
    simpan(os.path.join(out, "vo.wav"), semua)
    json.dump({"model": model, "suara": suara, "total": round(t, 3), "blok": waktu}, open(os.path.join(out, "waktu.json"), "w"), indent=2, ensure_ascii=False)
    print(f"selesai: {t:.1f} detik -> {out}/vo.wav")


if __name__ == "__main__":
    main()
