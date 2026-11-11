# Carousel dan sampul Papan Kapur

## Carousel (slot 12.00 WIB)
Infografis 1080×1350 (4:5), **maksimal 6 slide**, tanpa suara. Template: `src/papan/Carousel.tsx` (komposisi `CarouselPapan`).

Setiap slide terdiri atas tiga bagian:
- **Ilustrasi kapur** di atas, sekitar 55% tinggi: orang + benda + label kecil + panah.
- **Judul** kapital besar (Kalam tebal 76–88 px, maks. 3 baris) dengan kata kunci berwarna.
- **Isi** maks. 2 baris (Kalam 42 px).

Urutan slide:
1. Slide 1 = hook, dengan @intipdompet di kiri atas dan "geser →".
2. Slide 2–5 = penjelasan, perumpamaan, efek, solusi.
3. Slide 6 = CTA komen/simpan + logo + tagline "Biar dompetmu nggak kaget." + sumber + "Konten edukasi, bukan ajakan membeli."

Nomor "1/6" ada di pojok kanan atas setiap slide.

Semua slide digambar di satu papan panjang lalu dipotong per 1080 px. Tekstur dan coretan yang melewati batas slide jadi bersambung saat digeser. Tekstur: `public/papan/papan-carousel.jpg` (8640×1350), dibuat dengan `python3 scripts/buat_tekstur_papan.py public/papan/papan-carousel.jpg 8640 1350`.

Contoh lengkap: `docs/contoh-carousel/` (slide-01…06 + `pratinjau.png`), data `src/papan/demo/carousel-emas.json`.

### Data: `produksi/<YYYYMMDD>-<slug>/carousel.json`
Research mengisi `judul`, `isi`, `visual`, dan `sumber`. Director menerjemahkan `visual` menjadi `ilustrasi`.

```json
{
  "judul": "Selisih harga jual vs buyback emas",
  "sumber": "sumber data (dicetak di slide CTA)",
  "slide": [
    {
      "peran": "hook",
      "judul": "Beli emas, jual lagi. Kok {rugi}?",
      "isi": "Kenalan sama selisih harga [jual] dan {buyback}.",
      "visual": "ide gambar dari Research",
      "ilustrasi": {
        "lapis": [
          { "jenis": "orang", "x": 290, "y": 410, "s": 520, "pose": "struk", "ekspresi": "kaget", "baju": "biru", "teks": "JUAL" },
          { "jenis": "emasTumpuk", "x": 690, "y": 540, "s": 300 },
          { "jenis": "label", "x": 700, "y": 300, "s": 270, "teks": "Rp1,35 jt", "warna": "merah", "miring": -8 }
        ],
        "label": [{ "teks": "contoh", "x": 700, "y": 400, "ukuran": 34 }],
        "panah": [{ "x1": 640, "y1": 400, "x2": 740, "y2": 500, "tinggi": 30, "warna": "merah" }]
      },
      "sumber": "sumber kecil di bawah slide (opsional, slide 2–5)"
    }
  ]
}
```

**Penanda warna** di `judul` dan `isi`: `[kata]` kuning, `{kata}` merah muda, `<kata>` biru. Log render memberi peringatan `[carousel]` bila judul lebih dari 3 baris, isi lebih dari 2 baris, atau slide tanpa ilustrasi.

**Ilustrasi** (`src/papan/ilustrasi/`, katalog visual: komposisi `GaleriIlustrasi`). Koordinat lapisan relatif ke kotak adegan 900×690 (CTA: 900×570). `x`, `y` = pusat, `s` = ukuran.

| Jenis | Opsi |
|---|---|
| `orang` (setengah badan) | `pose`: `netral`, `hp`, `struk`, `mikir`, `kaget`, `jempol`, `tunjuk`, `emas` (memegang batang emas) · `ekspresi`: `senyum`, `kaget`, `mikir`, `datar`, `cemas` · `baju`: `biru`/`merah`/`kuning`/`hijau` · `cermin` · `teks` (di struk/gelembung pikiran) |
| benda | `emas`, `emasTumpuk`, `koin`, `uang`, `hp`, `kartu`, `tas`, `kalender`, `bank`, `timbangan` (`miring`), `label` (label harga: `teks`, `warna`, `miring`), `kalkulator`, `meja`, `gelembung` · sebagian menerima `teks` |
| `gambar` (raster) | `src` (path di `public/`), `w`, `h`. Dipakai untuk mengganti ilustrasi kode dengan gambar kapur AI kelak, tanpa mengubah tata letak. |

Cara cepat tanpa adegan: `"gambar": ["hp", "bank"]`, `"label": [...]`, `"panah": true` (ikon sederhana berjajar), atau `"angka": "3,75%"`.

### Render
```
node scripts/carousel.mjs produksi/<slug>/carousel.json produksi/<slug> --browser <chrome-headless-shell>
```
Hasil: `slide-01.png` … `slide-06.png` + `pratinjau.png` (6 slide berdampingan), ±25 detik.

### QC otomatis (carousel tayang tanpa dicek manusia)
`carousel.mjs` mengumpulkan semua peringatan dari template. Bila ada satu saja, skrip keluar dengan **kode 2** dan carousel **tidak boleh diterbitkan** sebelum `carousel.json` diperbaiki dan dirender ulang. Yang diperiksa:
- judul lebih dari 3 baris atau isi lebih dari 2 baris;
- satu baris lebih lebar dari slide;
- teks turun sampai menabrak elemen bawah (sumber, "geser", logo);
- label ilustrasi atau objek keluar dari tepi slide;
- slide tanpa ilustrasi, atau jenis ilustrasi tidak dikenal;
- lebih dari 6 slide.

`--izinkan-peringatan` hanya untuk percobaan, bukan untuk produksi.

## Sampul Reels (setiap video)
1080×1920 JPEG dari `SampulPapan` (`src/papan/Sampul.tsx`). Isi penting di tengah supaya aman untuk potongan grid profil (3:4) dan feed (4:5).
```
node scripts/sampul.mjs produksi/<slug>/sampul.jpg --label "sebelum taruh uang, cek ini" --atas "Deposito" --angka "6%" --bawah "aman nggak?" --browser <chrome-headless-shell>
```
