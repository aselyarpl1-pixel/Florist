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
  
  // Handle both API and data product types
  let rawImages: string[] = [];
  
  if ('images' in product && Array.isArray(product.images) && product.images.length > 0) {
    rawImages = product.images;
  } else if ('image_url' in product && product.image_url) {
    rawImages = [product.image_url];
  } else if ('images' in product && typeof product.images === 'string') {
    // Handle case where images might be a single string instead of array
    rawImages = [product.images as string];
  }
  
  const imageUrl = getProductImageUrl(rawImages[0]);
  const shortDescription = 'shortDescription' in product ? product.shortDescription : product.description?.substring(0, 100);
  
  // Robust check for prices
  const originalPrice: number | undefined = 'originalPrice' in product ? product.originalPrice : ('original_price' in product ? Number(product.original_price) : undefined);
  
  // Robust check for tags (handle both camelCase from local data and snake_case from API)
  // We use type assertion to handle inconsistent property names across different data sources
  const p = product as any;
  const isBestSeller = p.bestSeller || p.is_best_seller || p.best_seller || false;
  const isExclusive = p.exclusive || p.is_exclusive || false;
  const isPremium = p.premium || p.is_premium || false;

  const productUrl = 'productUrl' in product ? product.productUrl : ('product_url' in product ? product.product_url : '');
  
  // Helper to clean slug if it contains a full URL (handling legacy data issues)
  const getCleanSlug = (slug: string) => {
    // Handle full URLs or paths by taking the last segment
    if (slug.includes('/') || slug.startsWith('http')) {
      return slug.split('/').filter(Boolean).pop() || slug;
    }
    return slug;
  };

  const cleanSlug = getCleanSlug(product.slug);

  const discountPercentage = (originalPrice || 0) > 0 && originalPrice
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100) 
    : 0;

  return (
    <div className="group card-premium">
      {/* Image Container */}
      <Link to={`/produk/${cleanSlug}`} className="block relative overflow-hidden">
        <div className="aspect-[4/5] bg-muted">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        {/* Badges */}
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

      {/* Content */}
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
        
        {/* Price */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-heading text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {originalPrice && originalPrice > 0 && (
              <span className="text-xs text-muted-foreground line-through decoration-red-500/50">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          {originalPrice && originalPrice > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold bg-red-100 text-red-600 px-1 py-0.5 rounded">
                -{discountPercentage}%
              </span>
              <span className="text-[10px] font-medium text-red-600">
                Hemat {formatPrice(originalPrice - product.price)}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
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