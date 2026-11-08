# intipdompet-video

Proyek video Reels untuk akun Instagram **@intipdompet**, dibuat dengan [Remotion](https://www.remotion.dev).

## Mulai

```bash
npm install
npm run dev        # buka Remotion Studio untuk melihat dan mengedit video
```

## Render video

```bash
npx remotion render NaikBerapa out/naik-berapa.mp4
```

Hasilnya MP4 1080×1920, 30 fps, siap diunggah ke Reels.

Untuk render dengan data lain tanpa mengubah kode:

```bash
npx remotion render NaikBerapa out/harga-telur.mp4 --props=data/harga-telur.json
```

## Membuat video baru di seri "Naik Berapa?"

1. Salin `data/naik-berapa-contoh.json` menjadi file baru, misalnya `data/harga-telur.json`.
2. Isi datanya dengan angka asli, hapus baris `"contoh": true`, dan tulis sumber beserta tahunnya di `sumber`.
3. Atur `naikItuBuruk`: `true` untuk harga (naik ditandai merah), `false` untuk tabungan atau gaji (naik ditandai hijau).
4. Render dengan `--props=data/harga-telur.json`.

## Struktur

| Lokasi | Isi |
| --- | --- |
| `src/brand.ts` | Warna, font, ukuran teks, jarak, dan format angka Indonesia |
| `src/komponen/` | Bagian yang dipakai ulang: celah intip pembuka, grafik batang, watermark, frame penutup |
| `src/seri/` | Template per seri. Saat ini baru `NaikBerapa` |
| `data/` | Data per video dalam JSON |
| `public/` | Logo dan file font |

## Catatan

- Data di `data/naik-berapa-contoh.json` hanya contoh. Video yang memakai `"contoh": true` menampilkan label "data contoh" di layar.
- Font disimpan di `public/fonts` (SIL Open Font License), jadi render tidak butuh internet.
- Lisensi Remotion gratis untuk individu dan tim sampai 3 orang. Tim 4 orang atau lebih butuh lisensi berbayar.
