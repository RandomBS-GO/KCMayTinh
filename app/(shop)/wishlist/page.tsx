'use client';

import { useWishlistStore } from '@/store';
import { getProductById } from '@/lib/products-data';
import Link from 'next/link';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();
  
  // Since we only store product IDs in the wishlist, we need to map them back to full product objects
  const wishlistedProducts = items
    .map(id => getProductById(id))
    .filter(p => p !== undefined);

  if (wishlistedProducts.length === 0) {
    return (
      <div className="container-custom py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-slate-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Danh sách yêu thích trống</h2>
        <p className="text-slate-400 mb-8 max-w-md">
          Lưu lại các sản phẩm bạn quan tâm để dễ dàng xem lại và mua sắm sau.
        </p>
        <Link href="/products" className="btn-primary">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 mb-2">
              <ArrowLeft className="w-4 h-4" /> Cửa hàng
            </Link>
            <h1 className="section-title flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" /> Sản phẩm yêu thích
            </h1>
            <p className="text-slate-400 mt-2">
              Bạn đang có {wishlistedProducts.length} sản phẩm trong danh sách
            </p>
          </div>
          
          <button 
            onClick={clearWishlist}
            className="btn-ghost text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2"
          >
            <Trash2 className="w-4 h-4" /> Xóa tất cả
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map(product => (
            <ProductCard key={product!._id} product={product!} />
          ))}
        </div>
      </div>
    </div>
  );
}
