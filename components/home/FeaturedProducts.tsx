'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import ProductCard from '@/components/shop/ProductCard';
import { getFeaturedProducts } from '@/lib/products-data';

const featuredProducts = getFeaturedProducts();

export default function FeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 320;
      scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="section bg-dark-900/30">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="badge-blue mb-2">⭐ Nổi bật</p>
            <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
            <p className="section-subtitle text-base mt-1">Sản phẩm được khách hàng tin dùng và đánh giá cao nhất</p>
          </motion.div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-xl bg-dark-800 border border-dark-600 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-xl bg-dark-800 border border-dark-600 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Products horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-2"
        >
          {featuredProducts.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex-shrink-0 w-72"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-8">
          <Link href="/products?featured=true" className="btn-secondary gap-2">
            Xem tất cả sản phẩm nổi bật
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
