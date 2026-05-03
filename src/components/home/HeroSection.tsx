/**
 * FILE: HeroSection.tsx
 * KEGUNAAN: Bagian utama (Hero) pada halaman depan yang berisi pesan sambutan,
 * gambar produk unggulan, statistik toko, dan tombol aksi utama.
 */
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getWhatsAppUrl, WHATSAPP_CONFIG } from "@/config/whatsapp";
import heroImage from "@/assets/hero-image.jpg";
import { useHomeContent } from "@/hooks/useHomeContent";

const HeroSection = () => {
  // Mengambil konten hero dari database agar bisa diubah melalui panel admin
  const { data: content } = useHomeContent();
  
  // Data fallback jika koneksi database gagal atau kosong
  const heroContent = content?.hero || {
    subtitle: "Premium Gift & Flower Shop",
    title: "Hadirkan Kebahagiaan di",
    titleHighlight: "Setiap Momen",
    description: "Buket bunga segar, hampers eksklusif, dan dekorasi premium untuk momen spesial Anda. Pengiriman same-day untuk area Jakarta.",
    ctaPrimary: "Lihat Katalog",
    ctaSecondary: "Konsultasi Gratis",
    statsCustomers: "1000+",
    statsOrders: "5000+",
    statsRating: "4.9"
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Latar belakang dengan gradasi warna */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-accent" />
      
      {/* Elemen dekoratif lingkaran cahaya (blur) */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-rose/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Bagian Kiri: Teks dan Tombol Aksi */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <p className="text-primary font-medium tracking-wider uppercase text-sm">
                {heroContent.subtitle}
              </p>
              <h1 className="heading-display text-foreground leading-tight">
                {heroContent.title} <span className="text-primary">{heroContent.titleHighlight}</span>
              </h1>
              <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
                {heroContent.description}
              </p>
            </div>

            {/* Tombol Navigasi Katalog dan WhatsApp */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/katalog">
                <Button size="lg" className="btn-primary rounded-full px-8 gap-2 group">
                  {heroContent.ctaPrimary}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a
                href={getWhatsAppUrl(WHATSAPP_CONFIG.consultationMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="btn-outline-gold rounded-full px-8"
                >
                  {heroContent.ctaSecondary}
                </Button>
              </a>
            </div>

            {/* Bagian Statistik Toko (Trust Badges) */}
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <p className="font-heading text-3xl font-semibold text-primary">{heroContent.statsCustomers}</p>
                <p className="text-sm text-muted-foreground">Pelanggan Puas</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="font-heading text-3xl font-semibold text-primary">{heroContent.statsOrders}</p>
                <p className="text-sm text-muted-foreground">Pesanan Terkirim</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="font-heading text-3xl font-semibold text-primary">{heroContent.statsRating}</p>
                <p className="text-sm text-muted-foreground">Rating</p>
              </div>
            </div>
          </div>

          {/* Bagian Kanan: Gambar Produk (Hanya tampil di desktop) */}
          <div 
            className="relative hidden lg:flex items-center justify-center animate-fade-in-up" 
            style={{ animationDelay: "0.4s", animationFillMode: "both" }}
          >
            <div className="relative w-full max-w-[450px]">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="aspect-[3/4]">
                  <img 
                    src={heroImage} 
                    alt="Florist - Buket Bunga dan Hampers Premium" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              {/* Ornamen garis emas di belakang gambar */}
              <div className="absolute -top-6 -right-6 w-full h-full border-2 border-primary/20 rounded-3xl z-0" />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
