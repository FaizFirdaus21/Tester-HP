"""Buat tekstur papan tulis hijau untuk template Papan Kapur.

Hasil: public/papan/papan.jpg (1080x3840, ditampilkan 2x lebih besar di Remotion).
Isinya: hijau papan dengan belang halus, bekas hapusan berbentuk sapuan melengkung,
sisa tulisan samar, dan debu kapur yang lebih tebal di bagian bawah (dekat tempat kapur).
Deterministik (seed tetap) supaya render selalu sama.
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H = 1080, 3840
rng = np.random.default_rng(21)


def derau(skala: int) -> np.ndarray:
    """Derau halus: acak kecil yang diperbesar dengan interpolasi."""
    kecil = rng.random((H // skala + 2, W // skala + 2)).astype(np.float32)
    img = Image.fromarray((kecil * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
    return np.asarray(img, dtype=np.float32) / 255.0


def main(keluar: Path) -> None:
    dasar = np.array([40, 70, 56], dtype=np.float32)  # hijau papan
    belang = 0.55 * derau(240) + 0.3 * derau(60) + 0.15 * derau(12)
    rgb = dasar[None, None, :] * (0.86 + 0.28 * belang[..., None])

    # bekas hapusan: sapuan melengkung putih sangat tipis
    lapis = Image.new("L", (W, H), 0)
    g = ImageDraw.Draw(lapis)
    for _ in range(46):
        cx, cy = rng.uniform(-100, W + 100), rng.uniform(0, H)
        rx, ry = rng.uniform(200, 600), rng.uniform(30, 260)
        a0 = rng.uniform(0, 360)
        tebal = int(rng.uniform(30, 70))
        for k in range(int(rng.integers(3, 9))):
            g.arc(
                [cx - rx, cy - ry + k * tebal * 0.6, cx + rx, cy + ry + k * tebal * 0.6],
                a0,
                a0 + rng.uniform(40, 130),
                fill=int(rng.uniform(9, 20)),
                width=tebal,
            )
    # sisa tulisan samar (coretan pendek acak)
    for _ in range(260):
        x, y = rng.uniform(0, W), rng.uniform(0, H)
        pts = [(x, y)]
        for _ in range(int(rng.integers(3, 8))):
            x += rng.uniform(-28, 28)
            y += rng.uniform(-14, 14)
            pts.append((x, y))
        g.line(pts, fill=int(rng.uniform(8, 20)), width=3)
    lapis = lapis.filter(ImageFilter.GaussianBlur(14))
    hapus = np.asarray(lapis, dtype=np.float32) / 255.0

    # debu kapur: bintik halus, lebih banyak ke bawah
    debu = rng.random((H, W)).astype(np.float32)
    gradien = np.linspace(0.0, 1.0, H, dtype=np.float32)[:, None] ** 3
    debu = (debu > 0.996 - 0.006 * gradien).astype(np.float32) * 0.35
    debu = np.asarray(Image.fromarray((debu * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7)), dtype=np.float32) / 255.0

    kapur = np.array([225, 230, 220], dtype=np.float32)
    campur = np.clip(hapus * 1.0 + debu, 0, 1)[..., None]
    rgb = rgb * (1 - campur) + kapur[None, None, :] * campur

    # butiran halus permukaan
    rgb += (rng.random((H, W, 1)).astype(np.float32) - 0.5) * 6
    keluar.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).save(keluar, quality=88)
    print(keluar, keluar.stat().st_size // 1024, "KB")


if __name__ == "__main__":
    main(Path(sys.argv[1]) if len(sys.argv) > 1 else Path("public/papan/papan.jpg"))
