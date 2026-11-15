#!/usr/bin/env python3
"""Sintesis efek suara pendek untuk Reels v3 (tanpa aset luar, deterministik).

Pakai: python3 scripts/buat_sfx.py public/sfx/tak-kapur.wav
"tak" kapur di papan: ketukan pendek (derau berpita 1,5–5 kHz, peluruhan cepat) + dentum kayu rendah ±180 Hz.
Panjang 0,18 s, 48 kHz mono, puncak -6 dBFS.
"""
import sys, wave
import numpy as np

sr = 48000
n = int(0.18 * sr)
t = np.arange(n) / sr
rng = np.random.default_rng(7)
derau = rng.standard_normal(n)
# pita sederhana: selisih dua rata-rata bergerak (high-pass + low-pass kasar)
def rata(x, k):
    return np.convolve(x, np.ones(k) / k, mode="same")
pita = rata(derau, 6) - rata(derau, 30)
ketuk = pita * np.exp(-t / 0.012)
dentum = np.sin(2 * np.pi * 180 * t) * np.exp(-t / 0.035) * 0.6
x = ketuk + dentum
x[: int(0.002 * sr)] *= np.linspace(0, 1, int(0.002 * sr))  # serangan 2 ms tanpa klik
x = x / np.max(np.abs(x)) * 10 ** (-6 / 20)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(sr)
    w.writeframes((x * 32767).astype(np.int16).tobytes())
print(sys.argv[1], f"{n / sr:.2f} s")
