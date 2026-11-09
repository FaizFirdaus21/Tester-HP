# Pipeline produksi video @intipdompet

Empat sesi Claude bekerja berurutan. Semua serah-terima lewat file di repo ini (branch `claude/instagram-niche-research-remotion-lqjmj6`), bukan lewat ingatan percakapan.

```
Orchestrator ──► Media Research ──► VO ──► Director ──► (persetujuan user) ──► render
     ▲                                                                        │
     └──────────────────────── memantau produksi/*/status.json ◄──────────────┘
```

| Sesi | Peran |
|---|---|
| **Orchestrator** | Membagi tugas, memantau `status.json`, meneruskan hasil ke user, meminta persetujuan. |
| **Intip Dompet - Media Research** | Mencari dan menilai ide, memeriksa data, menulis naskah VO lengkap dengan ekspresi. |
| **Intip Dompet - VO** | Mengubah naskah jadi audio (Gemini TTS, suara Sulafat) dan jadwal per blok. |
| **Intip Dompet - Director** | Storyboard, kamera, visual, aset, lalu render dengan Remotion. |

## Folder per video

```
produksi/<YYYYMMDD>-<slug>/
  status.json        tahap sekarang (lihat di bawah)
  riset.md           ide terpilih, skor, bukti, sumber data
  fakta.json         setiap angka/klaim + sumber + tanggal akses
  naskah-vo.json     naskah per blok (format scripts/tts_gemini.py)
  vo-waktu.json      hasil VO: awal & durasi tiap blok
  storyboard.png     storyboard dari frame Remotion asli
  final.mp4          video akhir terkompresi (setelah disetujui)
public/vo/<slug>.mp3 audio VO yang dipakai Remotion
src/produksi/<slug>/ komposisi Remotion video itu
```

`status.json`:
```json
{ "slug": "...", "tahap": "riset | naskah-siap | vo-siap | storyboard-siap | disetujui | render-selesai | revisi", "catatan": "...", "diperbarui": "ISO-8601" }
```
Tiap sesi hanya mengubah `tahap` ke tahap yang menjadi tanggung jawabnya.

## 1. Media Research

### Sumber ide
Rilis data resmi (BPS, Bank Indonesia, OJK, LPS, Kemenkeu, Kemnaker), berita ekonomi minggu ini, kalender uang (gajian, THR, 11.11/12.12, tahun ajaran baru, Lebaran, pajak), pertanyaan yang sering dicari ("kenapa…", "berapa…", "lebih untung mana…"), dan konten finansial berbahasa Indonesia yang sedang ramai.

### Rubrik skor (0–100)
Nilai tiap kriteria 1–5, kalikan bobot, jumlahkan, lalu ubah ke skala 100.

| Kriteria | Bobot | Cara menilai |
|---|---|---|
| Permintaan pencarian | 25 | Tren pencarian, volume berita, pertanyaan yang berulang |
| Bukti performa sosial | 20 | View/engagement konten serupa di TikTok/IG/YouTube (wajib tautan bukti) |
| Ketepatan waktu | 15 | Ada rilis data atau momen dalam 14 hari terakhir/ke depan |
| Dampak ke dompet penonton | 15 | Langsung mengubah keputusan uang penonton usia 20–35 |
| Potensi dibagikan | 10 | Membantah salah kaprah, angka mengejutkan, "kirim ke teman" |
| Data resmi tersedia | 10 | Ada sumber primer yang bisa dicek |
| Cocok divisualkan | 5 | Bisa digambar dengan template (angka, perbandingan, alur) |

**Jujur soal data:** jangan pernah mengarang angka view, volume pencarian, atau statistik. Yang tidak bisa diverifikasi ditulis "tidak terverifikasi" dan diberi skor rendah. Catat semua host yang diblokir jaringan.

### Keluaran riset
1. `riset.md`: 10 ide terbaik dengan skor per kriteria, bukti tautan, lalu ide #1 terpilih beserta alasannya.
2. `fakta.json`: semua angka di naskah beserta sumber primer dan tanggal akses. Klaim tanpa sumber tidak boleh masuk naskah.
3. `naskah-vo.json`, dengan aturan:
   - 120–150 kata (±45–60 detik), 6–8 blok.
   - Blok 1 adalah hook berupa pertanyaan atau angka, terbaca dalam 2 detik.
   - Alur: hook → data → salah kaprah → contoh sehari-hari → inti → kesimpulan → tagline **"IntipDompet. Urusan uang, kita intip."**
   - Gaya merek: sapa "kamu", santai; tanpa kata "cuan", "auto kaya", "pasti untung"; tidak menyuruh membeli saham, kripto, atau produk tertentu; konten investasi ditutup dengan "konten edukasi, bukan ajakan membeli".
   - Angka ditulis sebagai kata ("tiga koma dua tiga persen"), dan singkatan dieja sesuai cara baca.
   - Tiap blok punya `gaya` (ekspresi) dan `visual` (kata kunci, angka, ide gambar untuk Director).
   - Format: lihat `data/vo-inflasi.json`, ditambah `"model": "gemini-3.8-flash-tts"`.
4. Set `status.json` ke `naskah-siap`.

## 2. VO
1. `python3 scripts/tts_gemini.py produksi/<slug>/naskah-vo.json produksi/<slug>/vo` (key dari `GEMINI_API_KEY`; jangan pernah ditampilkan atau disimpan).
2. Cek: tiap blok berdurasi ≈ jumlah kata / 2,3 detik (±30%), audio tidak kosong, dan instruksi gaya tidak ikut terbaca.
3. Simpan MP3 ke `public/vo/<slug>.mp3` dan salin `waktu.json` ke `produksi/<slug>/vo-waktu.json`.
4. Set `status.json` ke `vo-siap`.

## 3. Director
1. Baca `naskah-vo.json` (termasuk kolom `visual`), `vo-waktu.json`, dan `fakta.json`.
2. Gaya bawaan: **template Buku Catatan** (`src/catatan/`, panduan di `docs/gaya-buku-catatan.md`). Gaya lain boleh kalau isinya menuntut, tapi tulis alasannya.
3. Buat `src/produksi/<slug>/Video.tsx` dan daftarkan di `src/Root.tsx`. Setiap tulisan dan coretan disinkron dengan waktu blok VO, dan audio dipasang.
4. Rencanakan seperti sutradara: satu ide visual per blok, gerak kamera, transisi, dan aset. Jaga isi di area aman (y 220–1500).
5. Buat storyboard dari frame asli: `node scripts/stills.mjs <Id> <dir> <frame,...> --browser <chrome-headless-shell>`, lalu susun jadi `storyboard.png`. Set status ke `storyboard-siap`. **Jangan render video** sebelum Orchestrator menyampaikan persetujuan user.
6. Setelah disetujui: render, cek dengan `look.py`, kompres (`-crf 23`, di bawah 50 MB) ke `produksi/<slug>/final.mp4`, lalu set status `render-selesai`.

## Aturan bersama
- Sebelum push: `git pull --rebase origin claude/instagram-niche-research-remotion-lqjmj6`. Ubah hanya file milik tahapmu.
- Akhiri pesan commit dengan baris atribusi yang diberikan sesi.
- Kalau terhambat (host diblokir, kuota habis, data tidak ada), tulis di `status.json` → `catatan`, lalu berhenti. Jangan mengakali dengan data karangan.
