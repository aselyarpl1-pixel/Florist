import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product as ApiProduct } from "@/lib/api";
import { Product as DataProduct } from "@/data/products";
import { getProductWhatsAppUrl } from "@/config/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import { getProductImageUrl } from "@/lib/imageUtils";

interface ProductCardProps {
  product: ApiProduct | DataProduct;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const ProductCard = ({ product }: ProductCardProps) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  
  // Handle both API and data product types
  const rawImages = 'images' in product && product.images ? product.images : ('image_url' in product && product.image_url ? [product.image_url] : []);
  
  const imageUrl = getProductImageUrl(rawImages[0]);
  const shortDescription = 'shortDescription' in product ? product.shortDescription : product.description?.substring(0, 100);
  
  // Robust check for prices
  const originalPrice = 'originalPrice' in product ? product.originalPrice : ('original_price' in product ? product.original_price : undefined);
  
  // Robust check for tags (handle both camelCase from local data and snake_case from API)
  // We use type assertion to handle inconsistent property names across different data sources
  const p = product as { 
    bestSeller?: boolean; 
    is_best_seller?: boolean; 
    best_seller?: boolean;
    exclusive?: boolean;
    is_exclusive?: boolean;
    premium?: boolean;
    is_premium?: boolean;
  };
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

  const discountPercentage = (originalPrice || 0) > 0 
    ? Math.round(((originalPrice! - product.price) / originalPrice!) * 100) 
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
      <div className="p-5 space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {product.category.replace("-", " ")}
        </p>
        <Link to={`/produk/${cleanSlug}`}>
          <h3 className="font-heading text-lg font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        {shortDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {shortDescription}
          </p>
        )}
        
        {/* Price */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-heading text-xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {(originalPrice || 0) > 0 && (
              <span className="text-sm text-muted-foreground line-through decoration-red-500/50">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          {(originalPrice || 0) > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                -{discountPercentage}%
              </span>
              <span className="text-xs font-medium text-red-600">
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