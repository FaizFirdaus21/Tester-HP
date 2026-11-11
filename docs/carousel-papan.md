# Carousel dan sampul Papan Kapur

## Carousel (slot 12.00 WIB)
Gambar diam 1080×1350 (4:5), 5–8 slide, tanpa suara. Template: `src/papan/Carousel.tsx` (komposisi `CarouselPapan`).

Semua slide digambar di satu papan panjang lalu dipotong per 1080 px. Tekstur dan coretan yang melewati batas slide jadi bersambung saat digeser; contohnya panah "geser" di slide 1 yang ujungnya muncul di slide 2. Teksturnya `public/papan/papan-carousel.jpg` (8640×1350, cukup untuk 8 slide), dibuat dengan:

```
python3 scripts/buat_tekstur_papan.py public/papan/papan-carousel.jpg 8640 1350
```

### Data: `produksi/<YYYYMMDD>-<slug>/carousel.json`
```json
{
  "judul": "Judul carousel",
  "sumber": "Sumber data untuk slide terakhir",
  "slide": [
    { "peran": "hook", "judul": "Deposito bunga", "angka": "6%", "isi": "aman nggak?", "visual": "..." },
    { "peran": "poin", "judul": "Satu poin per slide", "isi": "Penjelasan singkat.", "visual": "...", "gambar": "bank", "sumber": "LPS, 28 Sep 2026" },
    { "peran": "poin", "judul": "Cek 2 hal", "isi": "✓ baris pertama\n✓ baris kedua" },
    { "peran": "cta", "judul": "Pertanyaan untuk komen?", "isi": "Tulis di komen. Simpan biar nggak lupa." }
  ]
}
```
| Kolom | Wajib | Dipakai untuk |
|---|---|---|
| `peran` | ya | `hook` (slide 1), `poin` (slide tengah), `cta` (slide terakhir) |
| `judul` | ya | Judul slide. Di hook: baris di atas angka besar. |
| `isi` | tidak | Teks badan. Di hook: baris merah di bawah angka. Baris yang diawali `✓` (dipisah `\n`) digambar sebagai checklist. |
| `visual` | tidak | Ide gambar dari Research. Director menerjemahkannya ke `angka` atau `gambar`. |
| `angka` | tidak | Angka besar kuning (angka lurus). |
| `gambar` | tidak | Sketsa kapur: `bank`, `hp`, `amplop`, `koin`, `grafik`, `kalender`, `perisai`, `centang`. |
| `sumber` | tidak | Sumber kecil di bawah slide poin. `sumber` di tingkat atas dicetak di slide CTA. |

Otomatis di setiap carousel: nomor slide "2/7" di pojok kanan atas; simbol + @intipdompet dan "geser →" di slide 1; logo, tagline "Biar dompetmu nggak kaget.", sumber, dan "Konten edukasi, bukan ajakan membeli." di slide CTA.

### Render
```
node scripts/carousel.mjs produksi/<slug>/carousel.json produksi/<slug> --browser <chrome-headless-shell>
```
Hasil: `slide-01.png` … `slide-NN.png`. Contoh dari konten deposito: `docs/contoh-carousel/` (data `src/papan/demo/carousel-deposito.json`).

## Sampul Reels (setiap video)
1080×1920 JPEG dari `SampulPapan` (`src/papan/Sampul.tsx`). Isi penting di tengah supaya aman untuk potongan grid profil (3:4) dan feed (4:5).
```
node scripts/sampul.mjs produksi/<slug>/sampul.jpg --label "sebelum taruh uang, cek ini" --atas "Deposito" --angka "6%" --bawah "aman nggak?" --browser <chrome-headless-shell>
```
