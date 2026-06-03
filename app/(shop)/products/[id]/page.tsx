'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Heart, BarChart3, Star, ChevronLeft, ChevronRight,
  Check, Truck, Shield, RotateCcw, Zap, MessageSquare, Bot, Loader2,
  Share2, Package, Info
} from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import ProductCard from '@/components/shop/ProductCard';
import { Product } from '@/types';
import { formatPrice, calculateDiscount, getCategoryLabel } from '@/lib/utils';
import { useCartStore, useWishlistStore, useCompareStore } from '@/store';
import { getProductById, getRelatedProducts } from '@/lib/products-data';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'warranty'>('specs');
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const addToCompare = useCompareStore((s) => s.addProduct);
  const { requireAuth } = useAuthGuard();

  useEffect(() => {
    // Load product from mock data
    const p = getProductById(id as string);
    if (p) {
      setProduct(p);
      setRelatedProducts(getRelatedProducts(p, 4));
    }
    setLoading(false);
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (requireAuth('thêm vào giỏ hàng')) {
      addItem(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Package className="w-16 h-16 text-slate-600" />
        <h2 className="text-xl font-bold text-slate-300">Không tìm thấy sản phẩm</h2>
        <Link href="/products" className="btn-primary">Quay lại danh sách</Link>
      </div>
    );
  }

  const discountPercent = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : product.discount;

  const images = product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-dark-900/50 border-b border-dark-800 py-3">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Trang chủ</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-cyan-400 transition-colors">Sản phẩm</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category}`} className="hover:text-cyan-400 transition-colors">
              {getCategoryLabel(product.category)}
            </Link>
            <span>/</span>
            <span className="text-slate-300 truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Images */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative product-image-wrapper rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src={images[selectedImage]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain p-8"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/600x450/1e293b/94a3b8?text=${encodeURIComponent(product.brand)}`;
                }}
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discountPercent && discountPercent > 0 && (
                  <span className="badge bg-red-500 text-white">-{discountPercent}%</span>
                )}
                {product.isNewProduct && <span className="badge bg-emerald-500 text-white">Mới</span>}
                {product.isBestseller && <span className="badge bg-amber-500 text-white">🔥 Bán chạy</span>}
              </div>

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-dark-900/80 border border-dark-600 text-slate-300 flex items-center justify-center hover:text-cyan-400 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-dark-900/80 border border-dark-600 text-slate-300 flex items-center justify-center hover:text-cyan-400 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 product-image-wrapper rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-cyan-500 shadow-glow-sm' : 'border-transparent hover:border-dark-500'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-2" referrerPolicy="no-referrer"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x80/1e293b/94a3b8?text=IMG'; }}
                    />
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Brand + Category */}
            <div className="flex items-center gap-3">
              <span className="badge-cyan">{getCategoryLabel(product.category)}</span>
              <span className="text-slate-400 font-medium">{product.brand}</span>
              {product.stock > 0 ? (
                <span className="badge-green">✓ Còn hàng ({product.stock})</span>
              ) : (
                <span className="badge-red">✗ Hết hàng</span>
              )}
            </div>

            {/* Product name */}
            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-100 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'star-filled fill-current' : 'star-empty'}`}
                  />
                ))}
              </div>
              <span className="text-slate-300 font-medium">{product.rating}</span>
              <span className="text-slate-500">({product.reviewCount} đánh giá)</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-500">Đã bán: {product.sold.toLocaleString()}</span>
            </div>

            {/* Short description */}
            <p className="text-slate-400 leading-relaxed">{product.shortDescription}</p>

            {/* Price */}
            <div className="card p-4 rounded-2xl">
              <div className="flex items-baseline gap-3">
                <span className="font-display font-bold text-3xl md:text-4xl price-tag">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-slate-500 text-lg line-through">{formatPrice(product.originalPrice)}</span>
                )}
                {discountPercent && discountPercent > 0 && (
                  <span className="badge bg-red-500/90 text-white text-sm px-2.5 py-0.5">
                    Tiết kiệm {formatPrice(product.originalPrice! - product.price)}
                  </span>
                )}
              </div>

              {/* Promo reminder */}
              <div className="mt-3 flex items-center gap-2 text-sm text-emerald-400">
                <Zap className="w-4 h-4" />
                <span>Dùng mã <code className="bg-emerald-500/10 px-1.5 rounded text-emerald-300 font-mono">GAMING10</code> giảm thêm 10%</span>
              </div>
            </div>

            {/* Key specs summary */}
            <div className="grid grid-cols-2 gap-3">
              {product.specs.cpu && (
                <div className="card p-3 rounded-xl">
                  <p className="text-xs text-slate-500">CPU</p>
                  <p className="text-sm text-slate-200 font-medium mt-0.5 line-clamp-2">{product.specs.cpu}</p>
                </div>
              )}
              {product.specs.gpu && (
                <div className="card p-3 rounded-xl">
                  <p className="text-xs text-slate-500">GPU</p>
                  <p className="text-sm text-slate-200 font-medium mt-0.5 line-clamp-2">{product.specs.gpu}</p>
                </div>
              )}
              {product.specs.ram && (
                <div className="card p-3 rounded-xl">
                  <p className="text-xs text-slate-500">RAM</p>
                  <p className="text-sm text-slate-200 font-medium mt-0.5">{product.specs.ram}</p>
                </div>
              )}
              {product.specs.storage && (
                <div className="card p-3 rounded-xl">
                  <p className="text-xs text-slate-500">SSD</p>
                  <p className="text-sm text-slate-200 font-medium mt-0.5">{product.specs.storage}</p>
                </div>
              )}
            </div>

            {/* Quantity + Actions */}
            <div className="space-y-3">
              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-400">Số lượng:</span>
                <div className="flex items-center border border-dark-600 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-dark-700 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-slate-200 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-dark-700 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Main buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 btn-primary gap-2 py-4 text-base ${addedToCart ? 'from-emerald-500 to-green-600' : ''}`}
                >
                  {addedToCart ? (
                    <><Check className="w-5 h-5" /> Đã thêm vào giỏ!</>
                  ) : (
                    <><ShoppingCart className="w-5 h-5" /> Thêm vào giỏ hàng</>
                  )}
                </button>
                <button
                  onClick={() => {
                    if (requireAuth('thêm vào danh sách yêu thích')) {
                      toggle(product._id);
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all ${
                    isWishlisted(product._id)
                      ? 'bg-red-500/20 border-red-500/30 text-red-400'
                      : 'bg-dark-800 border-dark-600 text-slate-400 hover:border-red-500/50 hover:text-red-400'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted(product._id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => addToCompare(product)}
                  className="p-4 rounded-xl border border-dark-600 bg-dark-800 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
                  title="So sánh"
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
              </div>

              {/* Buy now */}
              <button
                onClick={() => {
                  if (requireAuth('mua hàng')) {
                    addItem(product, quantity);
                    router.push('/checkout');
                  }
                }}
                className="btn-outline w-full text-center py-4"
              >
                Mua Ngay →
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Truck className="w-4 h-4" />, label: 'Freeship từ 5tr', color: 'text-cyan-400' },
                { icon: <Shield className="w-4 h-4" />, label: 'BH 24 tháng', color: 'text-emerald-400' },
                { icon: <RotateCcw className="w-4 h-4" />, label: 'Đổi trả 30 ngày', color: 'text-blue-400' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1 p-3 card rounded-xl text-center">
                  <div className={item.color}>{item.icon}</div>
                  <p className="text-xs text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Specs, Reviews, Warranty */}
        <div className="mt-12">
          <div className="flex items-center border-b border-dark-700 mb-6">
            {[
              { id: 'specs', label: '📋 Thông số kỹ thuật' },
              { id: 'reviews', label: '⭐ Đánh giá' },
              { id: 'warranty', label: '🛡️ Bảo hành' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'specs' | 'reviews' | 'warranty')}
                className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'specs' && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Description */}
                <div className="md:col-span-2 card p-5 rounded-2xl">
                  <h3 className="font-semibold text-slate-200 mb-3">Mô tả sản phẩm</h3>
                  <p className="text-slate-400 leading-relaxed">{product.description}</p>
                </div>

                {/* Specs table */}
                <div className="md:col-span-2 card rounded-2xl overflow-hidden">
                  <table className="data-table w-full">
                    <tbody>
                      {Object.entries(product.specs).map(([key, value]) => {
                        if (!value || (Array.isArray(value) && value.length === 0)) return null;
                        const labels: Record<string, string> = {
                          cpu: '🔧 CPU', gpu: '🎮 GPU', ram: '💾 RAM', storage: '💿 SSD/HDD',
                          display: '🖥️ Màn hình', battery: '🔋 Pin', os: '💻 Hệ điều hành',
                          weight: '⚖️ Trọng lượng', ports: '🔌 Cổng kết nối',
                          refreshRate: '📺 Tần số quét', resolution: '📐 Độ phân giải',
                          panelType: '🖥️ Loại tấm nền', responseTime: '⚡ Thời gian phản hồi',
                          dpi: '🖱️ DPI', wireless: '📡 Không dây',
                          switchType: '⌨️ Loại switch', backlight: '💡 Đèn nền',
                          microphone: '🎤 Micro', vram: '💾 VRAM', tdp: '⚡ TDP',
                        };
                        return (
                          <tr key={key}>
                            <td className="font-medium text-slate-300 w-1/3">{labels[key] || key}</td>
                            <td className="text-slate-400">
                              {Array.isArray(value) ? value.join(', ') :
                               typeof value === 'boolean' ? (value ? 'Có' : 'Không') :
                               String(value)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="card p-8 rounded-2xl text-center">
                  <div className="font-display text-6xl font-bold gradient-text mb-2">{product.rating}</div>
                  <div className="flex justify-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-6 h-6 ${i < Math.floor(product.rating) ? 'star-filled fill-current' : 'star-empty'}`} />
                    ))}
                  </div>
                  <p className="text-slate-400">{product.reviewCount} đánh giá</p>

                  <div className="mt-6 space-y-3 max-w-md mx-auto text-left">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-sm text-slate-400 w-8">{star}★</span>
                        <div className="flex-1 bg-dark-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-amber-400 to-yellow-500 h-2 rounded-full"
                            style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 w-8">{star === 5 ? '70%' : star === 4 ? '20%' : star === 3 ? '7%' : star === 2 ? '2%' : '1%'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'warranty' && (
              <motion.div
                key="warranty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="card p-6 rounded-2xl space-y-4"
              >
                {[
                  { icon: '🛡️', title: 'Bảo hành chính hãng 24 tháng', desc: 'Bảo hành tại trung tâm hãng trên toàn quốc' },
                  { icon: '🔄', title: 'Đổi trả 30 ngày', desc: 'Đổi sản phẩm mới nếu lỗi phần cứng trong 30 ngày' },
                  { icon: '⚡', title: 'Hỗ trợ kỹ thuật 24/7', desc: 'Đội ngũ kỹ thuật hỗ trợ qua hotline, chat, email' },
                  { icon: '🏠', title: 'Sửa chữa tại nhà', desc: 'Miễn phí thu hồi và trả sản phẩm tại TP.HCM & Hà Nội' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-slate-200">{item.title}</h4>
                      <p className="text-sm text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="section-title mb-6">Sản Phẩm Tương Tự</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
