# Carousel dan sampul Papan Kapur

## Carousel (slot 12.00 WIB)
Infografis 1080×1350 (4:5), **maksimal 6 slide**, tanpa suara. Template: `src/papan/Carousel.tsx` (komposisi `CarouselPapan`).

Slide 1 = hook (angka besar). Slide 2–5 = poin (penjelasan, perumpamaan, efek, solusi): ilustrasi kapur di atas (±58% tinggi) dengan label dan panah kecil, judul besar huruf kapital (maks. 2 baris), dan isi maks. 2 baris. Slide 6 = CTA + logo + tagline. Ilustrasi dibuat dari kode di `src/papan/ilustrasi/`.

Semua slide digambar di satu papan panjang lalu dipotong per 1080 px. Tekstur dan coretan yang melewati batas slide jadi bersambung saat digeser; contohnya panah "geser" di slide 1 yang ujungnya muncul di slide 2. Teksturnya `public/papan/papan-carousel.jpg` (8640×1350), dibuat dengan:

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
    { "peran": "perumpamaan", "judul": "Mirip garansi HP", "gambar": ["hp", "silang"], "label": ["segel dibongkar", "garansi hangus"], "panah": true, "isi": "Maks. 2 baris.", "sumber": "LPS, 28 Sep 2026" },
    { "peran": "solusi", "judul": "Cek 2 hal dulu", "gambar": ["koin", "perisai"], "isi": "✓ baris pertama\n✓ baris kedua" },
    { "peran": "cta", "judul": "Pertanyaan untuk komen?", "isi": "Tulis di komen. Simpan biar nggak lupa." }
  ]
}
```
| Kolom | Wajib | Dipakai untuk |
|---|---|---|
| `peran` | ya | `hook` (slide 1), `penjelasan`/`perumpamaan`/`efek`/`solusi` (slide 2–5), `cta` (slide terakhir) |
| `judul` | ya | Judul slide, dicetak huruf kapital, maks. 2 baris (log memberi peringatan bila lebih). Di hook: baris di atas angka besar. |
| `isi` | tidak | Maks. 2 baris. Di hook: baris merah di bawah angka. Baris yang diawali `✓` (dipisah `\n`) digambar sebagai checklist. |
| `visual` | tidak | Ide gambar dari Research. Director menerjemahkannya ke `angka` atau `gambar`. |
| `angka` | tidak | Angka besar kuning, jadi objek pertama ilustrasi. |
| `gambar` | tidak | 1–3 objek ilustrasi kapur: `orang`, `emas`, `kartu`, `uang`, `hp`, `bank`, `amplop`, `koin`, `grafik`, `kalender`, `perisai`, `centang`, `silang`, `rumah`, atau `angka:<teks>`. |
| `label` | tidak | Label di bawah tiap objek (urut sama dengan `gambar`). |
| `panah` | tidak | `true` = panah kapur di antara objek (alur sebab-akibat). |
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
