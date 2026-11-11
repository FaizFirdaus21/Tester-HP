"""Buat tekstur papan tulis hijau (versi 2) untuk template Papan Kapur.

Hasil: public/papan/papan.jpg (2160x7680, ukuran asli papan, jadi tajam saat kamera dekat).

Lapisan, dari bawah ke atas:
1. Warna dasar hijau dengan belang besar (papan tidak pernah rata warnanya).
2. Butiran batu tulis: derau halus yang memanjang horizontal.
3. Peta tinggi: goresan halus, goresan dalam, cekungan kecil. Diterangi cahaya dari kiri atas,
   jadi goresan punya sisi terang dan sisi gelap (volume), bukan sekadar garis putih.
4. Bekas hapusan: sapuan lebar searah gerakan penghapus, berserat.
5. Sisa tulisan lama yang terhapus (angka, rumus, kata) sangat samar.
6. Debu kapur: menumpuk di bawah (dekat rak) dan di pojok, plus bintik acak.
Deterministik (seed tetap) supaya render selalu sama.
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 2160, 7680
rng = np.random.default_rng(21)
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def derau(skala_x: int, skala_y: int | None = None) -> np.ndarray:
    skala_y = skala_y or skala_x
    kecil = rng.random((H // skala_y + 2, W // skala_x + 2)).astype(np.float32)
    img = Image.fromarray((kecil * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
    return np.asarray(img, dtype=np.float32) / 255.0


def ke_array(img: Image.Image) -> np.ndarray:
    return np.asarray(img, dtype=np.float32) / 255.0


def peta_tinggi() -> np.ndarray:
    """Tinggi permukaan: 0.5 = rata, <0.5 = goresan/cekung, >0.5 = tonjolan sisa kapur."""
    gores = Image.new("L", (W, H), 128)
    g = ImageDraw.Draw(gores)
    # goresan halus: banyak, pendek, arahnya cenderung berkelompok
    for _ in range(5200):
        x, y = rng.uniform(0, W), rng.uniform(0, H)
        arah = rng.choice([rng.normal(0.15, 0.25), rng.normal(1.3, 0.2), rng.uniform(0, np.pi)])
        panjang = rng.uniform(20, 160)
        lengkung = rng.normal(0, 0.004)
        pts = []
        for t in np.linspace(0, 1, 8):
            a = arah + lengkung * t * panjang
            pts.append((x + np.cos(a) * panjang * t, y + np.sin(a) * panjang * t))
        g.line(pts, fill=int(rng.uniform(96, 120)), width=1)
    # goresan dalam: sedikit, panjang
    for _ in range(140):
        x, y = rng.uniform(0, W), rng.uniform(0, H)
        a = rng.normal(0.1, 0.5)
        panjang = rng.uniform(200, 900)
        pts = [(x + np.cos(a + rng.normal(0, 0.02)) * panjang * t, y + np.sin(a) * panjang * t + rng.normal(0, 1.2)) for t in np.linspace(0, 1, 24)]
        g.line(pts, fill=int(rng.uniform(70, 95)), width=int(rng.integers(1, 3)))
    # cekungan kecil (bekas ketukan kapur)
    for _ in range(1600):
        x, y = rng.uniform(0, W), rng.uniform(0, H)
        r = rng.uniform(1, 3.5)
        g.ellipse([x - r, y - r, x + r, y + r], fill=int(rng.uniform(90, 115)))
    tinggi = ke_array(gores.filter(ImageFilter.GaussianBlur(0.6)))
    tinggi += (derau(6, 14) - 0.5) * 0.035 + (derau(2, 3) - 0.5) * 0.03  # butiran batu tulis memanjang
    return tinggi


def bayangkan(tinggi: np.ndarray, kuat: float = 9.0) -> np.ndarray:
    """Pencahayaan dari kiri atas berdasarkan kemiringan peta tinggi."""
    gy, gx = np.gradient(tinggi)
    cahaya = np.array([-0.55, -0.65, 0.52])
    cahaya /= np.linalg.norm(cahaya)
    nx, ny, nz = -gx * kuat, -gy * kuat, np.ones_like(tinggi)
    n = np.sqrt(nx * nx + ny * ny + nz * nz)
    return (nx * cahaya[0] + ny * cahaya[1] + nz * cahaya[2]) / n


def hapusan() -> np.ndarray:
    lapis = Image.new("L", (W, H), 0)
    g = ImageDraw.Draw(lapis)
    for _ in range(120):
        cx, cy = rng.uniform(-200, W + 200), rng.uniform(0, H)
        rx, ry = rng.uniform(250, 800), rng.uniform(40, 360)
        a0 = rng.uniform(0, 360)
        tebal = int(rng.uniform(50, 130))
        nilai = rng.uniform(10, 24)
        for kk in range(int(rng.integers(3, 9))):
            g.arc([cx - rx, cy - ry + kk * tebal * 0.55, cx + rx, cy + ry + kk * tebal * 0.55], a0, a0 + rng.uniform(40, 140), fill=int(nilai), width=tebal)
    # sapuan horizontal panjang
    for _ in range(60):
        y = rng.uniform(0, H)
        x = rng.uniform(-300, W)
        g.rectangle([x, y, x + rng.uniform(400, 1400), y + rng.uniform(60, 160)], fill=int(rng.uniform(8, 18)))
    halus = ke_array(lapis.filter(ImageFilter.GaussianBlur(22)))
    # serat penghapus: garis-garis searah di dalam sapuan
    serat = derau(40, 2)
    return halus * (0.65 + 0.7 * serat)


def tulisan_lama() -> np.ndarray:
    lapis = Image.new("L", (W, H), 0)
    g = ImageDraw.Draw(lapis)
    potongan = ["x² + 2x", "Rp", "= 1.250.000", "%", "12 × 4", "bunga", "a + b", "3,5", "√16", "100 ÷ 4", "Σ", "∆y", "→", "2027", "tabungan", "π r²"]
    for _ in range(140):
        teks = potongan[int(rng.integers(0, len(potongan)))]
        ukuran = int(rng.uniform(60, 180))
        font = ImageFont.truetype(FONT, ukuran)
        x, y = rng.uniform(-100, W), rng.uniform(0, H)
        g.text((x, y), teks, font=font, fill=int(rng.uniform(5, 12)))  # samar: angka bekas tidak boleh terbaca dekat data
    lapis = lapis.rotate(-1.2, resample=Image.BICUBIC).filter(ImageFilter.GaussianBlur(14))
    return ke_array(lapis)


def debu_kapur() -> np.ndarray:
    y = np.linspace(0.0, 1.0, H, dtype=np.float32)[:, None]
    x = np.linspace(-1.0, 1.0, W, dtype=np.float32)[None, :]
    bawah = np.clip((y - 0.9) / 0.1, 0, 1) ** 2 * 0.22
    pojok = (np.abs(x) ** 6) * 0.06
    awan = derau(30, 10) * 0.6 + derau(8, 3) * 0.4
    bintik = (rng.random((H, W)).astype(np.float32) > 0.9975).astype(np.float32) * rng.uniform(0.2, 0.6)
    bintik = ke_array(Image.fromarray((bintik * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8)))
    return (bawah + pojok) * awan + bintik


def main(keluar: Path) -> None:
    dasar = np.array([38, 66, 53], dtype=np.float32)
    belang = 0.5 * derau(500) + 0.3 * derau(120) + 0.2 * derau(25)
    rgb = dasar[None, None, :] * (0.84 + 0.3 * belang[..., None])

    tinggi = peta_tinggi()
    terang = bayangkan(tinggi)  # sekitar 0.5–1.0
    rgb *= (0.62 + 0.45 * terang)[..., None]
    # goresan halus memantulkan sedikit cahaya (kapur tertinggal di dalamnya)
    sisa = np.clip((0.5 - tinggi) * 6, 0, 1)[..., None]
    kapur = np.array([214, 222, 210], dtype=np.float32)
    rgb = rgb * (1 - sisa * 0.22) + kapur * sisa * 0.22

    campur = np.clip(hapusan() + tulisan_lama() + debu_kapur(), 0, 1)[..., None]
    rgb = rgb * (1 - campur) + kapur[None, None, :] * campur

    rgb += (rng.random((H, W, 1)).astype(np.float32) - 0.5) * 5
    keluar.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).save(keluar, quality=86)
    print(keluar, keluar.stat().st_size // 1024, "KB")


if __name__ == "__main__":
    # Opsional: lebar dan tinggi lain, mis. papan panjang untuk carousel 8 slide:
    #   python3 scripts/buat_tekstur_papan.py public/papan/papan-carousel.jpg 8640 1350
    if len(sys.argv) > 3:
        W, H = int(sys.argv[2]), int(sys.argv[3])
    main(Path(sys.argv[1]) if len(sys.argv) > 1 else Path("public/papan/papan.jpg"))
