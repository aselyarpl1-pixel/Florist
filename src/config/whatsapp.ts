/**
 * FILE: whatsapp.ts
 * KEGUNAAN: Konfigurasi pusat untuk integrasi WhatsApp.
 * Menyimpan nomor tujuan dan template pesan otomatis.
 */
// ===============================
// Konfigurasi WhatsApp
// ===============================
// Format nomor: kode negara + nomor (tanpa '+' dan tanpa spasi)

export const WHATSAPP_CONFIG = {
  // Nomor WhatsApp tujuan (Pemilik Toko)
  phoneNumber: "6285646420488",

  // Pesan default untuk tombol melayang (Floating Button)
  defaultMessage:
    "Halo Florist, saya ingin bertanya tentang produk di website Anda.",

  // Pesan otomatis untuk tombol konsultasi gratis
  consultationMessage:
    "Halo Florist, saya ingin berkonsultasi mengenai produk yang cocok untuk kebutuhan saya.",

  // Template pesan untuk pesanan produk spesifik
  productMessage: (productName: string, productUrl: string) =>
    `Halo, saya tertarik dengan produk berikut:
Nama Produk: ${productName}
Link Produk: ${productUrl}
`,
};

// ===============================
// Fungsi Pembantu (Helper Functions)
// ===============================

// Fungsi untuk membuat link WhatsApp (wa.me) berdasarkan pesan tertentu
export const getWhatsAppUrl = (
  message: string = WHATSAPP_CONFIG.consultationMessage
) => {
  return `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodeURIComponent(
    message
  )}`;
};

// Fungsi untuk membuat link WhatsApp khusus untuk satu produk
export const getProductWhatsAppUrl = (
  productName: string,
  productUrl: string
) => {
  return getWhatsAppUrl(
    WHATSAPP_CONFIG.productMessage(productName, productUrl)
  );
};