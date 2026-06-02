'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    value: 'laptop',
    label: 'Laptop',
    icon: '💻',
    count: '60+ sản phẩm',
    gradient: 'from-blue-600/20 to-cyan-600/20',
    border: 'hover:border-cyan-500/40',
    description: 'Gaming, Văn phòng, Đồ họa',
  },
  {
    value: 'pc-gaming',
    label: 'PC Gaming',
    icon: '🖥️',
    count: '35+ sản phẩm',
    gradient: 'from-purple-600/20 to-blue-600/20',
    border: 'hover:border-purple-500/40',
    description: 'Desktop, Workstation',
  },
  {
    value: 'monitor',
    label: 'Màn hình',
    icon: '🖥️',
    count: '15+ sản phẩm',
    gradient: 'from-green-600/20 to-teal-600/20',
    border: 'hover:border-emerald-500/40',
    description: '4K, OLED, 240Hz',
  },
  {
    value: 'mouse',
    label: 'Chuột',
    icon: '🖱️',
    count: '10+ sản phẩm',
    gradient: 'from-orange-600/20 to-red-600/20',
    border: 'hover:border-orange-500/40',
    description: 'Gaming, Văn phòng',
  },
  {
    value: 'keyboard',
    label: 'Bàn phím',
    icon: '⌨️',
    count: '8+ sản phẩm',
    gradient: 'from-pink-600/20 to-purple-600/20',
    border: 'hover:border-pink-500/40',
    description: 'Cơ, Membrane, Wireless',
  },
  {
    value: 'headset',
    label: 'Tai nghe',
    icon: '🎧',
    count: '5+ sản phẩm',
    gradient: 'from-yellow-600/20 to-orange-600/20',
    border: 'hover:border-yellow-500/40',
    description: 'Surround, ANC, Hi-Res',
  },
  {
    value: 'component',
    label: 'Linh kiện',
    icon: '⚙️',
    count: 'GPU, CPU, RAM',
    gradient: 'from-slate-600/20 to-gray-600/20',
    border: 'hover:border-slate-500/40',
    description: 'GPU, CPU, RAM, SSD',
  },
];

export default function CategorySection() {
  return (
    <section className="section">
      <div className="container-custom">
        {/* Title */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="badge-cyan mb-3 mx-auto w-fit">Danh mục sản phẩm</p>
            <h2 className="section-title">Tìm Theo Danh Mục</h2>
            <p className="section-subtitle">Hơn 100 sản phẩm chính hãng, đa dạng lựa chọn</p>
          </motion.div>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.value}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/products?category=${cat.value}`}
                className={`group flex flex-col items-center gap-3 p-5 card rounded-2xl border border-dark-600 ${cat.border} transition-all duration-300 hover:shadow-card text-center`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} border border-dark-500 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                  {cat.icon}
                </div>

                {/* Info */}
                <div>
                  <h3 className="font-semibold text-slate-200 text-sm group-hover:text-white transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
                  <p className="text-[11px] text-cyan-500 mt-1 font-medium">{cat.count}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-8">
          <Link href="/products" className="btn-outline gap-2">
            Xem tất cả sản phẩm
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
