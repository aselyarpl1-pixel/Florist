/**
 * FILE: main.tsx
 * KEGUNAAN: Entry point utama aplikasi React.
 * File ini menghubungkan kode React dengan elemen HTML 'root'.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Mengimpor gaya global Tailwind CSS
import App from './App.tsx' // Mengimpor komponen utama aplikasi

// Membuat root aplikasi dan merender komponen App ke dalam DOM
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
