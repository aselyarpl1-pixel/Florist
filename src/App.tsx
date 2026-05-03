import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthProvider";
import ProtectedRoute from "@/admin/components/ProtectedRoute";

// Public Pages
import Index from "@/pages/Index";
import Katalog from "@/pages/Katalog";
import TentangKami from "@/pages/TentangKami";
import Testimoni from "@/pages/Testimoni";
import Kontak from "@/pages/Kontak";
import ProductDetail from "@/pages/ProductDetail";
import NotFound from "@/pages/NotFound";

// Admin Pages
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/katalog" element={<Katalog />} />
          <Route path="/tentang-kami" element={<TentangKami />} />
          <Route path="/testimoni" element={<Testimoni />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="/produk/:slug" element={<ProductDetail />} />

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="home" element={<AdminHomePage />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="about" element={<AdminAboutPage />} />
            <Route path="cities" element={<AdminCities />} />
            <Route path="whatsapp" element={<AdminWhatsApp />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
