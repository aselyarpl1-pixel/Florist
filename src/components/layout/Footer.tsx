/**
 * FILE: Footer.tsx
 * KEGUNAAN: Komponen kaki halaman (Footer) yang berisi informasi kontak,
 * tautan navigasi cepat, dan media sosial toko.
 */
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";
import { getWhatsAppUrl } from "@/config/whatsapp";
import { useFooterSettings } from "@/hooks/useFooterSettings";

const Footer = () => {
  // Mengambil data pengaturan footer dari database (alamat, deskripsi, dll)
  const { data: footerData } = useFooterSettings();
  
  // Data default jika database tidak mengembalikan data
  const footer = footerData || {
    brandDescription: "Hadirkan kebahagiaan melalui bunga segar, hampers eksklusif, dan dekorasi premium untuk setiap momen spesial Anda.",
    address: "Jl. Raya Janti Gg. Harjuna No.59, Jaranan, Karangjambe, Kec. Banguntapan, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55198",
    phone: "+62 856 4642 0488",
    email: "hello@florist.id",
    hours: "Senin - Sabtu: 08.00 - 20.00\nMinggu: 09.00 - 17.00",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Bagian 1: Informasi Brand & Media Sosial */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-heading text-2xl font-semibold">
                Florist
              </span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              {footer.brandDescription}
            </p>
            <div className="flex gap-4 pt-2">
              {/* Ikon Media Sosial */}
              <a
                href={footer.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={footer.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-whatsapp transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Bagian 2: Tautan Cepat Navigasi */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Menu</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/tentang-kami" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/katalog" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Katalog Produk
                </Link>
              </li>
              <li>
                <Link to="/testimoni" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Testimoni
                </Link>
              </li>
              <li>
                <Link to="/kontak" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Bagian 3: Kategori Produk Populer */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Kategori</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/katalog?kategori=buket-bunga" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Buket Bunga
                </Link>
              </li>
              <li>
                <Link to="/katalog?kategori=hampers" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Hampers
                </Link>
              </li>
              <li>
                <Link to="/katalog?kategori=kue-tart" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Kue & Tart
                </Link>
              </li>
              <li>
                <Link to="/katalog?kategori=papan-bunga" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Papan Bunga
                </Link>
              </li>
            </ul>
          </div>

          {/* Bagian 4: Informasi Kontak & Alamat Toko */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span className="text-background/70 text-sm leading-relaxed">
                  {footer.address}
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-background/70 text-sm">
                  {footer.phone}
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-background/70 text-sm">
                  {footer.email}
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <span className="text-background/70 text-sm whitespace-pre-line">
                  {footer.hours}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Hak Cipta & Garis Bawah */}
        <div className="border-t border-background/10 mt-16 pt-8 text-center">
          <p className="text-background/50 text-xs">
            © {new Date().getFullYear()} Florist. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;