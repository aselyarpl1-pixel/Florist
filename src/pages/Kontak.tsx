/**
 * FILE: Kontak.tsx
 * KEGUNAAN: Halaman Kontak yang berisi informasi alamat, telepon, email,
 * dan jam operasional toko, serta integrasi peta Google Maps.
 */
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { getWhatsAppUrl, WHATSAPP_CONFIG } from "@/config/whatsapp";

// Data statis untuk informasi kontak
const contactInfo = [
  {
    icon: MapPin,
    title: "Alamat",
    content: "Jl. Raya Janti Gg. Harjuna No.59, Jaranan, Karangjambe, Kec. Banguntapan, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55198",
    action: null,
  },
  {
    icon: Phone,
    title: "Telepon / WhatsApp",
    content: "+62 856 4642 0488",
    action: getWhatsAppUrl(),
  },
  {
    icon: Mail,
    title: "Email",
    content: "hello@florist.id",
    action: "mailto:hello@florist.id",
  },
  {
    icon: Clock,
    title: "Jam Operasional",
    content: "Senin - Sabtu: 08.00 - 20.00\nMinggu: 09.00 - 17.00",
    action: null,
  },
];

const Kontak = () => {
  return (
    <Layout>
      {/* Bagian Hero: Judul Halaman Kontak */}
      <section className="section-padding bg-secondary/50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <p className="text-primary font-medium tracking-wider uppercase text-sm">
              Hubungi Kami
            </p>
            <h1 className="heading-display text-foreground">
              Kami Siap <span className="text-primary">Membantu</span> Anda
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ada pertanyaan atau ingin berkonsultasi? Jangan ragu untuk 
              menghubungi kami. Tim kami siap melayani Anda dengan senang hati.
            </p>
          </div>
        </div>
      </section>

      {/* Bagian Utama: Kartu Informasi Kontak */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Sisi Kiri: Daftar Kartu Info (Alamat, Telp, dll) */}
            <div className="space-y-8">
              <div>
                <h2 className="heading-section text-foreground mb-4">
                  Informasi Kontak
                </h2>
                <p className="text-muted-foreground">
                  Pilih cara yang paling nyaman untuk menghubungi kami.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="bg-card p-6 rounded-xl shadow-soft space-y-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-heading text-lg font-medium text-foreground">
                      {info.title}
                    </h3>
                    {/* Link aksi (jika ada, misal klik telp langsung panggil) */}
                    {info.action ? (
                      <a
                        href={info.action}
                        target={info.action.startsWith("http") ? "_blank" : undefined}
                        rel={info.action.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-muted-foreground hover:text-primary transition-colors block whitespace-pre-line"
                      >
                        {info.content}
                      </a>
                    ) : (
                      <p className="text-muted-foreground whitespace-pre-line">
                        {info.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Sisi Kanan: Peta Google Maps (Placeholder) */}
            <div className="h-full min-h-[400px] rounded-2xl overflow-hidden shadow-card border border-border bg-muted">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.887754174828!2d110.40428617578275!3d-7.79112507732204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59f0f972a9b3%3A0x63240e4f8d55734!2sJl.%20Raya%20Janti%20No.59%2C%20Jaranan%2C%20Banguntapan%2C%20Bantul%2C%20Daerah%20Istimewa%20Yogyakarta%2055198!5e0!3m2!1sid!2sid!4v1711234567890!5m2!1sid!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Kontak;