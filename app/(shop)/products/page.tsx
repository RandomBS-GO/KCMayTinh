'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, Grid3X3, List, X, ChevronDown,
  Loader2, Package
} from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import { Product, ProductCategory, ProductUseCase } from '@/types';
import { formatPrice, getCategoryLabel, getUseCaseLabel } from '@/lib/utils';
import { ALL_PRODUCTS } from '@/lib/products-data';

const CATEGORIES: { value: string; label: string; icon: string }[] = [
  { value: 'all', label: 'Tất cả', icon: '📦' },
  { value: 'laptop', label: 'Laptop', icon: '💻' },
  { value: 'pc-gaming', label: 'PC Gaming', icon: '🖥️' },
  { value: 'monitor', label: 'Màn hình', icon: '🖥️' },
  { value: 'mouse', label: 'Chuột', icon: '🖱️' },
  { value: 'keyboard', label: 'Bàn phím', icon: '⌨️' },
  { value: 'headset', label: 'Tai nghe', icon: '🎧' },
  { value: 'component', label: 'Linh kiện', icon: '⚙️' },
];

const USE_CASES: { value: ProductUseCase; label: string; icon: string }[] = [
  { value: 'gaming', label: 'Gaming', icon: '🎮' },
  { value: 'office', label: 'Văn phòng', icon: '💼' },
  { value: 'graphic', label: 'Đồ họa', icon: '🎨' },
  { value: 'ai', label: 'AI/ML', icon: '🤖' },
  { value: 'student', label: 'Sinh viên', icon: '📚' },
];

const BRANDS = ['ASUS', 'Acer', 'Lenovo', 'Dell', 'HP', 'MSI', 'Apple', 'LG', 'Samsung', 'Logitech', 'Razer', 'SteelSeries', 'HyperX', 'Corsair', 'NVIDIA', 'Intel', 'Gigabyte'];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Nổi bật' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'rating', label: 'Đánh giá cao' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'bestseller', label: 'Bán chạy' },
];

const PRICE_RANGES = [
  { label: 'Dưới 10 triệu', min: 0, max: 10_000_000 },
  { label: '10 - 20 triệu', min: 10_000_000, max: 20_000_000 },
  { label: '20 - 35 triệu', min: 20_000_000, max: 35_000_000 },
  { label: '35 - 50 triệu', min: 35_000_000, max: 50_000_000 },
  { label: 'Trên 50 triệu', min: 50_000_000, max: 999_000_000 },
];

import { Suspense } from 'react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter states
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'featured');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedUseCases, setSelectedUseCases] = useState<ProductUseCase[]>(
    searchParams.get('useCase') ? [searchParams.get('useCase') as ProductUseCase] : []
  );
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const LIMIT = 12;

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filter products from mock data
  const filterProducts = useCallback(() => {
    setIsLoading(true);

    let filtered = [...ALL_PRODUCTS];

    // Category
    if (category !== 'all') {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)) ||
        p.shortDescription.toLowerCase().includes(q)
      );
    }

    // Brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
    }

    // Use cases
    if (selectedUseCases.length > 0) {
      filtered = filtered.filter((p) =>
        p.useCases.some((uc) => selectedUseCases.includes(uc as ProductUseCase))
      );
    }

    // Price range
    if (priceRange) {
      filtered = filtered.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      case 'newest': filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'bestseller': filtered.sort((a, b) => b.sold - a.sold); break;
      default: filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setTotal(filtered.length);
    setProducts(filtered.slice((page - 1) * LIMIT, page * LIMIT));
    setIsLoading(false);
  }, [category, search, selectedBrands, selectedUseCases, priceRange, sortBy, page]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setPage(1);
  };

  const toggleUseCase = (uc: ProductUseCase) => {
    setSelectedUseCases((prev) =>
      prev.includes(uc) ? prev.filter((u) => u !== uc) : [...prev, uc]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setCategory('all');
    setSearch('');
    setSelectedBrands([]);
    setSelectedUseCases([]);
    setPriceRange(null);
    setSortBy('featured');
    setPage(1);
  };

  const hasActiveFilters = category !== 'all' || selectedBrands.length > 0 || selectedUseCases.length > 0 || priceRange;
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="bg-dark-900/50 border-b border-dark-800 py-8">
        <div className="container-custom">
          <h1 className="section-title">
            {category === 'all' ? 'Tất Cả Sản Phẩm' : getCategoryLabel(category)}
          </h1>
          <p className="text-slate-400 mt-1">
            {search ? `Kết quả tìm kiếm cho "${search}"` : `${total} sản phẩm${category !== 'all' ? ` trong ${getCategoryLabel(category)}` : ''}`}
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters (desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-6">
              {/* Category */}
              <div>
                <h3 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  📦 Danh mục
                </h3>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => { setCategory(cat.value); setPage(1); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
                        category === cat.value
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'text-slate-400 hover:bg-dark-700 hover:text-slate-200'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Use Case */}
              <div>
                <h3 className="font-semibold text-slate-200 mb-3">🎯 Nhu cầu</h3>
                <div className="space-y-1">
                  {USE_CASES.map((uc) => (
                    <label key={uc.value} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm cursor-pointer hover:bg-dark-700 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedUseCases.includes(uc.value)}
                        onChange={() => toggleUseCase(uc.value)}
                        className="w-4 h-4 rounded border-dark-500 accent-cyan-500"
                      />
                      <span>{uc.icon}</span>
                      <span className="text-slate-300">{uc.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-slate-200 mb-3">💰 Tầm giá</h3>
                <div className="space-y-1">
                  {PRICE_RANGES.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => {
                        setPriceRange(
                          priceRange?.min === range.min ? null : { min: range.min, max: range.max }
                        );
                        setPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                        priceRange?.min === range.min
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'text-slate-400 hover:bg-dark-700'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h3 className="font-semibold text-slate-200 mb-3">🏷️ Thương hiệu</h3>
                <div className="flex flex-wrap gap-1.5">
                  {BRANDS.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => toggleBrand(brand)}
                      className={`px-2.5 py-1 rounded-lg text-xs border transition-all ${
                        selectedBrands.includes(brand)
                          ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                          : 'border-dark-600 text-slate-400 hover:border-dark-500'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <button onClick={clearFilters} className="w-full btn-outline btn-sm gap-2">
                  <X className="w-4 h-4" />
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Tìm sản phẩm..."
                  className="w-full pl-9 pr-4 py-2.5 input text-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Mobile filter button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden btn-secondary btn-sm gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Bộ lọc
                {hasActiveFilters && <span className="w-5 h-5 bg-cyan-500 text-white rounded-full text-xs flex items-center justify-center">!</span>}
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="appearance-none px-4 py-2.5 pr-8 bg-dark-800 border border-dark-600 text-slate-200 rounded-xl text-sm outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              {/* View toggle */}
              <div className="flex items-center border border-dark-600 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-dark-700 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-dark-700 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-slate-500 ml-auto hidden md:block">
                {total} sản phẩm
              </p>
            </div>

            {/* Active filters chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {category !== 'all' && (
                  <span className="badge-cyan gap-1">
                    {getCategoryLabel(category)}
                    <button onClick={() => setCategory('all')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedUseCases.map((uc) => (
                  <span key={uc} className="badge-blue gap-1">
                    {getUseCaseLabel(uc)}
                    <button onClick={() => toggleUseCase(uc)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
                {priceRange && (
                  <span className="badge-green gap-1">
                    {PRICE_RANGES.find(r => r.min === priceRange.min)?.label}
                    <button onClick={() => setPriceRange(null)}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedBrands.map((brand) => (
                  <span key={brand} className="badge-purple gap-1">
                    {brand}
                    <button onClick={() => toggleBrand(brand)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}

            {/* Products */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="font-semibold text-slate-300">Không tìm thấy sản phẩm</p>
                <p className="text-sm text-slate-500 mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                <button onClick={clearFilters} className="btn-primary btn-sm mt-4">
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                  : 'space-y-4'
              }>
                <AnimatePresence mode="popLayout">
                  {products.map((product, i) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (() => {
              // Build smart page list: always show 1, last, and 2 pages around current
              const pages: (number | 'ellipsis')[] = [];
              for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= page - 2 && i <= page + 2)) {
                  pages.push(i);
                } else if (pages[pages.length - 1] !== 'ellipsis') {
                  pages.push('ellipsis');
                }
              }
              return (
                <div className="flex items-center justify-center flex-wrap gap-2 mt-10">
                  <button
                    onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={page === 1}
                    className="btn-secondary btn-sm disabled:opacity-40"
                  >
                    ← Trước
                  </button>

                  {pages.map((p, idx) =>
                    p === 'ellipsis' ? (
                      <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-slate-500">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => { setPage(p as number); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                          page === p
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow'
                            : 'bg-dark-800 border border-dark-600 text-slate-400 hover:border-cyan-500/50 hover:text-slate-200'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={page === totalPages}
                    className="btn-secondary btn-sm disabled:opacity-40"
                  >
                    Sau →
                  </button>
                  <span className="text-xs text-slate-500 ml-2">Trang {page}/{totalPages} · {total} sản phẩm</span>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Mobile filters modal */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/70 z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-dark-900 border-r border-dark-700 z-50 overflow-y-auto lg:hidden"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-100">Bộ lọc sản phẩm</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-200 mb-3">Danh mục</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => { setCategory(cat.value); setPage(1); setShowFilters(false); }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all border ${
                          category === cat.value
                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                            : 'border-dark-600 text-slate-400'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span className="truncate">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-200 mb-3">Tầm giá</h4>
                  <div className="space-y-2">
                    {PRICE_RANGES.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => { setPriceRange(priceRange?.min === range.min ? null : range); setPage(1); }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm border transition-all ${
                          priceRange?.min === range.min
                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                            : 'border-dark-600 text-slate-400'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={clearFilters} className="w-full btn-outline">
                  Xóa tất cả bộ lọc
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div></div>}>
      <ProductsContent />
    </Suspense>
  );
}
