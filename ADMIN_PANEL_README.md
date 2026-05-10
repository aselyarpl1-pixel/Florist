# Panel Admin Florist

Dokumentasi ini menjelaskan struktur navigasi dan alur kerja panel admin untuk aplikasi Florist.

## Alur Kerja Admin (Flowchart)

Berikut adalah diagram alur proses yang dilakukan oleh admin, mulai dari login hingga manajemen konten:

```mermaid
graph TD
    A[Mulai] --> B{Halaman Login}
    B -- Input Username/Password --> C{Validasi Login}
    C -- Gagal --> B
    C -- Berhasil --> D[Admin Dashboard]

    D --> E[Sidebar Navigasi]

    subgraph "Manajemen Konten"
        E --> F[Manajemen Produk]
        E --> G[Home Page]
        E --> H[Testimoni]
        E --> I[Tentang Kami]
        E --> J[Kota & Wilayah]
        E --> K[WhatsApp]
        E --> L[Pengaturan]
    end

    F --> F1[Tambah/Edit/Hapus Produk]
    G --> G1[Edit Hero & Banner]
    H --> H1[Kelola Review Pelanggan]
    I --> I1[Edit Konten Profil]
    J --> J1[Update Area Layanan]
    K --> K1[Ubah Nomor WA & Pesan]
    L --> L1[Edit Menu & Footer]

    E --> M[Logout]
    M --> B
```

## Struktur Folder Admin

- `src/admin/pages/`: Halaman-halaman utama panel admin.
- `src/admin/components/`: Komponen UI khusus admin (seperti ProtectedRoute).
- `src/admin/hooks/`: Logika kustom untuk autentikasi dan pengambilan data admin.
- `src/admin/layout/`: Tata letak (Layout) utama yang menyediakan sidebar dan header.

## Cara Menggunakan
1. Buka rute `/admin/login` untuk masuk.
2. Gunakan sidebar untuk berpindah antar menu manajemen.
3. Semua perubahan data akan langsung tersimpan ke database (Supabase).
