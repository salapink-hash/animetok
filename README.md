# ⚡ AnimeTok — TikTok-Style Anime Short Video Platform

Web application modern untuk menonton dan berbagi video pendek / klip anime dengan pengalaman UI/UX vertikal ala **TikTok, Instagram Reels, dan YouTube Shorts**.

---

## 🌟 Fitur Utama

- 📱 **Vertical Snap-Scrolling**: Pengalaman swipe/scroll vertikal penuh yang mulus (*CSS scroll snap*).
- 💖 **Interaktif Action Bar**:
  - Tombol **Like** dengan animasi love meletup (*heart pop*) dan auto-increment counter.
  - Double Click / Double Tap pada layar video untuk langsung memberi Like.
  - **Drawer Komentar** interaktif (bisa membaca dan mengirim komentar baru).
  - Tombol **Bookmark / Save**.
  - Modal **Share** cepat (WhatsApp, Twitter/X, Telegram, Salin Tautan).
  - **Spinning Vinyl Disc** yang berputar saat video diputar.
- 🏷️ **Metadata & Sound Marquee**:
  - Foto profil kreator dengan tombol **+ Follow**.
  - Caption interaktif (expand/collapse) dan tagar anime.
  - Ticker animasi berjalan untuk judul lagu/soundtrack.
- 🧭 **Navigasi Lengkap**:
  - Tab Switch **"Mengikuti"** vs **"Untuk Anda (FYP)"**.
  - Navigasi Bawah: Beranda, Temukan (Explore), Upload (+), Kotak Masuk, dan Profil.
- 🚀 **Upload Klip Baru**:
  - Modal tambah klip video baru dengan input judul, deskripsi, hashtag, dan URL video direct MP4.
- ⌨️ **Desktop Keyboard Shortcuts**:
  - `↓` (Panah Bawah): Video berikutnya
  - `↑` (Panah Atas): Video sebelumnya
  - `L`: Sukai (Like) video
  - `C`: Buka komentar
  - `Klik Layar`: Play / Pause

---

## 🛠️ Cara Menjalankan Project

Buka terminal di folder project `animetok`:

```bash
cd animetok
npm install
npm run dev
```

Buka browser di: **`http://localhost:3001`**

---

## 📁 Struktur File
```
animetok/
├── src/
│   ├── app/
│   │   ├── globals.css          # Design system, CSS variables & snap styling
│   │   ├── layout.tsx           # Root metadata & layout
│   │   └── page.tsx             # Main feed player & state controller
│   ├── components/
│   │   ├── Feed/
│   │   │   ├── VideoCard.tsx    # Video player & overlay
│   │   │   ├── ActionButtons.tsx# Like, Comment, Share & Vinyl
│   │   │   └── CommentDrawer.tsx# Modal drawer komentar
│   │   ├── Navigation/
│   │   │   ├── TopHeader.tsx    # Header tab FYP/Following & Search
│   │   │   └── BottomNav.tsx    # Bottom navigation mobile bar
│   │   └── Modals/
│   │       ├── UploadModal.tsx  # Modal form upload klip baru
│   │       └── ShareModal.tsx   # Modal bagikan tautan & sosmed
│   ├── data/
│   │   └── mockClips.ts         # Data awal klip anime HD vertikal
│   └── types/
│       └── clip.ts              # TypeScript interfaces
├── package.json
├── tsconfig.json
└── next.config.js
```
