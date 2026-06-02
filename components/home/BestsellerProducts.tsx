'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import { getBestsellerProducts } from '@/lib/products-data';

const bestsellers = getBestsellerProducts();

export default function BestsellerProducts() {
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
            <p className="badge-orange mb-2">🔥 Bán chạy</p>
            <h2 className="section-title">Bán Chạy Nhất</h2>
            <p className="section-subtitle text-base mt-1">Được khách hàng tin dùng và đánh giá cao nhất</p>
          </motion.div>

          <Link href="/products?bestseller=true" className="hidden md:flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {bestsellers.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-8 md:hidden">
          <Link href="/products?bestseller=true" className="btn-secondary gap-2">
            Xem tất cả bán chạy
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
