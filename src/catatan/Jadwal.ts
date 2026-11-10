// Jadwal template Buku Catatan: menyamakan isyarat visual dengan blok voice-over.
// Semua waktu dalam DETIK (pakai d() dari tema untuk mengubah ke frame).
//
// Pakai:
//   const J = jadwalVO(vo, { b1: 0, b2: 1, mundur: 6, akhir: "selesai" }, CADANGAN);
//   J.T.b2                     -> detik saat blok VO ke-1 mulai diucapkan
//   setelah(J.r("b2"), 3.4)    -> 3,4 detik setelah bagian b2 mulai (peringatan bila lewat bagian)
//   pada(J.r("b2"), 0.5)       -> tengah bagian b2
// Peringatan muncul di log render dengan awalan [jadwal].

export type BlokVO = { mulai: number; durasi: number };
export type DataVO = { audio: string | null; total: number; blok: BlokVO[]; catatan?: string };
export type Rentang = { nama: string; mulai: number; selesai: number };

const sudah = new Set<string>();
export const peringatkan = (pesan: string) => {
  if (sudah.has(pesan)) return;
  sudah.add(pesan);
  console.warn(`[jadwal] ${pesan}`);
};

const f2 = (x: number) => x.toFixed(2);

// Titik di dalam rentang berdasarkan fraksi 0..1.
export const pada = (r: Rentang, fraksi: number, label = "") => {
  if (fraksi < 0 || fraksi > 1) peringatkan(`${r.nama}${label ? ` (${label})` : ""}: fraksi ${fraksi} di luar 0..1`);
  return r.mulai + (r.selesai - r.mulai) * fraksi;
};

// `detik` setelah rentang mulai. `lama` = perkiraan lama elemen tergambar (detik).
// Memberi peringatan bila elemen belum selesai saat kamera sudah pindah dari bagian ini.
export const setelah = (r: Rentang, detik: number, lama = 0, label = "") => {
  const t = r.mulai + detik;
  if (t + lama > r.selesai + 1e-6) {
    peringatkan(
      `${r.nama}${label ? ` (${label})` : ""}: mulai +${f2(detik)} s${lama ? ` selama ${f2(lama)} s` : ""} melewati akhir bagian (durasi ${f2(r.selesai - r.mulai)} s)`,
    );
  }
  return t;
};

// Isyarat: nama -> indeks blok VO, atau "selesai" (akhir audio + ekor).
export type Isyarat<K extends string> = Record<K, number | "selesai">;

export type Jadwal<K extends string> = {
  ada: boolean; // true = VO terpasang dan semua blok yang dirujuk tersedia
  awal: number; // detik saat audio mulai
  T: Record<K, number>; // detik tiap isyarat
  r: (k: K) => Rentang; // rentang dari isyarat k sampai isyarat berikutnya
  blok: (i: number) => Rentang | null; // rentang blok VO ke-i (VO asli, atau perkiraan bila cadangan berupa DataVO)
};

const lengkap = (vo: DataVO, indeks: number[]) => vo.total > 0 && indeks.every((i) => i >= 0 && i < vo.blok.length);

export const jadwalVO = <K extends string>(
  vo: DataVO,
  isyarat: Isyarat<K>,
  // Bila VO belum ada: jadwal bawaan per isyarat (detik), atau perkiraan VO dari naskah (perkiraanVO()).
  cadangan: Record<K, number> | DataVO,
  opsi: { awal?: number; ekor?: number } = {},
): Jadwal<K> => {
  const awal = opsi.awal ?? 1.2; // sapuan tinta + halaman kosong sejenak sebelum suara, seperti referensi
  const ekor = opsi.ekor ?? 1.4;
  const kunci = Object.keys(isyarat) as K[];
  const indeks = kunci.map((k) => isyarat[k]).filter((v): v is number => v !== "selesai");
  const ada = Boolean(vo.audio) && lengkap(vo, indeks);
  if (vo.audio && !ada) {
    peringatkan(`VO ada (${vo.blok.length} blok) tetapi isyarat merujuk blok ${Math.max(...indeks)}; memakai jadwal cadangan`);
  }
  const perkiraan = "blok" in cadangan ? (cadangan as DataVO) : null;
  const sumber = ada ? vo : perkiraan && lengkap(perkiraan, indeks) ? perkiraan : null;
  const T = {} as Record<K, number>;
  for (const k of kunci) {
    const v: number | "selesai" = isyarat[k];
    T[k] = !sumber ? (cadangan as Record<K, number>)[k] : v === "selesai" ? awal + sumber.total + ekor : awal + sumber.blok[v].mulai;
  }
  const r = (k: K): Rentang => {
    const mulai = T[k];
    const berikut = kunci.map((x) => T[x]).filter((t) => t > mulai + 1e-6);
    return { nama: k, mulai, selesai: berikut.length ? Math.min(...berikut) : mulai };
  };
  const blok = (i: number): Rentang | null =>
    sumber && sumber.blok[i]
      ? { nama: `blok ${i}`, mulai: awal + sumber.blok[i].mulai, selesai: awal + sumber.blok[i].mulai + sumber.blok[i].durasi }
      : null;
  return { ada, awal, T, r, blok };
};

// Perkiraan waktu VO dari naskah (sebelum audio ada): ±2,3 kata per detik, ditambah jeda antar-blok.
export const perkiraanVO = (naskah: { blok: { teks: string }[]; jeda_antar_blok?: number }, kataPerDetik = 2.3): DataVO => {
  const jeda = naskah.jeda_antar_blok ?? 0.35;
  let t = 0;
  const blok = naskah.blok.map((b) => {
    const durasi = b.teks.trim().split(/\s+/).length / kataPerDetik;
    const hasil = { mulai: t, durasi };
    t += durasi + jeda;
    return hasil;
  });
  return { audio: null, total: t - jeda, blok, catatan: "perkiraan dari jumlah kata" };
};

// Detik saat `frasa` kira-kira diucapkan di blok ke-i: posisi huruf frasa di teks VO blok itu, dibagi panjang teks,
// lalu dipetakan ke durasi blok. Tanpa waktu per kata dari TTS, ini perkiraan; ucapan angka yang panjang ikut terhitung
// karena teks VO sudah berupa ejaan ("tiga koma tujuh lima persen").
export const padaFrasa = (j: Pick<Jadwal<string>, "blok">, i: number, teksVO: string, frasa: string, geser = 0) => {
  const r = j.blok(i);
  if (!r) {
    peringatkan(`blok ${i} tidak ada; "${frasa}" ditempatkan di 0`);
    return 0;
  }
  const idx = teksVO.toLowerCase().indexOf(frasa.toLowerCase());
  if (idx < 0) {
    peringatkan(`frasa "${frasa}" tidak ditemukan di blok ${i}`);
    return r.mulai + geser;
  }
  return r.mulai + ((r.selesai - r.mulai) * idx) / teksVO.length + geser;
};

// ---------------------------------------------------------------- subtitel
export type BarisSubtitel = { mulai: number; selesai: number; teks: string };

// Pecah teks tampil (bentuk tulisan, mis. "3,75%" dan "LPS", bukan ejaan VO) jadi potongan pendek.
const pecah = (teks: string, maks: number): string[] => {
  const kalimat = teks.split(/(?<=[.!?;,:])\s+/).filter(Boolean);
  const hasil: string[] = [];
  for (const k of kalimat) {
    const kata = k.split(/\s+/);
    let baris = "";
    for (const w of kata) {
      if (baris && (baris + " " + w).length > maks) {
        hasil.push(baris);
        baris = w;
      } else baris = baris ? `${baris} ${w}` : w;
    }
    if (baris) {
      // gabungkan potongan pendek dengan sebelumnya bila masih muat
      const akhir = hasil[hasil.length - 1];
      if (akhir && (akhir + " " + baris).length <= maks && !/[.!?]$/.test(akhir)) hasil[hasil.length - 1] = `${akhir} ${baris}`;
      else hasil.push(baris);
    }
  }
  return hasil;
};

// Subtitel per blok VO: teks tiap blok dipecah, waktunya dibagi sebanding jumlah huruf di dalam blok.
// `teksTampil[i]` = teks blok ke-i dalam bentuk tulisan. String kosong = tanpa subtitel untuk blok itu.
export const subtitelDariBlok = (j: Pick<Jadwal<string>, "blok">, teksTampil: string[], maks = 64): BarisSubtitel[] => {
  const hasil: BarisSubtitel[] = [];
  teksTampil.forEach((teks, i) => {
    const r = j.blok(i);
    if (!r || !teks.trim()) return;
    const potong = pecah(teks.trim(), maks);
    const total = potong.reduce((n, p) => n + p.length, 0);
    let t = r.mulai;
    for (const p of potong) {
      const lama = ((r.selesai - r.mulai) * p.length) / total;
      hasil.push({ mulai: t, selesai: t + lama, teks: p });
      t += lama;
    }
  });
  // tahan tiap baris sampai baris berikutnya bila jedanya pendek (< 0,6 s), supaya tidak berkedip
  for (let i = 0; i < hasil.length - 1; i++) {
    if (hasil[i + 1].mulai - hasil[i].selesai < 0.6) hasil[i].selesai = hasil[i + 1].mulai;
  }
  return hasil;
};
