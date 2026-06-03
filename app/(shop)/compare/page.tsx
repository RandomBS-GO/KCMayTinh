'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, Trash2, Check, Minus, ArrowLeft } from 'lucide-react';
import { useCompareStore, useCartStore } from '@/store';
import { formatPrice, getCategoryLabel } from '@/lib/utils';
import { Product } from '@/types';
import toast from 'react-hot-toast';

export default function ComparePage() {
  const { products: compareItems, removeProduct, clearProducts: clearCompare } = useCompareStore();
  const addItem = useCartStore((s) => s.addItem);

  if (compareItems.length === 0) {
    return (
      <div className="container-custom py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">⚖️</div>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Chưa có sản phẩm so sánh</h2>
        <p className="text-slate-400 mb-8 max-w-md">
          Thêm ít nhất 2 sản phẩm vào danh sách so sánh để xem sự khác biệt chi tiết về cấu hình và mức giá.
        </p>
        <Link href="/products" className="btn-primary">
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  // Thu thập tất cả các keys specs từ các sản phẩm đang so sánh
  const allSpecsKeys = new Set<string>();
  compareItems.forEach((p) => {
    Object.keys(p.specs).forEach((k) => allSpecsKeys.add(k));
  });
  
  const specsList = Array.from(allSpecsKeys);
  const specLabels: Record<string, string> = {
    cpu: 'CPU', gpu: 'Card Đồ Họa', ram: 'RAM', storage: 'Ổ cứng',
    display: 'Màn hình', battery: 'Pin', os: 'Hệ điều hành',
    weight: 'Trọng lượng', ports: 'Cổng kết nối',
    refreshRate: 'Tần số quét', resolution: 'Độ phân giải',
    panelType: 'Loại tấm nền', responseTime: 'Thời gian phản hồi',
    dpi: 'DPI', wireless: 'Không dây', switchType: 'Loại Switch'
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    toast.success(`Đã thêm ${product.name} vào giỏ!`);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 mb-2">
              <ArrowLeft className="w-4 h-4" /> Quay lại cửa hàng
            </Link>
            <h1 className="section-title">So Sánh Cấu Hình</h1>
            <p className="text-slate-400 mt-2">So sánh chi tiết {compareItems.length} sản phẩm</p>
          </div>
          <button 
            onClick={clearCompare}
            className="btn-ghost text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            Xóa tất cả
          </button>
        </div>

        <div className="card rounded-2xl overflow-x-auto">
          <table className="compare-table w-full min-w-[800px]">
            <thead>
              <tr>
                <th className="w-48 text-left bg-dark-900 sticky left-0 z-10 border-r border-dark-700">Thông số</th>
                {compareItems.map((product) => (
                  <th key={product._id} className="min-w-[250px] w-[300px] relative">
                    <button
                      onClick={() => removeProduct(product._id)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                      title="Xóa khỏi so sánh"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex flex-col items-center pt-2">
                      <div className="w-32 h-32 product-image-wrapper rounded-xl mb-4">
                        <img 
                          src={product.thumbnail} 
                          alt={product.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <span className="badge-cyan mb-2">{getCategoryLabel(product.category)}</span>
                      <h3 className="text-base font-medium text-slate-200 line-clamp-2 px-4 h-12 leading-tight">
                        {product.name}
                      </h3>
                      <div className="mt-3">
                        <span className="price-tag text-xl block mb-1">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-slate-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="btn-primary btn-sm w-[80%] mt-4 gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" /> Chọn Mua
                      </button>
                    </div>
                  </th>
                ))}
                {/* Empty placeholders up to 3 */}
                {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                  <th key={`empty-${i}`} className="min-w-[250px] w-[300px]">
                    <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-dark-600 rounded-xl m-4 opacity-50 p-6">
                      <div className="text-4xl mb-2 text-slate-600">+</div>
                      <p className="text-sm text-slate-400 font-normal">Thêm sản phẩm để so sánh</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Brand & Rating row */}
              <tr>
                <td className="font-semibold text-slate-300 text-left bg-dark-900 sticky left-0 z-10 border-r border-dark-700">Thương hiệu</td>
                {compareItems.map(p => (
                  <td key={p._id} className="font-medium text-slate-200">{p.brand}</td>
                ))}
                {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                  <td key={`empty-brand-${i}`}>-</td>
                ))}
              </tr>
              <tr>
                <td className="font-semibold text-slate-300 text-left bg-dark-900 sticky left-0 z-10 border-r border-dark-700">Đánh giá</td>
                {compareItems.map(p => (
                  <td key={p._id}>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-amber-400 font-bold">{p.rating}</span>
                      <span className="text-amber-400">★</span>
                      <span className="text-xs text-slate-500">({p.reviewCount})</span>
                    </div>
                  </td>
                ))}
                {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                  <td key={`empty-rating-${i}`}>-</td>
                ))}
              </tr>

              {/* Dynamic Specs */}
              {specsList.map(specKey => (
                <tr key={specKey}>
                  <td className="font-semibold text-slate-300 text-left bg-dark-900 sticky left-0 z-10 border-r border-dark-700">
                    {specLabels[specKey] || specKey}
                  </td>
                  {compareItems.map(p => {
                    const value = p.specs[specKey as keyof typeof p.specs];
                    return (
                      <td key={`${p._id}-${specKey}`}>
                        {value ? (
                          Array.isArray(value) ? (
                            <ul className="text-sm text-slate-400 text-left list-disc list-inside">
                              {value.map((v, i) => <li key={i}>{v}</li>)}
                            </ul>
                          ) : typeof value === 'boolean' ? (
                            value ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <Minus className="w-5 h-5 text-slate-600 mx-auto" />
                          ) : (
                            <span className="text-sm text-slate-300">{String(value)}</span>
                          )
                        ) : (
                          <Minus className="w-5 h-5 text-slate-600 mx-auto" />
                        )}
                      </td>
                    );
                  })}
                  {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                    <td key={`empty-spec-${specKey}-${i}`}>-</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
