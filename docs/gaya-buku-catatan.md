# Template "Buku Catatan"

Gaya ini diambil dari video referensi "Kenapa 1 + 1 = 2" (46,6 detik, 1080×1920, 30 fps). Analisisnya memakai `scripts/analisis_referensi.py` lalu dicek frame demi frame. Semua angka di bawah adalah hasil ukur, bukan perkiraan.

## 1. Analisis gaya referensi

### Dunia
- Seluruh video adalah **satu halaman buku catatan bergaris** yang besar di atas meja kayu. Isi tersusun sebagai beberapa "bagian" dalam dua kolom.
- Kamera berpindah dari satu bagian ke bagian lain. Di akhir, kamera **mundur memperlihatkan seluruh halaman**, sehingga semua catatan yang tadi dibahas terlihat sekaligus.
- Garis buku berjarak **±105 px** (pada layar 1080 px), warnanya coklat sangat tipis.

### Warna (diukur)
| Peran | Warna |
|---|---|
| Kertas di bawah cahaya | `#E6DAC3` |
| Kertas di tepi | `#D9CBB1` |
| Tinta utama | `#312317` (coklat-hitam) |
| Spidol merah | `#A64A33` (merah bata) |
| Pojok vignette | `#6B5949` |
| Cangkir kopi | `#462C19` |
| Sobekan kertas | `#DDCDAB` |

Saturasi rata-rata rendah (0,20). Merah hanya untuk penekanan.

### Huruf
| Peran | Ciri di referensi | Pengganti di template (Google Fonts) |
|---|---|---|
| Persamaan / angka besar | serif bertinta kasar, angka gaya lama ("1" seperti "I") | **IM Fell English** + garis tepi tipis |
| Teks utama | serif klasik, angka gaya lama ("hlm. 192") | **EB Garamond** |
| Penekanan merah | tulisan tangan spidol tebal ("kenapa", "+1 = satu langkah") | **Kalam 700** |
| Catatan kecil | tulisan tangan tipis ("— catatan no. 1", "berikutnya") | **Kalam 300** |

### Kamera
- **Tahan per bagian 6–10 detik** (median shot 7,9 detik) sambil kamera **mendorong masuk pelan** (±15% dalam 3 detik) dan sedikit bergeser.
- **Whip pan** antar-bagian sekitar 8 frame dengan **blur searah gerak** (vertikal di detik 6,5, horizontal di detik 30,4).
- **Geser diagonal pelan** antar-bagian yang berdekatan (detik 14,4 dan 22,3).
- **Mundur ke seluruh halaman** sekitar 2 detik di akhir (detik 38,5–40,5).

### Gerak isi
- Tulisan muncul **huruf demi huruf seperti sedang ditulis**: 5–8 frame per karakter untuk persamaan, lebih cepat untuk kata.
- Coretan tergambar: garis bawah, **lingkaran merah** yang tidak bulat sempurna dan ujungnya melewati titik awal, **panah melengkung** (abu tipis lalu merah tebal untuk penekanan), garis bilangan.
- **Sketsa berarsir** (mis. apel): garis tepi tergambar lalu arsiran dan bayangan arsir muncul.
- **Stempel merah miring** ("awal 1900-an").
- **Tumpukan halaman** yang bertambah dengan penghitung ("hlm. 1 → 300+").

### Pembuka dan penutup
- **Pembuka:** bentuk tinta merah lonjong menyapu diagonal dari kiri bawah ke kanan atas dalam 16 frame. Lalu ada ±1 detik halaman kosong sebelum tulisan pertama.
- **Penutup:** **sobekan kertas berselotip** naik dari bawah membawa kesimpulan ("Bukan hafalan, tapi aturan") dan ajakan follow dengan panah kecil.

### Properti dan cahaya
- Pensil, penggaris kayu, cangkir kopi, dan noda cincin kopi. Semuanya **kabur** (dekat kamera) dan bergeser lebih cepat dari kertas (parallax).
- **Vignette oval kuat:** tengah terang hangat, pojok coklat gelap, seperti lampu meja.
- Penanda bagian **"● 01"** di pojok kiri atas (titik merah + nomor) berganti tiap bagian.

### Audio
- Hampir mono (korelasi kiri-kanan 0,97), energi 97% di 150 Hz–4 kHz, hampir tanpa bass, modulasi 3–6 Hz seperti suku kata. Artinya **video digerakkan voice-over**, dengan musik minim atau tidak ada. Tidak ada subtitel: tulisan di kertas hanya kata kunci.

## 2. Isi template

| File | Isi |
|---|---|
| `src/catatan/tema.ts` | warna, font, `d()` detik→frame, ukuran halaman |
| `src/catatan/Meja.tsx` | dunia: meja kayu, halaman bergaris + serat, kamera (dorong, whip dengan blur searah, mundur), properti kabur, vignette |
| `src/catatan/Komponen.tsx` | `Tulis`, `Coret`, `Panah`, `Sumbu`, `GarisUkur`, `Sketsa`, `Stempel`, `Tumpukan`, `SapuanTinta`, `Indeks`, `CatatanSobek`, dan pembuat garis tangan (`garisTangan`, `lingkaranTangan`, `gelombang`, `busur`) |
| `src/catatan/demo/InflasiCatatan.tsx` | contoh lengkap memakai naskah inflasi |
| `public/catatan/` | tekstur serat kertas dan kayu meja (dibuat sekali, ringan dirender) |

## 3. Membuat video baru

1. Salin `src/catatan/demo/InflasiCatatan.tsx` ke `src/produksi/<slug>/Video.tsx`.
2. **Tata halaman:** `tataHalaman(n, kolom = 2)` di `Meja.tsx` menyusun `n` bagian (bebas, tidak harus 6). Teruskan hasilnya ke `<Meja ukuran={TATA}>` dan `<Kanvas lebar={TATA.lebar} tinggi={TATA.tinggi}>`.
3. **Jadwal dari VO:** `jadwalVO(vo, isyarat, cadangan)` di `Jadwal.ts`. `isyarat` memetakan nama ke indeks blok VO (atau `"selesai"` untuk akhir audio + 1,4 s). Jumlah blok bebas. Kalau VO belum ada atau kurang blok, `cadangan` (detik) dipakai dan log memberi peringatan. Untuk produksi, baca `produksi/<slug>/vo-waktu.json` dan audio `public/vo/<slug>.mp3`.
4. **Waktu di dalam bagian:** jangan tulis `T.b4 + 11.4`. Pakai `setelah(J.r("b4"), 11.4)` (detik dari awal bagian) atau `pada(J.r("b4"), 0.8)` (fraksi bagian). Keduanya mencetak peringatan `[jadwal] ...` di log render/still bila elemen jatuh setelah kamera pindah. Perbaiki semua peringatan sebelum storyboard.
5. **Kamera:** `kameraOtomatis(TATA, mulaiBagian, T.mundur, T.akhir)` membuat tahan + dorong pelan, whip ke bagian di baris yang sama, geser diagonal ke baris baru, lalu mundur ke seluruh halaman. Kunci kamera boleh ditulis tangan kalau perlu gerak khusus. Nomor pojok: `nomorBagian(fr, mulaiBagian)`.
6. **Isi bagian:** `Tulis` untuk teks, `Coret`/`Panah`/`Sketsa`/`Stempel` untuk gambar. Semua `mulai` dalam frame (`d(detik)`).
7. **Area aman (layar):** isi utama y 220–1200; subtitel di pita y 1300–1480; tidak ada yang penting di bawah 1500 (tertutup tombol Instagram).
8. **Subtitel:** aktif bawaan (banyak penonton tanpa suara), tipis tanpa kotak: `<Subtitel baris={...} />`. Dari naskah: `subtitelDariBlok(J, teksTampil)`, dengan `teksTampil[i]` berupa bentuk tulisan blok ke-i ("3,75%", "LPS"), bukan ejaan VO. Matikan dengan prop `subtitel={false}`.
9. **Audio:** `<Sequence from={d(J.awal)}><Audio src={staticFile(vo.audio)} /></Sequence>`.
10. Storyboard dulu: `node scripts/stills.mjs <Id> <dir> <frame,...> --browser <chrome-headless-shell>`. Render penuh hanya setelah disetujui.

## 4. Bedanya dengan referensi
- Template ini meniru **gaya** (warna, jenis huruf, gerak, struktur), bukan isi atau aset referensi. Semua gambar dibuat ulang dari kode, dan font diganti padanan bebas pakai dari Google Fonts.
- Referensi memakai voice-over tanpa subtitel. Template ini tetap menyalakan subtitel tipis **tanpa kotak** secara bawaan, karena banyak penonton Reels menonton tanpa suara.
