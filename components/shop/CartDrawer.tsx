'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());
  const { requireAuth } = useAuthGuard();
  const router = useRouter();

  const shippingFee = totalPrice >= 5_000_000 ? 0 : 50_000;
  const finalTotal = totalPrice + shippingFee;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col bg-dark-900 border-l border-dark-700 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-dark-700">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-cyan-400" />
                <h2 className="font-display font-bold text-lg text-slate-100">
                  Giỏ hàng
                </h2>
                {totalItems > 0 && (
                  <span className="badge-cyan text-xs">{totalItems} sản phẩm</span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-slate-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-dark-800 flex items-center justify-center text-4xl">
                    🛒
                  </div>
                  <div>
                    <p className="font-semibold text-slate-300">Giỏ hàng trống</p>
                    <p className="text-sm text-slate-500 mt-1">Thêm sản phẩm để bắt đầu mua sắm</p>
                  </div>
                  <Link href="/products" onClick={closeCart} className="btn-primary btn-sm">
                    Khám phá sản phẩm
                  </Link>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {items.map((item) => (
                    <motion.div
                      key={item.product._id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 p-3 card rounded-xl"
                    >
                      {/* Product image */}
                      <div className="w-20 h-20 flex-shrink-0 product-image-wrapper rounded-lg overflow-hidden">
                        <img
                          src={item.product.thumbnail}
                          alt={item.product.name}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/80x80/1e293b/94a3b8?text=IMG';
                          }}
                        />
                      </div>

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product._id}`}
                          onClick={closeCart}
                          className="text-sm font-medium text-slate-200 hover:text-cyan-400 transition-colors line-clamp-2 leading-snug"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-slate-500 mt-0.5">{item.product.brand}</p>

                        <div className="flex items-center justify-between mt-2">
                          {/* Price */}
                          <span className="text-sm font-bold price-tag">
                            {formatPrice(item.product.price)}
                          </span>

                          {/* Quantity controls */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                              className="w-6 h-6 rounded-lg bg-dark-700 hover:bg-dark-600 text-slate-300 flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-slate-200">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="w-6 h-6 rounded-lg bg-dark-700 hover:bg-dark-600 text-slate-300 flex items-center justify-center transition-colors disabled:opacity-40"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors self-start flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer / checkout */}
            {items.length > 0 && (
              <div className="border-t border-dark-700 p-5 space-y-4">
                {/* Promo code */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Mã giảm giá (GAMING10)"
                      className="w-full pl-9 pr-3 py-2.5 input text-sm"
                    />
                  </div>
                  <button className="btn-outline btn-sm whitespace-nowrap">
                    Áp dụng
                  </button>
                </div>

                {/* Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Tạm tính ({totalItems} sản phẩm)</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Phí vận chuyển</span>
                    <span className={shippingFee === 0 ? 'text-emerald-400 font-medium' : ''}>
                      {shippingFee === 0 ? 'Miễn phí 🎉' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  {shippingFee > 0 && (
                    <p className="text-xs text-slate-500">
                      Mua thêm {formatPrice(5_000_000 - totalPrice)} để miễn phí vận chuyển
                    </p>
                  )}
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-dark-700">
                    <span className="text-slate-200">Tổng cộng</span>
                    <span className="price-tag text-lg">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Checkout button */}
                <button
                  onClick={() => {
                    if (requireAuth('thanh toán đơn hàng')) {
                      closeCart();
                      router.push('/checkout');
                    }
                  }}
                  className="btn-primary w-full text-center"
                >
                  Thanh toán ngay →
                </button>

                <Link
                  href="/products"
                  onClick={closeCart}
                  className="btn-ghost w-full text-center text-sm"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
