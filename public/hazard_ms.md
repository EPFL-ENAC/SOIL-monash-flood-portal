## Bahaya

Dalam kajian ini, beberapa indikator bahaya telah dipertimbangkan. Indikator bahaya ini disatukan melalui kaedah AHP oleh Saaty (Saaty 1988). Indikator bahaya yang dipertimbangkan untuk kajian ini adalah:

1. **Peta Banjir**

Peta banjir akhir yang diperoleh untuk ARI 20, 50, dan 100 dari MIKE FLOOD akan digunakan dalam peta bahaya banjir akhir.

2. **Peta Hujan**

Peta hujan isohyetal telah dikembangkan untuk kawasan tadahan. Peta hujan isohyetal ini dapat membantu menentukan kawasan yang rentan terhadap hujan lebat. Kawasan-kawasan ini mungkin berisiko mengalami banjir pluvial dalam kawasan tersebut. Sebanyak 26 stesen hujan telah dipertimbangkan, tersebar di seluruh kawasan tadahan, dengan data yang berkisar dari 2006 hingga 2017. Kaedah pembobotan jarak terbalik (IDW) dalam perisian ArcGIS telah digunakan dengan nilai kuasa ditetapkan pada 2.

3. **Cerun dan Ketinggian**

Peta cerun dan ketinggian diperoleh dari peta DEM yang diperoleh daripada Jabatan Ukur dan Pemetaan Malaysia (dikenali sebagai JUPEM dalam bahasa tempatan) dari kawasan tadahan.

4. **Litologi**

Dalam beberapa tahun kebelakangan ini, litologi telah dianggap sebagai faktor penting dalam analisis banjir (Dung et al. 2021). Secara umum, penyelidik terdahulu telah menyelidiki faktor ketelapan, yang secara khusus menilai lapisan berdasarkan nilai kekonduksian hidraulik masing-masing. Walau bagaimanapun, litologi tidak secara langsung mempengaruhi banjir tetapi mempengaruhi keupayaan rangkaian saliran dalam kawasan tadahan (Das 2020). Oleh itu, hipotesisnya adalah semakin telap lapisan, semakin rendah kerentanan banjir dalam kawasan tersebut. Penilaian tahap ketelapan profil litologi dalam kawasan tadahan dilakukan dengan mengadopsi sistem penilaian yang dilakukan oleh Vojtek dan Vojteková (2019). Peta litologi diperoleh dari Jabatan Mineral dan Geosains Malaysia.

5. **Peta Risiko Erosi Tanah Terbiar**

Peta risiko erosi tanah terbiar telah dipertimbangkan dengan menggunakan peta penggunaan tanah dan risiko erosi tanah yang disediakan oleh Jabatan Pertanian Malaysia (dikenali sebagai DOA dalam bahasa tempatan). Peta risiko erosi tanah dibangunkan menggunakan persamaan universal kerugian tanah yang disemak (USLE) yang ditunjukkan dalam Eq. (1). Konservasionis tanah sangat menggunakan USLE untuk menganggar kerugian tanah. Ini membantu menentukan amalan terbaik untuk mengawal erosi di tapak tertentu (Renard et al. 2017). Perhatikan bahawa setiap elemen dalam persamaan ini adalah tidak berdimensi.
A = R K L S C P
(1)

Di mana,

- A = Kerugian tanah yang dikira
- R = Faktor erosiviti hujan-larian
- K = Faktor keerodibelan tanah
- L = Faktor panjang cerun
- S = Faktor kecuraman cerun
- C = Faktor pengurusan penutup
- P = Faktor pengurusan

Salah satu kebimbangan akibat peristiwa banjir adalah potensi penghasilan sedimen di kawasan yang rentan terhadap erosi tanah. Kerentanan tertinggi untuk penghasilan sedimen biasanya berada di tanah terdedah tanpa penutup tumbuh-tumbuhan atau struktur. Tanah atas yang terdedah akan mudah dihanyutkan akibat peristiwa banjir dan boleh merugikan kawasan sekitarnya. Kawasan-kawasan ini mungkin termasuk tanah terbiar atau tanah yang belum dibangunkan dalam kawasan tadahan. Oleh itu, peta penggunaan tanah disatukan dengan peta risiko erosi tanah untuk menentukan kawasan-kawasan ini. Kriteria risiko kemudian diklasifikasikan berdasarkan persamaan USLE.

6. **Penggunaan Tanah dan Penutup Tanah (LULC)**

LULC dalam kawasan tadahan diperoleh daripada Jabatan Perancangan Bandar dan Desa Persekutuan (PLANMalaysia). Jenis-jenis LULC yang berbeza dalam kawasan tadahan mempunyai kadar penyusupan yang pelbagai; oleh itu, peta LULC memainkan peranan dalam pemetaan bahaya banjir (Kazakis et al. 2015).

6 indikator bahaya yang dipertimbangkan untuk kajian ini ditunjukkan dalam Rajah 3. Setiap peta bahaya diklasifikasikan kepada 5 bahagian untuk konsistensi. Penarafan dari 1 hingga 5 diberikan kepada setiap indikator bahaya, di mana 5 dianggap memberikan sumbangan terbesar kepada bahaya, manakala 1 adalah yang paling rendah. Penarafan dan bobot setiap indikator bahaya yang akan digunakan untuk AHP ditunjukkan dalam Jadual 1.

Jadual 1: Bobot dan penarafan yang dipertimbangkan untuk indikator bahaya yang dipertimbangkan dalam AHP

| Parameter                  | Kelas         | Penarafan | Bobot (%) |
| -------------------------- | ------------- | --------- | --------- |
| Banjir (m)                 | 0 - 0.25      | 1         | 37        |
|                            | 0.26 - 0.50   | 2         |           |
|                            | 0.51 - 1.00   | 3         |           |
|                            | 1.00 - 1.50   | 4         |           |
|                            | ≥ 1.50        | 5         |           |
| Hujan (mm/thn)             | 1,480 - 1,813 | 1         | 29        |
|                            | 1,814 - 2,147 | 2         |           |
|                            | 2,148 - 2,481 | 3         |           |
|                            | 2,482 - 2,814 | 4         |           |
|                            | ≥ 2,815       | 5         |           |
| Cerun (°)                  | 0 - 10        | 5         | 12        |
|                            | 11 - 25       | 4         |           |
|                            | 26 - 40       | 3         |           |
|                            | 41 - 60       | 2         |           |
|                            | ≥ 61          | 1         |           |
| Ketinggian (m)             | 0 - 150       | 5         | 11        |
|                            | 151 - 400     | 4         |           |
|                            | 401 - 700     | 3         |           |
|                            | 701 - 1000    | 2         |           |
|                            | ≥ 1001        | 1         |           |
| Penggunaan Tanah           | Badan air     | 5         | 5         |
|                            | Kawasan bina  | 4         |           |
|                            | Tanah terbiar | 3         |           |
|                            | Pertanian     | 2         |           |
|                            | Hutan         | 1         |           |
| Litologi                   | Sangat rendah | 1         | 3         |
| (Ketelapan)                | Rendah        | 2         |           |
|                            | Sederhana     | 3         |           |
|                            | Tinggi        | 4         |           |
|                            | Sangat tinggi | 5         |           |
| Risiko erosi tanah terbiar | Sangat rendah | 1         | 3         |
|                            | Rendah        | 2         |           |
|                            | Sederhana     | 3         |           |
|                            | Tinggi        | 4         |           |
|                            | Sangat tinggi | 5         |           |
