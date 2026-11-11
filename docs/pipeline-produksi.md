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
3. `naskah-vo.json`, dengan aturan di bagian **Struktur naskah** di bawah.
4. Set `status.json` ke `naskah-siap`.

### Struktur naskah (wajib)
@intipdompet adalah media edukasi. Tiap video menjelaskan satu hal, apa efeknya, lalu apa yang bisa dilakukan penonton.

| Blok | Isi | Panjang |
|---|---|---|
| 1. Hook | Pertanyaan, angka, atau pernyataan yang membuat penasaran. Harus terbaca dalam 2 detik dan langsung menyentuh dompet penonton. | 4–8 kata |
| 2. Penjelasan | Apa yang terjadi, dengan data resmi (sumber di `fakta.json`). | 1–2 kalimat |
| 3. Perumpamaan | Analogi sehari-hari yang sederhana (warung, kos, gaji, ojol, belanja bulanan) supaya orang awam paham tanpa istilah. | 1–2 kalimat |
| 4. Efek | Apa yang berubah karena hal itu. | 1 kalimat |
| 5. Akibat | Dampak langsung ke uang penonton, sebaiknya dengan contoh angka (diberi label "contoh"). | 1–2 kalimat |
| 6. Solusi | Kalau topiknya masalah: 1–3 langkah konkret yang bisa dilakukan hari ini. Kalau bukan masalah: satu hal yang perlu diingat. Tidak menyuruh membeli produk tertentu. | 1–3 kalimat |
| 7. CTA | Pertanyaan spesifik yang mudah dijawab di komentar, plus ajakan kirim/simpan, lalu tagline. | 2–3 kalimat |

Aturan tambahan:
- 120–150 kata (±50–60 detik), 7 blok sesuai tabel. Kalau topiknya sederhana, lebih pendek lebih baik.
- Bahasa lisan anak muda Indonesia: sapa "kamu", kalimat pendek, satu ide per kalimat. Hindari istilah teknis; kalau terpaksa, langsung jelaskan dengan bahasa sehari-hari.
- **CTA harus bisa dijawab dalam satu kata atau satu angka**, supaya orang mau komen. Contoh bagus: "Kamu pernah taruh deposito di bunga berapa? Tulis angkanya di komen." / "Tim nabung di bank atau di e-wallet? Komen di bawah." Lalu satu ajakan berbagi yang spesifik: "Kirim ke teman yang lagi nyari deposito bunga tinggi." Hindari CTA kosong seperti "Gimana menurutmu?" atau "Setuju?".
- Tagline **"IntipDompet. Biar dompetmu nggak kaget."** diucapkan di akhir blok 7, setelah CTA.
- Gaya merek: tanpa kata "cuan", "auto kaya", "pasti untung"; tidak menyuruh membeli saham, kripto, atau produk tertentu; konten investasi menyebut "konten edukasi, bukan ajakan membeli".
- Hindari pola tulisan AI: "bukan X, tapi Y" sebagai kejutan, "Hasilnya? ...", daftar "tanpa X, tanpa Y, tanpa Z", dan frasa klise ("ternyata oh ternyata", "simak sampai habis").
- Angka ditulis sebagai kata ("tiga koma dua tiga persen"), singkatan dieja sesuai cara baca.
- Tiap blok punya `peran` (salah satu dari 7 peran di atas), `gaya` (ekspresi), `teks`, dan `visual` (kata kunci, angka, ide gambar untuk Director).
- Format: lihat `data/vo-inflasi.json`, ditambah `"model"` dan kolom `peran`.

## 2. VO
1. `python3 scripts/tts_gemini.py produksi/<slug>/naskah-vo.json produksi/<slug>/vo --tanpa-gaya` (mode per blok; key dari `GEMINI_API_KEY`, jangan pernah ditampilkan atau disimpan). Model TTS kadang membacakan instruksi gaya, jadi bawaan produksi adalah teks saja; nada diatur lewat tanda baca. Satu video = 8 permintaan, sementara paket gratis hanya 10 permintaan/hari, jadi maksimal 1 video/hari. Script melanjutkan blok yang sudah ada dan menolak blok yang durasinya tidak wajar. `--satu-permintaan` masih **eksperimen** (model bisa menambah kalimat sendiri) dan tidak dipakai untuk video tayang.
2. Cek: tiap blok berdurasi ≈ jumlah kata / 2,3 detik (±30%), audio tidak kosong, dan instruksi gaya tidak ikut terbaca.
3. Simpan MP3 ke `public/vo/<slug>.mp3` dan salin `waktu.json` ke `produksi/<slug>/vo-waktu.json`.
4. Set `status.json` ke `vo-siap`.

## 3. Director
1. Baca `naskah-vo.json` (termasuk kolom `visual`), `vo-waktu.json`, dan `fakta.json`.
2. Gaya bawaan: **template Papan Kapur** (`src/papan/`, contoh lengkap `src/papan/demo/DepositoPapan.tsx`, tekstur dari `scripts/buat_tekstur_papan.py`). Template Buku Catatan (`src/catatan/`) tetap tersedia sebagai cadangan. Aturan Papan Kapur:
   - Batang kapur hanya muncul saat **mencoret, melingkari, menggambar, menandai, atau menggaris bawahi** (`Coret`, `Panah`, atau `Tulis kapur`). Tulisan biasa muncul tanpa batang kapur.
   - Efek 2,5D (`Angkat`, kamera miring) dipakai sesekali untuk momen penting saja, maksimal 2–3 kali per video.
   - Satu blok naskah = satu bagian papan. Blok "Perumpamaan" sebaiknya digambar (sketsa kapur), bukan hanya ditulis.
3. Buat `src/produksi/<slug>/Video.tsx` dan daftarkan di `src/Root.tsx`. Setiap tulisan dan coretan disinkron dengan waktu blok VO, dan audio dipasang.
4. Rencanakan seperti sutradara: satu ide visual per blok, gerak kamera, transisi, dan aset. Area aman: isi utama y 220–1200, subtitel tipis tanpa kotak di y 1300–1480 (default aktif), tidak ada yang penting di bawah 1500. Render pakai chrome-headless-shell (`--browser-executable`), karena unduhan browser Remotion diblokir.
5. Buat storyboard dari frame asli: `node scripts/stills.mjs <Id> <dir> <frame,...> --browser <chrome-headless-shell>`, lalu susun jadi `storyboard.png`. Set status ke `storyboard-siap`. **Jangan render video** sebelum Orchestrator menyampaikan persetujuan user.
6. Setelah disetujui: render, cek dengan `look.py`, kompres (`-crf 23`, di bawah 50 MB) ke `produksi/<slug>/final.mp4`, lalu set status `render-selesai`.

## Aturan bersama
- Sebelum push: `git pull --rebase origin claude/instagram-niche-research-remotion-lqjmj6`. Ubah hanya file milik tahapmu.
- Akhiri pesan commit dengan baris atribusi yang diberikan sesi.
- Kalau terhambat (host diblokir, kuota habis, data tidak ada), tulis di `status.json` → `catatan`, lalu berhenti. Jangan mengakali dengan data karangan.

## Jadwal rutin harian (mulai 12 Nov 2026)
Target: **2 konten per hari** di @intipdompet, diunggah lewat Zernio (akun Instagram `6af4880b6c69865762dc37aa`).

| Slot | Jam (WIB) | Jenis | Dibuat oleh |
|---|---|---|---|
| Siang | 12.00 | **Carousel Papan Kapur** (infografis 1080×1350, **maksimal 6 slide**, tanpa VO) | Research (isi) → Director (gambar) |
| Malam | 19.00 | **Reels Papan Kapur** (naskah 7 blok + VO) | Research → VO → Director |

Kenapa begini: kuota TTS gratis cukup untuk 1 video per hari (1 video = 7–8 permintaan). Carousel tidak butuh suara.

### Alur harian (dimulai 15.20 WIB, setelah kuota TTS reset 15.00 WIB)
Semua konten dibuat **sehari sebelum** tayang:
1. Orchestrator memulai produksi untuk tayang besok.
2. Research memilih 2 topik (1 video, 1 carousel) dengan rubrik skor yang sama, menulis `naskah-vo.json` (video) dan `carousel.json` (carousel: judul per slide, isi, ide gambar), plus `fakta.json` dan `caption.txt` untuk masing-masing.
3. VO membuat suara video. Director membuat video, sampul, dan slide carousel.
4. Orchestrator mengirim video, sampul, slide, dan caption ke user. **Tidak ada yang terbit sebelum user bilang "accept".**
5. Setelah accept, Orchestrator menjadwalkan keduanya di Zernio untuk besok pukul 12.00 dan 19.00 WIB.

Folder carousel: `produksi/<YYYYMMDD>-<slug>/` dengan `carousel.json`, `slide-01.png` … `slide-06.png`, `caption.txt`.

Bentuk carousel (dari referensi user): **infografis, bukan sekadar tulisan.** Tiap slide berisi ilustrasi kapur di atas (±55–60% tinggi: orang, emas, HP, kartu, dll. beserta label dan panah kecil), judul besar huruf kapital di bawahnya, dan isi maksimal 2 baris. Slide 1 = hook, slide 2–5 = penjelasan, perumpamaan, efek, solusi, slide 6 = CTA + logo + tagline. Ilustrasi dibuat dari kode (`src/papan/ilustrasi/`), karena kuota pembuatan gambar AI gratis = 0.

### Aturan caption
- Baris pertama = hook (sama dengan hook video atau judul slide 1).
- 2–4 kalimat ringkasan, poin cek pakai tanda ✓.
- CTA komentar yang bisa dijawab satu kata atau angka, plus ajakan simpan atau kirim.
- Sumber data + "Konten edukasi, bukan ajakan ...".
- 5–8 hashtag yang relevan, termasuk #intipdompet.
