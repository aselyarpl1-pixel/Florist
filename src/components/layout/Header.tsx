/**
 * FILE: Header.tsx
 * KEGUNAAN: Komponen navigasi atas (Navbar) yang muncul di setiap halaman.
 * Mendukung tampilan desktop dan mobile (hamburger menu).
 */
import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsAppUrl, WHATSAPP_CONFIG } from "@/config/whatsapp";
import { useNavigation } from "@/hooks/useNavigation";

const Header = () => {
  // State untuk mengontrol buka/tutup menu pada tampilan mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  // Mengambil data navigasi dari database (atau fallback data)
  const { data: navigation = [], isLoading } = useNavigation();
  
  // Memfilter item navigasi yang berstatus 'visible' dan mengurutkannya berdasarkan 'order'
  const displayNavigation = useMemo(() => {
    if (navigation.length > 0) {
      return navigation
        .filter(item => item.visible)
        .sort((a, b) => a.order - b.order);
    }
    
    // Data default jika navigasi di database kosong
    return [
      { id: "1", name: "Beranda", href: "/", order: 1, visible: true },
      { id: "2", name: "Katalog", href: "/katalog", order: 2, visible: true },
      { id: "3", name: "Tentang Kami", href: "/tentang-kami", order: 3, visible: true },
      { id: "4", name: "Testimoni", href: "/testimoni", order: 4, visible: true },
      { id: "5", name: "Kontak", href: "/kontak", order: 5, visible: true },
    ];
  }, [navigation]);

  // Fungsi untuk mengecek apakah sebuah menu sedang aktif (berdasarkan URL saat ini)
  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl md:text-3xl font-semibold text-foreground">
              Florist
            </span>
          </Link>

          {/* Navigasi Tampilan Desktop (Hidden on mobile) */}
          <div className="hidden lg:flex items-center gap-8">
            {displayNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-body text-sm font-medium transition-colors duration-300 relative group ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
                {/* Garis bawah indikator menu aktif */}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Tombol Call to Action (CTA) WhatsApp */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={getWhatsAppUrl(WHATSAPP_CONFIG.consultationMessage)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="default" className="btn-primary rounded-full px-6">
                Konsultasi Gratis
              </Button>
            </a>
          </div>

          {/* Tombol Menu Hamburger (Hanya tampil di mobile) */}
          <button
            type="button"
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Navigasi Tampilan Mobile (Dropdown Menu) */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in-up">
            <div className="flex flex-col gap-4">
              {displayNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-body text-base font-medium py-2 transition-colors ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href={getWhatsAppUrl(WHATSAPP_CONFIG.consultationMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2"
              >
                <Button variant="default" className="btn-primary w-full rounded-full">
                  Konsultasi Gratis
                </Button>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;