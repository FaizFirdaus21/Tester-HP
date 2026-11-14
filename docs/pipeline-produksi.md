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

### Struktur naskah (wajib, versi 2 mulai 17 Nov 2026)
@intipdompet adalah media edukasi. Tiap video menjelaskan satu hal, apa efeknya ke dompet, lalu apa yang bisa dilakukan penonton.

**Kenapa diubah (evaluasi 14 Nov 2026).** Dua Reels pertama (66–67 detik) ditinggal **75–77% penonton di awal** dan rata-rata hanya ditonton **3–8 detik**. Frame pertama hampir kosong (hook masih ditulis kapur, baru utuh di detik ke-3 sampai ke-4), padahal penonton memutuskan scroll atau tidak dalam ±1 detik. Isi inti dan CTA baru muncul setelah detik ke-20, jadi hampir tidak ada yang melihatnya: komentar dan simpan = 0. Carousel emas (reach 101, 1 share, 1 follow) jauh mengungguli BI Rate dan diskon (reach 5) karena slide pertamanya memakai **angka nyata + kerugian langsung** ("Kok rugi?").

| Blok | Isi | Panjang |
|---|---|---|
| 1. Hook | Kerugian atau angka konkret yang langsung menyentuh dompet. Pernyataan tajam, boleh diakhiri tanya. Ucapan maksimal ±2,5 detik (suara Sulafat ±0,5 detik/kata, koma dan angka yang dieja memperlambat). Teks hook di layar sudah utuh sejak frame 0, jadi ucapan boleh sedikit lebih lambat dari bacaan. Contoh: "Bunga enam persen, uangmu hangus." | 4–6 kata |
| 2. Inti + data | Apa yang terjadi, satu angka resmi (sumber di `fakta.json`). Langsung ke pokok, tanpa pembuka. | 1–2 kalimat |
| 3. Perumpamaan + akibat | Analogi sehari-hari sekaligus dampaknya ke uang penonton dengan contoh angka (label "contoh"). | 1–2 kalimat |
| 4. Solusi | 1–3 langkah konkret yang bisa dilakukan hari ini. | 1–2 kalimat |
| 5. CTA | **Satu** ajakan komentar yang dijawab satu kata/angka, lalu tagline. Ajakan simpan/kirim cukup di caption. | 1 kalimat + tagline |

Aturan tambahan:
- **70–90 kata (±30–40 detik), maksimal 45 detik.** Kalau satu ide butuh lebih lama, pecah jadi dua video.
- Hook adalah **pernyataan kerugian atau angka mengejutkan**, bukan pertanyaan pelan. Minimalkan koma; kalau ada angka, pakai yang pendek diucapkan ("enam persen", bukan "tiga koma dua tiga persen"). Hindari pembuka lunak seperti "Kamu tahu nggak…".
- Pakai **open loop** sekali di blok 2 atau 3 bila wajar, misalnya "yang ketiga paling sering bikin rugi", supaya orang bertahan sampai solusi.
- Bahasa lisan anak muda Indonesia: sapa "kamu", kalimat pendek, satu ide per kalimat, tanpa istilah teknis yang tidak dijelaskan.
- **CTA bisa dijawab dalam satu kata atau satu angka**: "Kamu pakai bunga tetap atau floating? Komen satu kata." Hindari "Gimana menurutmu?".
- Tagline **"IntipDompet. Biar dompetmu nggak kaget."** di akhir blok 5.
- Gaya merek: tanpa "cuan", "auto kaya", "pasti untung"; tidak menyuruh membeli produk tertentu; konten investasi menyebut "konten edukasi, bukan ajakan membeli" (di caption).
- Hindari pola tulisan AI: "bukan X, tapi Y" sebagai kejutan, "Hasilnya? ...", daftar "tanpa X, tanpa Y, tanpa Z", "simak sampai habis".
- Angka ditulis sebagai kata, singkatan dieja sesuai cara baca.
- Tiap blok punya `peran` (salah satu dari 5 peran di atas), `teks`, dan `visual`. Format: lihat `data/vo-inflasi.json`, ditambah `"model"` dan `peran`.

### Slide 1 carousel (wajib)
- Angka nyata atau contoh kerugian dalam rupiah/persen, ditulis besar, plus satu kata rasa sakit ("rugi", "hangus", "kepotong", "bocor").
- Judul maksimal 7 kata. Topik abstrak (kebijakan, istilah) dibuka dari dampaknya ke dompet, bukan nama kebijakannya: "Cicilan KPR-mu bisa naik" lebih baik daripada "BI Rate 5,75%".
- Slide terakhir: satu pertanyaan komentar satu kata + "kirim ke [orang spesifik]".

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
   - **Frame 0 = hook sudah utuh terbaca** (judul besar + angka), tanpa menunggu animasi kapur. Animasi kapur boleh menambah coretan/lingkaran mulai detik 0,5. Sampul dan frame pertama harus sama-sama bisa menjual video.
   - **Ada perubahan visual setiap 2–3 detik** (tulisan baru, coretan, potong kamera). Perpindahan kamera antar-bagian papan maksimal 0,6 detik; jangan ada jeda papan kosong.
   - Subtitel aktif sejak frame 0.
   - Frame terakhir menyambung ke frame pertama (papan yang sama) supaya putaran ulang terasa mulus.
3. Buat `src/produksi/<slug>/Video.tsx` dan daftarkan di `src/Root.tsx`. Setiap tulisan dan coretan disinkron dengan waktu blok VO, dan audio dipasang.
4. Rencanakan seperti sutradara: satu ide visual per blok, gerak kamera, transisi, dan aset. Area aman: isi utama y 220–1200, subtitel tipis tanpa kotak di y 1300–1480 (default aktif), tidak ada yang penting di bawah 1500. Render pakai chrome-headless-shell (`--browser-executable`), karena unduhan browser Remotion diblokir.
5. Buat storyboard dari frame asli: `node scripts/stills.mjs <Id> <dir> <frame,...> --browser <chrome-headless-shell>`, lalu susun jadi `storyboard.png`. Set status ke `storyboard-siap`. **Jangan render video** sebelum Orchestrator menyampaikan persetujuan user.
6. Setelah disetujui: render, cek dengan `look.py`, kompres (`-crf 23`, di bawah 50 MB) ke `produksi/<slug>/final.mp4`, lalu set status `render-selesai`.

## Aturan bersama
- Sebelum push: `git pull --rebase origin claude/instagram-niche-research-remotion-lqjmj6`. Ubah hanya file milik tahapmu.
- Akhiri pesan commit dengan baris atribusi yang diberikan sesi.
- Kalau terhambat (host diblokir, kuota habis, data tidak ada), tulis di `status.json` → `catatan`, lalu berhenti. Jangan mengakali dengan data karangan.

## Jadwal rutin harian (mulai 13 Nov 2026)
Target: **3 konten per hari** di @intipdompet, diunggah lewat Zernio (akun Instagram `6af4880b6c69865762dc37aa`).

| Slot | Jam (WIB) | Jenis | Persetujuan user |
|---|---|---|---|
| Pagi | 07.00 | **Carousel Papan Kapur A** (infografis 1080×1350, **maksimal 6 slide**, tanpa VO) | **Tidak perlu**: Orchestrator langsung menjadwalkan setelah lolos QC |
| Siang | 12.00 | **Carousel Papan Kapur B** | **Tidak perlu**: Orchestrator langsung menjadwalkan setelah lolos QC |
| Malam | 19.00 | **Reels Papan Kapur** (naskah 7 blok + VO) | **Wajib "accept"** dari user |

Kuota TTS gratis cukup untuk 1 video per hari (1 video = 7–8 permintaan). Carousel tidak butuh suara.

### Alur harian (dimulai 15.20 WIB, setelah kuota TTS reset 15.00 WIB)
Semua konten dibuat **sehari sebelum** tayang:
1. Orchestrator memulai produksi untuk tayang besok.
2. Research memilih **3 topik berbeda** (1 video, 2 carousel). Dalam satu hari, ketiganya tidak boleh berasal dari kategori yang sama (mis. jangan dua topik utang). Research menulis `naskah-vo.json` (video), `carousel.json` (tiap carousel), `fakta.json`, dan `caption.txt` untuk masing-masing.
3. VO membuat suara video. Director membuat video, sampul, dan slide kedua carousel.
4. **Carousel**: Orchestrator menjalankan QC (lihat di bawah). Kalau lolos, langsung dijadwalkan di Zernio untuk besok pukul 07.00 dan 12.00 WIB, lalu user diberi tahu (tautan dan pratinjau). Kalau tidak lolos, dikembalikan ke Research/Director. Jangan terbitkan carousel yang ragu.
5. **Reels**: video, sampul, dan caption dikirim ke user. **Tidak terbit sebelum user bilang "accept"**. Setelah accept, dijadwalkan besok pukul 19.00 WIB.

### QC carousel (wajib, karena terbit tanpa persetujuan user)
- Setiap angka di slide dan caption ada di `fakta.json` dengan sumber primer atau media kredibel yang mengutipnya, beserta tanggalnya. Angka tanpa sumber = gagal.
- Tidak ada label "contoh" yang tertinggal pada angka yang seharusnya data asli. Angka ilustrasi tetap diberi label "contoh".
- Tidak ada ajakan membeli produk tertentu, dan tidak ada kata terlarang (cuan, auto kaya, pasti untung).
- Render bersih: tidak ada peringatan `[carousel]` (teks kepanjangan, slide tanpa gambar), tidak ada teks terpotong, 6 slide atau kurang.
- Caption mengikuti aturan caption di bawah.

Folder carousel: `produksi/<YYYYMMDD>-<slug>/` dengan `carousel.json`, `slide-01.png` … `slide-06.png`, `caption.txt`.

Bentuk carousel (dari referensi user): **infografis, bukan sekadar tulisan.** Tiap slide berisi ilustrasi kapur di atas (±55–60% tinggi: orang, emas, HP, kartu, dll. beserta label dan panah kecil), judul besar huruf kapital di bawahnya, dan isi maksimal 2 baris. Slide 1 = hook, slide 2–5 = penjelasan, perumpamaan, efek, solusi, slide 6 = CTA + logo + tagline. Ilustrasi dibuat dari kode (`src/papan/ilustrasi/`), karena kuota pembuatan gambar AI gratis = 0.

### Aturan caption
- Baris pertama = hook (sama dengan hook video atau judul slide 1).
- 2–4 kalimat ringkasan, poin cek pakai tanda ✓.
- CTA komentar yang bisa dijawab satu kata atau angka, plus ajakan simpan atau kirim.
- Sumber data + "Konten edukasi, bukan ajakan ...".
- 5–8 hashtag yang relevan, termasuk #intipdompet.

### Pengecualian 14–16 Nov 2026 (user pulang kampung)
- User mengizinkan **semua konten terbit otomatis tanpa persetujuan**, termasuk Reels, untuk tayang Sabtu 14 sampai Senin 16 Nov.
- Carousel 6 slot (07.00 dan 12.00) dibuat dan dijadwalkan lebih awal. Topiknya evergreen supaya tetap akurat saat tayang. Ada 2 carousel cadangan di `produksi/cadangan-*`.
- Reels tetap diproduksi harian pukul 15.20 WIB (kuota TTS harian), dengan QC Reels yang ketat. Kalau gagal QC atau kuota habis, slot 19.00 diisi carousel cadangan.
- Setiap hari pukul 19.25 WIB, Orchestrator mengecek apakah semua postingan terbit, mencoba ulang yang gagal, lalu mengirim ringkasan ke user.
- Mulai tayang 17 Nov, Reels kembali wajib menunggu "accept" dari user.
