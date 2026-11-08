// Linimasa video "Inflasi terkendali" gaya blueprint.
// Seluruh video adalah SATU lembar gambar teknik; kamera terbang di atasnya.
// Lembar dibagi sel 1080x1920 (kolom, baris). Sel (c, r) berawal di (c*1080, r*1920).

export const SEL_W = 1080;
export const SEL_H = 1920;
export const LEMBAR_W = SEL_W * 3;
export const LEMBAR_H = SEL_H * 4 + 1200; // baris terakhir: strip blok judul

export type Segmen = {
  id: string;
  mulai: number;
  durasi: number;
  sel: [number, number];
  naskah: { teks: string; mulai: number }[];
};

export const SEGMEN: Segmen[] = [
  { id: "judul", mulai: 0, durasi: 90, sel: [0, 0], naskah: [] },
  { id: "keranjang", mulai: 90, durasi: 190, sel: [1, 0], naskah: [{ mulai: 30, teks: "Pernah nggak kamu merasa harga kebutuhan sehari-hari *makin* *mahal,* padahal katanya inflasi Indonesia masih *terkendali?*" }] },
  { id: "nah", mulai: 280, durasi: 75, sel: [2, 0], naskah: [{ mulai: 4, teks: "Nah, ini sebenarnya ada *penjelasannya.*" }] },
  { id: "gauge", mulai: 355, durasi: 185, sel: [2, 0], naskah: [{ mulai: 10, teks: "Berdasarkan data BPS, inflasi Indonesia pada Oktober 2026 tercatat sebesar *3,23* *persen* secara tahunan." }] },
  { id: "jangka", mulai: 540, durasi: 100, sel: [2, 1], naskah: [{ mulai: 16, teks: "Sementara itu, inflasi bulanan hanya *0,22* *persen.*" }] },
  { id: "beda", mulai: 640, durasi: 160, sel: [1, 1], naskah: [{ mulai: 14, teks: "Tapi jangan salah paham. Inflasi yang rendah *bukan* *berarti* harga barang kembali murah." }] },
  {
    id: "cabai",
    mulai: 800,
    durasi: 490,
    sel: [0, 1],
    naskah: [
      { mulai: 16, teks: "Bayangkan tahun lalu harga cabai Rp40 ribu sekilo. Tahun ini naik menjadi *Rp50* *ribu.*" },
      { mulai: 172, teks: "Kalau bulan depan harganya tetap Rp50 ribu, inflasinya bisa saja *nol* untuk cabai tersebut." },
      { mulai: 352, teks: "Tapi apakah harganya kembali menjadi Rp40 ribu? Ya, *belum* *tentu.*" },
    ],
  },
  { id: "salah", mulai: 1290, durasi: 66, sel: [1, 2], naskah: [] },
  { id: "ramp", mulai: 1356, durasi: 160, sel: [2, 2], naskah: [{ mulai: 14, teks: "Inflasi mengukur seberapa cepat harga *naik,* bukan seberapa *murah* harga barang." }] },
  { id: "pangan", mulai: 1516, durasi: 210, sel: [2, 3], naskah: [{ mulai: 14, teks: "Bahkan, menurut Bank Indonesia, kelompok pangan bergejolak masih mengalami inflasi tahunan sebesar *5,81* *persen* pada Oktober 2026." }] },
  { id: "dompet", mulai: 1726, durasi: 150, sel: [1, 3], naskah: [{ mulai: 14, teks: "Jadi, meskipun inflasi melambat, bukan berarti daya beli masyarakat *otomatis* *membaik.*" }] },
  {
    id: "kesimpulan",
    mulai: 1876,
    durasi: 290,
    sel: [2, 2],
    naskah: [
      { mulai: 24, teks: "Kesimpulannya: harga bisa *tetap* *mahal* meskipun inflasi sudah terkendali." },
      { mulai: 130, teks: "Karena yang melambat adalah *kenaikan* *harganya,* bukan harga barangnya yang kembali turun." },
    ],
  },
  { id: "tahu", mulai: 2166, durasi: 76, sel: [1, 2], naskah: [] },
  { id: "penutup", mulai: 2242, durasi: 58, sel: [2, 4], naskah: [] },
];

export const DURASI_BP = 2300;

export const seg = (id: string) => SEGMEN.find((s) => s.id === id)!;

// Kunci kamera global: x,y = titik lembar di tengah layar; s = zoom; rx = miring ke belakang (3D); rz = putar.
export type KunciKam = { f: number; x: number; y: number; s: number; rx?: number; rz?: number };
const C = (c: number) => c * SEL_W + 540;
const R = (r: number, dy = 0) => r * SEL_H + 960 + dy;

export const KAMERA: KunciKam[] = [
  // judul: mulai rendah & miring, naik ke tampak atas
  { f: 0, x: C(0), y: R(0, 380), s: 1.55, rx: 52, rz: -7 },
  { f: 46, x: C(0), y: R(0, 10), s: 1.04, rx: 0, rz: 0 },
  { f: 90, x: C(0), y: R(0), s: 1, rx: 0, rz: 0 },
  // terbang ke keranjang
  { f: 104, x: 1080, y: R(0, -60), s: 0.78, rx: 24, rz: 4 },
  { f: 120, x: C(1), y: R(0), s: 1, rx: 0, rz: 0 },
  { f: 280, x: C(1) + 10, y: R(0, -20), s: 1.07, rx: 0, rz: 0 },
  // "nah": kamera menukik ke gauge
  { f: 304, x: 2160, y: R(0, -140), s: 0.72, rx: 34, rz: -8 },
  { f: 340, x: C(2), y: R(0, -100), s: 1.3, rx: 14, rz: 0 },
  { f: 355, x: C(2), y: R(0, -150), s: 1.42, rx: 0, rz: 0 },
  { f: 405, x: C(2), y: R(0), s: 1, rx: 0, rz: 0 },
  { f: 540, x: C(2), y: R(0, -10), s: 1.03, rx: 0, rz: 0 },
  // turun ke jangka sorong
  { f: 548, x: C(2), y: 1920, s: 0.8, rx: 22, rz: 0 },
  { f: 558, x: C(2), y: R(1), s: 1, rx: 0, rz: 0 },
  { f: 640, x: C(2), y: R(1, -10), s: 1.04, rx: 0, rz: 0 },
  // whip ke kiri: "jangan salah paham" dengan dutch angle
  { f: 652, x: C(1), y: R(1), s: 1.02, rx: 0, rz: -6 },
  { f: 690, x: C(1), y: R(1), s: 1, rx: 0, rz: 0 },
  { f: 800, x: C(1), y: R(1, -10), s: 1.04, rx: 0, rz: 0 },
  // cabai: satu bidikan panjang
  { f: 816, x: 250, y: 1920 + 760, s: 1.8, rx: 0, rz: 0 },
  { f: 862, x: 390, y: 1920 + 860, s: 1.15, rx: 0, rz: 0 },
  { f: 965, x: 390, y: 1920 + 860, s: 1.17, rx: 0, rz: 0 },
  { f: 1000, x: 700, y: 1920 + 860, s: 1.15, rx: 0, rz: 0 },
  { f: 1150, x: 700, y: 1920 + 860, s: 1.18, rx: 0, rz: 0 },
  { f: 1182, x: 540, y: 1920 + 900, s: 0.96, rx: 0, rz: 0 },
  { f: 1290, x: 540, y: 1920 + 900, s: 0.98, rx: 0, rz: 0 },
  // disalahpahami
  { f: 1300, x: C(1), y: R(2), s: 1.0, rx: 0, rz: 0 },
  { f: 1356, x: C(1), y: R(2), s: 1.08, rx: 0, rz: 0 },
  // ramp
  { f: 1364, x: 2160, y: R(2, -100), s: 0.8, rx: 26, rz: 5 },
  { f: 1376, x: C(2), y: R(2), s: 1, rx: 0, rz: 0 },
  { f: 1516, x: C(2), y: R(2, -20), s: 1.05, rx: 0, rz: 0 },
  // pangan
  { f: 1528, x: C(2), y: R(3, -260), s: 1.3, rx: 10, rz: 0 },
  { f: 1590, x: C(2), y: R(3), s: 1, rx: 0, rz: 0 },
  { f: 1726, x: C(2), y: R(3, -10), s: 1.03, rx: 0, rz: 0 },
  // dompet
  { f: 1740, x: C(1), y: R(3), s: 1, rx: 0, rz: 0 },
  { f: 1876, x: C(1), y: R(3, -40), s: 1.13, rx: 0, rz: 0 },
  // kembali ke ramp untuk kesimpulan
  { f: 1892, x: 2160, y: 5900, s: 0.62, rx: 30, rz: 0 },
  { f: 1912, x: C(2), y: R(2), s: 1, rx: 0, rz: 0 },
  { f: 2166, x: C(2), y: R(2, 10), s: 1.05, rx: 0, rz: 0 },
  // tarik mundur: seluruh lembar terlihat
  { f: 2206, x: LEMBAR_W / 2, y: LEMBAR_H / 2, s: 0.24, rx: 18, rz: -3 },
  { f: 2242, x: LEMBAR_W / 2, y: LEMBAR_H / 2, s: 0.22, rx: 10, rz: 0 },
  // menukik ke blok judul
  { f: 2266, x: C(2), y: 4 * SEL_H + 600, s: 1, rx: 0, rz: 0 },
  { f: 2300, x: C(2), y: 4 * SEL_H + 600, s: 1.02, rx: 0, rz: 0 },
];
