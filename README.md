# 🍼 Kiddo.ai — Platform Pintar Deteksi Tumbuh Kembang & Karakter Balita

<p align="center">
  <img src="static/assets/child_yellow.png" alt="Kiddo.ai Logo" width="120" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);"/>
</p>

<p align="center">
  <strong>Solusi Cerdas Tumbuh Kembang Si Kecil Berbasis Kecerdasan Buatan (AI) & Standar WHO</strong>
</p>

<p align="center">
  <a href="https://github.com/Jullystian017/kiddo.ai">
    <img src="https://img.shields.io/github/stars/Jullystian017/kiddo.ai?style=social" alt="Stars" />
  </a>
  <img src="https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white" alt="Python Version" />
  <img src="https://img.shields.io/badge/Flask-Web%20App-teal?logo=flask&logoColor=white" alt="Flask Framework" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## 🌟 Tentang Kiddo.ai

**Kiddo.ai** adalah platform digital interaktif berbasis web yang didedikasikan untuk membantu orang tua memantau tumbuh kembang fisik dan mental anak secara mandiri, instan, 100% gratis, dan tanpa registrasi. 

Aplikasi ini mengintegrasikan dua pilar analisis utama:
1. **Skrining Risiko Stunting**: Menggunakan algoritme **K-Nearest Neighbors (KNN)** yang presisi tinggi dan teruji sesuai standar tabel pertumbuhan fisik balita **World Health Organization (WHO)**.
2. **Pemetaan Karakter & Kepribadian Anak**: Menggunakan model kecerdasan buatan terlatih untuk memetakan kepribadian balita (Introvert vs Extrovert) beserta rekomendasi pola asuh & aktivitas interaktif yang dipersonalisasi khusus untuk anak Anda.

---

## ✨ Fitur & Keunggulan Premium

* **🔮 Klasifikasi Gizi Stunting Instan**: Cukup masukkan usia (bulan), berat badan (kg), tinggi badan (cm), dan jenis kelamin untuk mendapatkan analisis status gizi instant (Sangat Pendek, Pendek, Normal, Tinggi, Sangat Tinggi).
* **🧠 Analisis Kepribadian Berbasis AI**: Kuesioner psikologi anak sederhana untuk melacak kecenderungan kepribadian sosial balita Anda.
* **🎭 Estetika Antarmuka Kelas Dunia (WOW Factor)**:
  * **Metallic Shimmer Sweep**: Tombol interaktif memancarkan efek kilatan logam diagonal saat disentuh.
  * **Pastel Hover Glow**: Bento Grid modern dengan pendaran warna pastel yang elegan.
  * **Adaptive Status Glow**: Kartu hasil analisis memancarkan pendaran warna ambient dinamis yang menyesuaikan dengan hasil diagnosa kesehatan & kepribadian anak.
  * **Breathing Mesh Blobs**: Animasi latar belakang yang mengalir dan bernapas lembut secara alami.
* **🔒 100% Sesi Aman & Privat**: Seluruh data skrining diproses langsung secara instan tanpa perlu mendaftar akun atau menyimpan data sensitif anak ke database publik.
* **🖨️ Ekspor Laporan PDF**: Unduh hasil diagnosa lengkap dalam format cetak ramah kertas yang rapi dan profesional untuk dibawa ke posyandu atau dokter spesialis anak.

---

## 📂 Struktur Direktori Proyek

Aplikasi ini dibangun dengan arsitektur bersih yang terorganisir secara profesional:

```text
kiddo.ai/
├── models/                       # 🌟 Folder terpusat untuk berkas model AI & Scaler (.pkl)
│   ├── model_knn_stunting.pkl    # Model klasifikasi stunting KNN
│   ├── scaler.pkl                # Standard Scaler untuk input fisik stunting
│   └── Personality.pkl           # Model klasifikasi kepribadian anak
├── static/                       # 🎨 Berkas statis publik
│   ├── assets/                   # Ilustrasi & foto beresolusi tinggi yang estetik
│   │   ├── child_yellow.png
│   │   ├── doctor_pastel.png
│   │   ├── parent_child_green.png
│   │   └── hero.png              # Ilustrasi utama halaman hero
│   ├── app.js                    # Pengolah interaksi antarmuka & pemicu API Flask
│   └── style.css                 # Lembar gaya dengan efek animasi premium & glow
├── templates/                    # 📄 Berkas HTML Template
│   └── index.html                # Kerangka antarmuka utama berbasis Bento Grid
├── app.py                        # 🐍 Kode Python Flask Server utama & Endpoint API AI
├── design.md                     # Panduan gaya desain antarmuka
└── README.md                     # Dokumentasi ini
```

---

## 🛠️ Spesifikasi Teknologi

* **Backend & ML Engine**: Python 3.10+, Flask, Joblib, Scikit-Learn, Numpy, Pandas.
* **Frontend**: HTML5 Semantik, Vanilla CSS3 (tanpa framework, custom animations, custom properties), Vanilla Javascript ES6.
* **Model Model Pembelajaran**: 
  * Algoritme Klasifikasi KNN untuk Stunting (K-Nearest Neighbors).
  * Standard Scaler normalisasi fitur fisik anak.
  * Klasifikasi Biner Kepribadian (Introvert vs Extrovert).

---

## 🚀 Cara Menjalankan Aplikasi Secara Lokal

Ikuti langkah mudah berikut untuk menjalankan server **Kiddo.ai** di komputer lokal Anda:

### 1. Kloning Repositori
```bash
git clone https://github.com/Jullystian017/kiddo.ai.git
cd kiddo.ai
```

### 2. Siapkan Virtual Environment (Sangat Direkomendasikan)
Untuk Windows:
```bash
python -m venv venv
venv\Scripts\activate
```
Untuk macOS/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Instal Dependensi yang Dibutuhkan
Buat berkas `requirements.txt` jika belum ada, atau jalankan perintah instalasi berikut:
```bash
pip install flask numpy pandas scikit-learn joblib
```

### 4. Jalankan Server Flask
Jalankan server Flask utama:
```bash
python app.py
```

### 5. Akses Halaman Web
Buka browser favorit Anda dan akses alamat berikut:
```text
http://127.0.0.1:5000/
```

---

## 💡 Detail Model & Fitur Input Kepribadian

Kuesioner karakter anak mengevaluasi 7 fitur psikologis utama yang disesuaikan untuk rentang umur balita:
1. **Waktu Sendiri (Time Spent Alone)**: Kecenderungan anak asyik bermain sendirian.
2. **Kecemasan Panggung (Stage Fear)**: Reaksi anak saat menjadi pusat perhatian/tampil di depan keluarga besar.
3. **Kehadiran Acara Sosial (Social Event Attendance)**: Respons anak saat diajak ke perayaan ulang tahun atau pesta keramaian.
4. **Aktivitas Luar Ruangan (Going Outside)**: Antusiasme anak untuk bermain di taman atau alam terbuka.
5. **Kelelahan Bersosialisasi (Drained After Socializing)**: Apakah anak menjadi rewel atau lelah setelah berinteraksi lama dengan orang banyak.
6. **Lingkaran Pertemanan (Friends Circle Size)**: Jumlah teman bermain yang membuat anak merasa nyaman.
7. **Keaktifan Respons (Post Frequency/Responsiveness)**: Kecepatan dan keaktifan anak merespons stimulasi verbal/sosial.

---

## 👨‍💻 Kontributor & Pengembangan

Aplikasi ini dikembangkan dengan cinta untuk kemajuan kesehatan dan tumbuh kembang generasi penerus bangsa Indonesia.

* **Pengembang Utama**: [Jullystian017](https://github.com/Jullystian017)
* **Lisensi**: Proyek ini dilisensikan di bawah Lisensi MIT.

---

<p align="center">
  Made with ❤️ by Jullystian & pair programmed with Antigravity AI (Google DeepMind Team)
</p>
