'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCompareStore } from '@/store';
import { formatPrice } from '@/lib/utils';

export default function CompareBar() {
  const products = useCompareStore((s) => s.products);
  const isOpen = useCompareStore((s) => s.isOpen);
  const removeProduct = useCompareStore((s) => s.removeProduct);
  const clearProducts = useCompareStore((s) => s.clearProducts);

  if (products.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-dark-900/95 backdrop-blur-xl border-t border-cyan-500/30 shadow-2xl"
        >
          <div className="container-custom py-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <span className="font-medium text-slate-200 text-sm">So sánh ({products.length}/3)</span>
              </div>

              <div className="flex-1 flex items-center gap-3 overflow-x-auto scrollbar-hide">
                {products.map((product) => (
                  <div key={product._id} className="flex items-center gap-2 p-2 card rounded-xl flex-shrink-0 min-w-0 max-w-[200px]">
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-contain flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/40x40/1e293b/94a3b8?text=IMG';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-200 line-clamp-1">{product.name}</p>
                      <p className="text-xs font-bold price-tag">{formatPrice(product.price)}</p>
                    </div>
                    <button
                      onClick={() => removeProduct(product._id)}
                      className="text-slate-500 hover:text-red-400 flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Empty slots */}
                {Array.from({ length: 3 - products.length }).map((_, i) => (
                  <div key={i} className="w-[200px] h-[56px] card rounded-xl border-dashed border-dark-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-slate-600">+ Thêm sản phẩm</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {products.length >= 2 && (
                  <Link
                    href={`/compare?ids=${products.map((p) => p._id).join(',')}`}
                    className="btn-primary btn-sm gap-1.5"
                  >
                    So sánh
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                <button onClick={clearProducts} className="btn-ghost btn-sm">
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
