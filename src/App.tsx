/**
 * FILE: App.tsx
 * KEGUNAAN: Komponen pusat yang mengatur navigasi (routing) dan provider aplikasi.
 * File ini menentukan halaman mana yang harus muncul berdasarkan URL.
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthProvider";
import ProtectedRoute from "@/admin/components/ProtectedRoute";

// Mengimpor Halaman-Halaman Publik
import Index from "@/pages/Index";
import Katalog from "@/pages/Katalog";
import TentangKami from "@/pages/TentangKami";
import Testimoni from "@/pages/Testimoni";
import Kontak from "@/pages/Kontak";
import ProductDetail from "@/pages/ProductDetail";
import NotFound from "@/pages/NotFound";

// Mengimpor Halaman-Halaman Admin
import AdminLogin from "@/admin/pages/Login";
import AdminDashboard from "@/admin/pages/Dashboard";
import AdminProducts from "@/admin/pages/Products";
import AdminHomePage from "@/admin/pages/HomePage";
import AdminTestimonials from "@/admin/pages/Testimonials";
import AdminAboutPage from "@/admin/pages/AboutPage";
import AdminCities from "@/admin/pages/Cities";
import AdminWhatsApp from "@/admin/pages/WhatsApp";
import AdminSettings from "@/admin/pages/Settings";
import AdminLayout from "@/admin/layout/AdminLayout";

// Inisialisasi React Query Client untuk manajemen pengambilan data (caching)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Data dianggap basi seketika agar selalu fetch terbaru saat navigasi
      gcTime: 1000 * 60 * 30, // Data disimpan di cache selama 30 menit
      retry: 1, // Mencoba kembali 1 kali jika fetch gagal
      refetchOnWindowFocus: true, // Auto-update data saat user kembali ke tab browser
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* AuthProvider mengelola status login admin di seluruh aplikasi */}
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rute Publik: Bisa diakses oleh siapa saja tanpa login */}
          <Route path="/" element={<Index />} />
          <Route path="/katalog" element={<Katalog />} />
          <Route path="/tentang-kami" element={<TentangKami />} />
          <Route path="/testimoni" element={<Testimoni />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="/produk/:slug" element={<ProductDetail />} />

          {/* Rute Login Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Rute Admin yang Dilindungi: Hanya bisa diakses jika sudah login (ProtectedRoute) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Halaman-halaman di dalam Dashboard Admin */}
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="home" element={<AdminHomePage />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="about" element={<AdminAboutPage />} />
            <Route path="cities" element={<AdminCities />} />
            <Route path="whatsapp" element={<AdminWhatsApp />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Rute 404: Tampil jika alamat URL tidak ditemukan */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      {/* Komponen notifikasi (toast) */}
      <Toaster />
      <Sonner />
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
