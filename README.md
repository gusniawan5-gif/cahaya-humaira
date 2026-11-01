# 🌸 Cahaya Humaira - Auto Dakwah Video

> **Platform Otomatisasi Konten & Publikasi Video Dakwah Feminin Islami**  
> Didedikasikan untuk Instagram [@cahayahumaira](https://instagram.com/cahayahumaira) & YouTube Shorts / Video di Ranah Jambi.

---

## 🎨 Tech Stack & Desain Estetik
- **Framework**: Next.js 14 (App Router) & React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Palet Warna Feminin Islami**:
  - Pink Soft (`#FADADD`)
  - Krem Hangat (`#FFF8F0`)
  - Emas Islami / Gold (`#D4AF37`)
  - Hijau Sage Natural (`#8A9A86`)
  - Plum Lembut (`#2E2429`)
- **Library**: `googleapis`, `axios`, `lucide-react`, `canvas-confetti`

---

## ✨ Fitur Utama

1. **Dashboard & Kalender 30 Hari**:
   - Kalender interaktif 30 hari yang menandai status posting (*Sudah Posting*, *Terjadwal 05:30 WIB*, *Belum Terjadwal*).
   - Statistik real-time & estimasi jangkauan dakwah: total video terunggah, total views, antrean terjadwal.
   - Sinkronisasi status koneksi Instagram & YouTube.

2. **Generator Konten Ceramah (150 Kata Gaya Keibuan Jambi)**:
   - Pilihan preset tema siap pakai: Sabar & Keteguhan Hati, Istiqomah di Jalan Hijrah, Birrul Walidain, Rezeki Berkah & Qana'ah, Tahajjud, Hijab Syar'i.
   - Input tema kustom bebas dengan generator dakwah santun.
   - Mengikutsertakan dalil Shahih (Teks Arab, Terjemahan, dan Sumber QS/Hadits).
   - Rangkaian hashtag otomatis: `#CahayaHumaira #DakwahMuslimah #JambiMengaji #CeramahHarian #MuslimahSholehah`.
   - Editor langsung untuk mengubah kata-kata sebelum tayang.

3. **Upload & Studio Editor Video**:
   - Area drag & drop video MP4 dan MOV (maksimal 500MB).
   - Video player pratinjau dengan kontrol waktu.
   - **Auto-Generate Thumbnail Vertikal 1080x1920 (9:16)** menggunakan HTML5 Canvas:
     - Mengambil frame video pilihan.
     - Lapisan gradien lembut pelindung teks.
     - Badge watermark keanggunan *"🌸 CAHAYA HUMAIRA 🌸"*.
     - Typografi judul video dan handles `@cahayahumaira`.
     - Tombol download thumbnail PNG langsung.
   - Opsi pemotong durasi otomatis 60 detik untuk Reels & Shorts.

4. **Auto Posting - Instagram Reels (Meta Graph API v21.0)**:
   - Alur 3 Langkah Resmi Meta:
     - **Langkah 1**: Inisiasi Container Reels (`POST /{ig-business-id}/media`).
     - **Langkah 2**: Polling status encoding server Meta (`GET /{container_id}` hingga `FINISHED`).
     - **Langkah 3**: Penerbitan Reels ke Feed & Tab Reels (`POST /{ig-business-id}/media_publish`).
   - Mode Simulasi (Demo) untuk mencoba tanpa token publik.

5. **Auto Posting - YouTube Shorts & Video (Googleapis)**:
   - Integrasi resmi Google YouTube Data API v3.
   - Deteksi otomatis durasi &le;60 detik sebagai **YouTube Shorts** (penambahan tag `#Shorts`).
   - Pengaturan judul, deskripsi dari caption dakwah, tags, kategori (*People & Blogs*), dan privasi (*Public / Unlisted / Private*).

6. **Jadwal Otomatis (Subuh Berkah 05:30 WIB)**:
   - Date & time picker default pukul 05:30 WIB (waktu terbaik engagement muslimah).
   - Preset waktu emas dakwah (Subuh, Ashar, Isya).
   - Penyimpanan antrean lokal di `localStorage`.
   - Tombol posting instan dan hapus antrean.

7. **Pusat Pengaturan API Terenkripsi**:
   - Menyimpan seluruh API key ke `.env.local` secara aman.
   - Panduan visual langkah demi langkah di UI.

---

## 🚀 Cara Menjalankan Aplikasi

Pastikan Node.js v18+ atau v20+ telah terpasang di komputer Anda.

### 1. Salin Pengaturan Environment
Buat salinan file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

### 2. Jalankan Server Development
```bash
npm run dev
```

Buka peramban (browser) di:
```
http://localhost:3000
```

---

## 📖 Panduan Lengkap Setup API

### 🟣 Bagian A: Menghubungkan Instagram Graph API (@cahayahumaira)

Agar aplikasi dapat mengunggah Reels ke akun `@cahayahumaira`, ikuti langkah berikut:

1. **Ubah Akun Instagram Menjadi Profesional / Bisnis**:
   - Buka aplikasi Instagram di ponsel pada akun `@cahayahumaira`.
   - Buka **Settings & Privacy** &rarr; **Account Type and Tools** &rarr; **Switch to Professional Account**.
   - Pilih kategori (misal: *Tokoh Publik* atau *Pusat Keagamaan*).
   - Tautkan dengan Facebook Page dakwah Anda (misal: *Cahaya Humaira Jambi*).

2. **Daftar di Meta for Developers**:
   - Kunjungi [https://developers.facebook.com](https://developers.facebook.com).
   - Klik **My Apps** &rarr; **Create App**.
   - Pilih jenis aplikasi: **Other** &rarr; **Business**.
   - Beri nama aplikasi: `Cahaya Humaira Auto Video`.

3. **Tambahkan Produk Instagram Graph API**:
   - Pada Dashboard App, cari **Instagram Graph API** dan klik **Set Up**.

4. **Ambil Token Melalui Graph API Explorer**:
   - Buka [Graph API Explorer](https://developers.facebook.com/tools/explorer/).
   - Pada kolom **User or Page**, pilih User Token.
   - Tambahkan Permissions penting berikut:
     - `instagram_basic`
     - `instagram_content_publish`
     - `pages_show_list`
     - `pages_read_engagement`
   - Klik **Generate Access Token** dan izinkan akses akun Facebook Anda.

5. **Dapatkan Instagram Business Account ID**:
   - Pada Graph API Explorer, jalankan query:
     ```
     GET /v21.0/me/accounts?fields=name,instagram_business_account
     ```
   - Catat `id` di dalam field `instagram_business_account`. Ini adalah **INSTAGRAM_BUSINESS_ID** Anda.

6. **Ubah Token Menjadi Long-Lived Token (60 Hari)**:
   - Masukkan Token ke Access Token Tool Meta untuk memperpanjang masa aktif menjadi 60 hari.
   - Masukkan token ke menu **Pengaturan API** di dalam web Cahaya Humaira.

---

### 🔴 Bagian B: Menghubungkan YouTube Data API v3

1. **Buat Project di Google Cloud Console**:
   - Buka [Google Cloud Console](https://console.cloud.google.com).
   - Buat Project baru bernama `Cahaya Humaira Dakwah`.

2. **Aktifkan YouTube Data API v3**:
   - Masuk ke menu **APIs & Services** &rarr; **Library**.
   - Cari **YouTube Data API v3** lalu klik **Enable**.

3. **Konfigurasi OAuth Consent Screen**:
   - Masuk ke **APIs & Services** &rarr; **OAuth consent screen**.
   - Pilih **External**.
   - Isi Nama Aplikasi: `Cahaya Humaira Dakwah`.
   - Masukkan email pengembang.
   - Pada langkah Scopes, tambahkan:
     - `https://www.googleapis.com/auth/youtube.upload`
     - `https://www.googleapis.com/auth/youtube.readonly`
   - Pada langkah Test Users, tambahkan email akun Google yang memiliki channel YouTube Anda.

4. **Buat OAuth 2.0 Client Credentials**:
   - Masuk ke **APIs & Services** &rarr; **Credentials** &rarr; **Create Credentials** &rarr; **OAuth client ID**.
   - Pilih Application type: **Web application**.
   - Tambahkan Authorized redirect URIs:
     ```
     http://localhost:3000/api/youtube/callback
     https://developers.google.com/oauthplayground
     ```
   - Salin **Client ID** dan **Client Secret**.

5. **Mendapatkan Refresh Token melalui OAuth Playground**:
   - Kunjungi [OAuth 2.0 Playground](https://developers.google.com/oauthplayground).
   - Klik ikon gerigi (Settings) di kanan atas &rarr; centang *"Use your own OAuth credentials"*.
   - Masukkan Client ID & Client Secret Anda.
   - Pada Step 1, cari **YouTube Data API v3** dan centang `https://www.googleapis.com/auth/youtube.upload`.
   - Klik **Authorize APIs** dan login dengan akun channel YouTube Anda.
   - Pada Step 2, klik **Exchange authorization code for tokens**.
   - Salin teks **Refresh token** yang dihasilkan.
   - Masukkan ke menu **Pengaturan API** di web Cahaya Humaira.

---

## 🕌 Panduan Konten Dakwah Jambi

- **Waktu Terbaik Posting**: Pukul **05:30 WIB** (Subuh Berkah) & **15:45 WIB** (Sore Berkah).
- **Format Video Reels/Shorts**: Vertikal **9:16** (1080x1920 piksel), durasi **30 - 60 detik**.
- **Nada Bahasa**: Santun, lembut, penuh kasih sayang, menghindari perdebatan (*khilafiyah*), dan mempererat ukhuwah islamiyah.

---

*Alhamdulillah, semoga aplikasi ini menjadi ladang jariyah dan wasilah tersebarnya cahaya ilmu dan kebaikan bagi muslimah di bumi Sepucuk Jambi Sembilan Lurah dan nusantara.*
