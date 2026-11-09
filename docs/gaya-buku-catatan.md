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

1. Salin `src/catatan/demo/InflasiCatatan.tsx` dan ganti namanya.
2. **Atur jadwal di objek `T` (dalam detik).** Kalau ada voice-over, isi dengan waktu kalimat di rekaman.
3. Isi tiap bagian (B1–B6) dengan `Tulis` untuk teks dan `Coret`/`Panah`/`Sketsa`/`Stempel` untuk gambar. Semua punya `mulai` dalam frame (`t(detik)`).
4. Jaga isi bagian di **y 250–1200** (koordinat bagian). Area bawah dipakai subtitel dan tertutup tombol Instagram.
5. Voice-over: tambahkan `<Audio src={staticFile("vo.mp3")} />` dan matikan subtitel (`subtitel: false`), seperti di referensi.
6. Render: `npx remotion render <IdKomposisi> out/nama.mp4`.

## 4. Bedanya dengan referensi
- Template ini meniru **gaya** (warna, jenis huruf, gerak, struktur), bukan isi atau aset referensi. Semua gambar dibuat ulang dari kode, dan font diganti padanan bebas pakai dari Google Fonts.
- Referensi memakai voice-over tanpa subtitel. Demo ini memakai subtitel karena belum ada voice-over. Subtitel dibuat **tanpa kotak**, sesuai permintaan.
