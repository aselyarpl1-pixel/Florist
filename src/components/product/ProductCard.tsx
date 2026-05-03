/**
 * FILE: ProductCard.tsx
 * KEGUNAAN: Komponen untuk menampilkan ringkasan informasi produk dalam bentuk kartu (card).
 * Menangani tampilan harga, diskon, gambar, dan tombol pesan.
 */
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product as ApiProduct } from "@/lib/api";
import { Product as DataProduct } from "@/data/products";
import { getProductWhatsAppUrl } from "@/config/whatsapp";
import { getProductImageUrl } from "@/lib/imageUtils";

interface ProductCardProps {
  product: ApiProduct | DataProduct;
}

// Fungsi pembantu untuk memformat angka menjadi mata uang Rupiah
const formatPrice = (price: number | undefined) => {
  if (price === undefined || price === null) return "";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace(/\s/g, "");
};

const ProductCard = ({ product }: ProductCardProps) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  
  // Menangani berbagai format data gambar dari API atau data lokal
  let rawImages: string[] = [];
  
  if ('images' in product && Array.isArray(product.images) && product.images.length > 0) {
    rawImages = product.images;
  } else if ('image_url' in product && product.image_url) {
    rawImages = [product.image_url];
  } else if ('images' in product && typeof product.images === 'string') {
    rawImages = [product.images as string];
  }
  
  const imageUrl = getProductImageUrl(rawImages[0]);
  const shortDescription = 'shortDescription' in product ? product.shortDescription : product.description?.substring(0, 100);
  
  // Mengecek harga original (untuk tampilan diskon/harga coret)
  const originalPrice: number | undefined = (() => {
    if ('originalPrice' in product && product.originalPrice) return Number(product.originalPrice);
    if ('original_price' in product && product.original_price) return Number(product.original_price);
    return undefined;
  })();
  
  // Menangani label status produk (Best Seller, Exclusive, Premium)
  const p = product as any;
  const isBestSeller = p.bestSeller || p.is_best_seller || p.best_seller || false;
  const isExclusive = p.exclusive || p.is_exclusive || false;
  const isPremium = p.premium || p.is_premium || false;

  const productUrl = 'productUrl' in product ? product.productUrl : ('product_url' in product ? product.product_url : '');
  
  // Fungsi untuk membersihkan slug URL (menghindari error jika slug berisi URL lengkap)
  const getCleanSlug = (slug: string) => {
    if (slug.includes('/') || slug.startsWith('http')) {
      return slug.split('/').filter(Boolean).pop() || slug;
    }
    return slug;
  };

  const cleanSlug = getCleanSlug(product.slug);

  // Menghitung persentase diskon jika ada harga original
  const discountPercentage = originalPrice && originalPrice > product.price
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100) 
    : 0;

  return (
    <div className="group card-premium">
      {/* Kontainer Gambar */}
      <Link to={`/produk/${cleanSlug}`} className="block relative overflow-hidden">
        <div className="aspect-[4/5] bg-muted">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        {/* Label Status (Badges) */}
        <div className="absolute top-3 left-3 z-30 flex flex-col gap-2 items-start">
          {isBestSeller && (
            <span className="bg-blue-600 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded shadow-sm">
              Best Seller
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-600 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded shadow-sm">
              Hemat {discountPercentage}%
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
      </Link>

      {/* Konten Teks */}
      <div className="p-4 space-y-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
          {product.category.replace("-", " ")}
        </p>
        <Link to={`/produk/${cleanSlug}`}>
          <h3 className="font-heading text-base font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        {shortDescription && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {shortDescription}
          </p>
        )}
        
        {/* Bagian Harga */}
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-heading text-xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {/* Tampilan harga coret jika ada diskon */}
            {originalPrice && originalPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through decoration-red-500/50">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          {/* Label Promo Hemat */}
          {originalPrice && originalPrice > product.price && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded shadow-sm">
                Hemat {discountPercentage}%
              </span>
              <span className="text-[11px] font-medium text-red-600">
                Lagi Promo!
              </span>
            </div>
          )}
        </div>

        {/* Tombol Aksi (WhatsApp) */}
        <a
          href={productUrl ? productUrl : getProductWhatsAppUrl(product.name, siteUrl + '/produk/' + cleanSlug)}
          target="_blank"
          rel="noopener noreferrer"
          className="block pt-2"
        >
          <Button className="w-full btn-primary rounded-full gap-2">
            <ShoppingBag className="w-4 h-4" />
            {productUrl ? "Beli Sekarang" : "Pesan Sekarang"}
          </Button>
        </a>
      </div>
    </div>
  );
};

export default ProductCard;