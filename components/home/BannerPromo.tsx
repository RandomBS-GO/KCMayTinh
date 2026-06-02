'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

const banners = [
  {
    title: 'Laptop Gaming Sale 10%',
    desc: 'Tất cả laptop gaming giảm ngay 10% với mã GAMING10',
    code: 'GAMING10',
    link: '/products?category=laptop&useCase=gaming',
    bg: 'from-cyan-600/30 to-blue-600/30',
    border: 'border-cyan-500/30',
    emoji: '🎮',
    tag: 'Gaming Deal',
  },
  {
    title: 'Tặng Chuột + Bàn Phím',
    desc: 'Mua PC Gaming từ 20 triệu tặng chuột + bàn phím trị giá 1.5 triệu',
    code: null,
    link: '/products?category=pc-gaming',
    bg: 'from-purple-600/30 to-pink-600/30',
    border: 'border-purple-500/30',
    emoji: '🎁',
    tag: 'Gift Bundle',
  },
];

export default function BannerPromo() {
  return (
    <section className="section">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner, i) => (
            <motion.div
              key={banner.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={banner.link}
                className={`group relative flex items-center gap-6 p-6 rounded-2xl border ${banner.border} bg-gradient-to-br ${banner.bg} overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1`}
              >
                {/* Background decoration */}
                <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-white/5 to-transparent" />

                {/* Emoji */}
                <div className="text-5xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {banner.emoji}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <span className="badge-cyan text-[10px] mb-2 inline-block">{banner.tag}</span>
                  <h3 className="font-display font-bold text-lg text-slate-100 leading-snug">
                    {banner.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">{banner.desc}</p>
                  {banner.code && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-slate-400">Mã:</span>
                      <code className="px-2 py-0.5 bg-dark-900/50 border border-cyan-500/30 rounded text-xs font-mono text-cyan-400">
                        {banner.code}
                      </code>
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Flash sale countdown (decorative) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 flex items-center justify-between flex-wrap gap-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="font-display font-bold text-slate-100">Flash Sale Cuối Tuần</p>
              <p className="text-sm text-slate-400">Giảm đến 20% cho hàng ngàn sản phẩm</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-400" />
            <span className="text-sm text-slate-400">Còn lại:</span>
            {['08', '45', '23'].map((val, i) => (
              <span key={i} className="px-2 py-1 bg-dark-900 border border-red-500/30 rounded-lg font-mono font-bold text-red-400 text-sm">
                {val}
                {i < 2 && <span className="text-slate-600 mx-0.5">:</span>}
              </span>
            ))}
          </div>
          <Link href="/products" className="btn-primary btn-sm bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 shadow-none hover:shadow-none border-0">
            Mua ngay
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
