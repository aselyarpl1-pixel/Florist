/**
 * FILE: client.ts (Supabase Integration)
 * KEGUNAAN: Konfigurasi dan inisialisasi koneksi ke server database Supabase.
 * File ini membaca kunci akses dari file .env dan membuat objek 'supabase' untuk query data.
 */
import { createClient } from "@supabase/supabase-js";

// Mengambil URL dan Kunci Anonim dari variabel lingkungan (.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Fungsi validasi untuk memastikan URL Supabase benar
const isValidUrl = (url: string) => {
  try {
    return url && url.startsWith('http') && new URL(url).hostname.includes('supabase');
  } catch {
    return false;
  }
};

// Fungsi validasi untuk memastikan Kunci API Supabase valid (bukan teks kosong)
const isValidKey = (key: string) => {
  return key && key.length > 20; 
};

// Variabel pengecekan apakah konfigurasi sudah lengkap atau belum
export const isSupabaseConfigured = isValidUrl(supabaseUrl) && isValidKey(supabaseAnonKey);

/**
 * Membuat Client Supabase.
 * Objek 'supabase' inilah yang digunakan di seluruh aplikasi untuk 
 * melakukan operasi database (SELECT, INSERT, UPDATE, DELETE).
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: false, // Sesi tidak disimpan permanen (untuk keamanan)
    },
    global: {
      headers: {
        'apikey': supabaseAnonKey || 'placeholder-key',
      },
    },
  }
);

// Menampilkan status koneksi di konsol browser (hanya saat mode pengembangan)
if (import.meta.env.DEV) {
  if (!isSupabaseConfigured) {
    console.info(
      '%c[Supabase] Menggunakan data lokal (Fallback) - Kredensial belum dikonfigurasi',
      'color: #f59e0b; font-weight: bold;'
    );
  } else {
    console.info(
      '%c[Supabase] Terhubung ke Backend Supabase',
      'color: #10b981; font-weight: bold;'
    );
  }
}
