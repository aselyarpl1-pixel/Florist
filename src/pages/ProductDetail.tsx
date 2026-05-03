/**
 * FILE: ProductDetail.tsx
 * KEGUNAAN: Halaman detail produk yang menampilkan informasi lengkap satu produk.
 * Menangani pengambilan data produk berdasarkan slug, galeri gambar, dan tombol pesan.
 */
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, MessageCircle, Truck, Shield, RefreshCw, ZoomIn } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import NotFound from "./NotFound";
import ProductCard from "@/components/product/ProductCard";
import { useProductBySlug, useProducts, useProductsByCategory } from "@/hooks/useProducts";
import { getProductWhatsAppUrl, getWhatsAppUrl, WHATSAPP_CONFIG } from "@/config/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import { getProductImageUrl } from "@/lib/imageUtils";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

// Fungsi untuk memformat harga ke Rupiah
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const ProductDetail = () => {
  // Mengambil parameter 'slug' dari URL
  const { slug } = useParams<{ slug: string }>();
  
  // 1. Mencoba mengambil data produk secara langsung berdasarkan slug
  const { data: directProduct, isLoading: isLoadingDirect, isError: isDirectError } = useProductBySlug(slug || "");
  
  // 2. Fallback: Mengambil semua produk jika pencarian langsung gagal (untuk slug lama/kotor)
  const shouldFetchFallback = !isLoadingDirect && !directProduct;
  const { data: allProducts = [], isLoading: isLoadingFallback } = useProducts();
  
  // 3. Fungsi pembantu untuk membersihkan slug URL
  const getCleanSlug = (s: string) => {
    if (s.includes('/') || s.startsWith('http')) {
      return s.split('/').filter(Boolean).pop() || s;
    }
    return s;
  };

  // 4. Menentukan produk mana yang akan ditampilkan (hasil direct atau hasil fallback)
  const product = directProduct || (shouldFetchFallback ? allProducts.find(p => getCleanSlug(p.slug) === slug) : null);
  
  // 5. Mengambil produk terkait berdasarkan kategori yang sama
  const category = product?.category;
  const { data: relatedProductsData = [], isLoading: isLoadingRelated } = useProductsByCategory(
    category || "", 
    4,
    !!category // Hanya fetch jika kategori tersedia
  );
  
  // Memfilter agar produk yang sedang dilihat tidak muncul kembali di daftar 'Produk Serupa'
  const relatedProducts = relatedProductsData.length > 0 
    ? relatedProductsData.filter(p => p.id !== product?.id).slice(0, 4)
    : (allProducts.length > 0 && product ? allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4) : []);

  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;

  // Menampilkan indikator loading saat data sedang diambil
  const isLoading = isLoadingDirect || (shouldFetchFallback && isLoadingFallback && !product);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Memuat produk...</p>
        </div>
      </Layout>
    );
  }

  // Menampilkan halaman 404 jika produk tidak ditemukan
  if (!product) {
    return <NotFound />;
  }

  // Logika perhitungan diskon
  const discount = (product.original_price || 0) > product.price
    ? Math.round((((product.original_price || 0) - product.price) / (product.original_price || 1)) * 100)
    : 0; 

  const isBestSeller = product.is_best_seller;
  const isExclusive = product.is_exclusive;
  const isPremium = product.is_premium;

  // Penanganan Gambar Produk (bisa berupa array atau string tunggal)
  let rawImages: string[] = [];
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    rawImages = product.images;
  } else if (product.image_url) {
    rawImages = [product.image_url];
  } else if (product.images && typeof product.images === 'string') {
    rawImages = [product.images as string];
  }

  const mainImage = getProductImageUrl(rawImages[0]);
  const images = rawImages.map(getProductImageUrl);

  return (
    <Layout>
      {/* Bagian Breadcrumb (Navigasi Jejak) */}
      <div className="bg-secondary/50 py-4">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Beranda
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/katalog" className="text-muted-foreground hover:text-foreground transition-colors">
              Katalog
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Konten Utama Detail Produk */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {/* Tombol Kembali */}
          <Link
            to="/katalog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Katalog
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Bagian Galeri Gambar */}
            <div className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="aspect-square rounded-2xl overflow-hidden bg-muted shadow-card cursor-pointer group relative">
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 bg-white/90 px-4 py-2 rounded-full text-sm font-medium transition-all transform translate-y-4 group-hover:translate-y-0 flex items-center gap-2 shadow-lg">
                        <ZoomIn className="w-4 h-4" />
                        Klik untuk memperbesar
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-transparent border-none shadow-none ring-0 focus:ring-0">
                   <div className="relative w-full h-[80vh] flex items-center justify-center">
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="w-full h-full object-contain rounded-lg"
                    />
                   </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Bagian Informasi Produk */}
            <div className="space-y-6">
              {/* Kategori */}
              <p className="text-primary font-medium tracking-wider uppercase text-sm">
                {product.category.replace("-", " ")}
              </p>

              {/* Judul Produk */}
              <h1 className="heading-section text-foreground">
                {product.name}
              </h1>

              {/* Label Status (Badges) */}
              <div className="flex flex-wrap gap-2">
                {isBestSeller && (
                  <span className="bg-blue-600 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded shadow-sm">
                    Best Seller
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-red-600 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded shadow-sm">
                    Hemat {discount}%
                  </span>
                )}
                {isExclusive && (
                  <span className="bg-purple-600 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded shadow-sm">
                    Exclusive
                  </span>
                )}
                {isPremium && (
                  <span className="bg-amber-600 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded shadow-sm">
                    Premium
                  </span>
                )}
              </div>

              {/* Bagian Harga */}
              <div className="space-y-3">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="font-heading text-4xl md:text-5xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {discount > 0 && (
                    <span className="text-xl text-muted-foreground line-through decoration-red-500/50">
                      {formatPrice(product.original_price || 0)}
                    </span>
                  )}
                </div>
                {/* Informasi Hemat/Promo */}
                {discount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="bg-red-600 text-white text-sm font-bold px-2 py-1 rounded shadow-sm">
                      Hemat {discount}%
                    </span>
                    <span className="text-red-600 font-semibold text-lg">
                      Promo Spesial!
                    </span>
                  </div>
                )}
              </div>

              {/* Deskripsi Produk */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Tombol Pesan (WhatsApp) */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href={product.product_url || getProductWhatsAppUrl(product.name, `${siteUrl}/produk/${product.slug}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full btn-primary rounded-full py-6 gap-2 text-base">
                    <ShoppingBag className="w-5 h-5" />
                    {product.product_url ? "Beli Sekarang" : "Pesan Sekarang"}
                  </Button>
                </a>
                <a
                  href={getWhatsAppUrl(WHATSAPP_CONFIG.consultationMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    className="w-full btn-outline-gold rounded-full py-6 gap-2 text-base"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Tanya Dulu
                  </Button>
                </a>
              </div>

              {/* Fitur Tambahan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Same-day Delivery</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Garansi Kualitas</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RefreshCw className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Free Revisi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bagian Produk Terkait */}
      {relatedProducts.length > 0 && (
        <section className="section-padding bg-secondary/50">
          <div className="container-custom">
            <h2 className="heading-section text-foreground text-center mb-12">
              Produk Serupa
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ProductDetail;