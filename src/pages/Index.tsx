/**
 * FILE: Index.tsx
 * KEGUNAAN: Halaman Beranda (Landing Page) utama website.
 * Halaman ini menggabungkan berbagai komponen besar untuk membentuk tampilan depan secara utuh.
 */
import Layout from "@/components/layout/Layout"; // Kerangka dasar (Header & Footer)
import HeroSection from "@/components/home/HeroSection"; // Bagian sambutan utama
import FeaturedProducts from "@/components/home/FeaturedProducts"; // Daftar produk unggulan
import WhyChooseUs from "@/components/home/WhyChooseUs"; // Keunggulan layanan
import TestimonialPreview from "@/components/home/TestimonialPreview"; // Cuplikan ulasan pelanggan
import CTASection from "@/components/home/CTASection"; // Bagian ajakan untuk bertindak

const Index = () => {
  return (
    <Layout>
      {/* Menyusun komponen-komponen halaman depan secara berurutan */}
      <HeroSection />
      <FeaturedProducts />
      <WhyChooseUs />
      <TestimonialPreview />
      <CTASection />
    </Layout>
  );
};

export default Index;
