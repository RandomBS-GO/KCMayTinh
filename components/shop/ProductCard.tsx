'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Zap, Star, BarChart3, Eye } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice, calculateDiscount, getCategoryLabel } from '@/lib/utils';
import { useCartStore, useWishlistStore, useCompareStore } from '@/store';
import { cn } from '@/lib/utils';
import { useAuthGuard } from '@/hooks/useAuthGuard';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export default function ProductCard({ product, variant = 'default', className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const addToCompare = useCompareStore((s) => s.addProduct);
  const { requireAuth } = useAuthGuard();

  const wishlisted = isWishlisted(product._id);
  const discountPercent = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : product.discount;

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className={cn('product-card p-3', className)}
      >
        <Link href={`/products/${product._id}`} className="flex gap-3">
          <div className="w-16 h-16 product-image-wrapper rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/1e293b/94a3b8?text=IMG';
              }}
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-200 line-clamp-2 leading-snug">{product.name}</p>
            <p className="text-sm font-bold price-tag mt-1">{formatPrice(product.price)}</p>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn('product-card group relative', className)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {discountPercent && discountPercent > 0 && (
          <span className="badge bg-red-500 text-white text-[10px] px-2 py-0.5">
            -{discountPercent}%
          </span>
        )}
        {product.isNewProduct && (
          <span className="badge bg-emerald-500/80 text-white text-[10px] px-2 py-0.5">
            Mới
          </span>
        )}
        {product.isBestseller && (
          <span className="badge bg-amber-500/80 text-white text-[10px] px-2 py-0.5">
            Bán chạy
          </span>
        )}
      </div>

      {/* Wishlist button */}
      <button
        onClick={(e) => { 
          e.preventDefault(); 
          if (requireAuth('thêm vào danh sách yêu thích')) {
            toggle(product._id);
          }
        }}
        className={cn(
          'absolute top-3 right-3 z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all',
          wishlisted
            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
            : 'bg-dark-900/80 text-slate-500 border border-dark-600 opacity-0 group-hover:opacity-100'
        )}
      >
        <Heart className={cn('w-4 h-4', wishlisted && 'fill-current')} />
      </button>

      {/* Image */}
      <Link href={`/products/${product._id}`}>
        <div className="product-image-wrapper aspect-[4/3] overflow-hidden rounded-t-2xl">
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-contain p-4 product-card-image transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/400x300/1e293b/94a3b8?text=${encodeURIComponent(product.brand)}`;
            }}
          />
        </div>
      </Link>

      {/* Quick actions (show on hover) */}
      <div className="absolute bottom-[140px] left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
        <button
          onClick={() => addToCompare(product)}
          title="So sánh"
          className="w-9 h-9 rounded-lg bg-dark-900/90 border border-dark-600 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 flex items-center justify-center transition-all backdrop-blur-sm"
        >
          <BarChart3 className="w-4 h-4" />
        </button>
        <Link
          href={`/products/${product._id}`}
          title="Xem nhanh"
          className="w-9 h-9 rounded-lg bg-dark-900/90 border border-dark-600 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 flex items-center justify-center transition-all backdrop-blur-sm"
        >
          <Eye className="w-4 h-4" />
        </Link>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Category + Brand */}
        <div className="flex items-center justify-between mb-2">
          <span className="badge-cyan text-[10px]">{getCategoryLabel(product.category)}</span>
          <span className="text-xs text-slate-500">{product.brand}</span>
        </div>

        {/* Name */}
        <Link href={`/products/${product._id}`}>
          <h3 className="font-medium text-slate-200 text-sm leading-snug line-clamp-2 hover:text-cyan-400 transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Specs summary */}
        {(product.specs.cpu || product.specs.gpu) && (
          <div className="text-[11px] text-slate-500 mb-3 space-y-0.5">
            {product.specs.cpu && (
              <p className="line-clamp-1">🔧 {product.specs.cpu}</p>
            )}
            {product.specs.gpu && (
              <p className="line-clamp-1">🎮 {product.specs.gpu}</p>
            )}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-3 h-3',
                  i < Math.floor(product.rating)
                    ? 'star-filled fill-current'
                    : 'star-empty'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400">{product.rating}</span>
          <span className="text-xs text-slate-600">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold price-tag">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-slate-500 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-[11px] text-orange-400 mt-0.5">⚠️ Chỉ còn {product.stock} sản phẩm</p>
          )}
          {product.stock === 0 && (
            <p className="text-[11px] text-red-400 mt-0.5">❌ Hết hàng</p>
          )}
        </div>

        {/* Add to cart button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            if (requireAuth('thêm vào giỏ hàng')) {
              addItem(product);
            }
          }}
          disabled={product.stock === 0}
          className="w-full btn-primary btn-sm gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
        </button>
      </div>
    </motion.div>
  );
}
