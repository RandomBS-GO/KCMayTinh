'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap, Shield, Truck, Star, ChevronRight } from 'lucide-react';

const stats = [
  { value: '10,000+', label: 'Khách hàng tin dùng' },
  { value: '100+',    label: 'Sản phẩm chính hãng'  },
  { value: '99%',     label: 'Đánh giá hài lòng'     },
  { value: '24/7',    label: 'Hỗ trợ khách hàng'     },
];

const badges = [
  { icon: <Truck className="w-4 h-4" />,   label: 'Giao hàng nhanh'  },
  { icon: <Shield className="w-4 h-4" />,  label: 'Bảo hành 24 tháng' },
  { icon: <Zap className="w-4 h-4" />,    label: 'Trả góp 0%'        },
  { icon: <Star className="w-4 h-4" />,   label: '100% Chính hãng'   },
];

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[88vh] flex items-center overflow-hidden"
      aria-label="Hero — Trang chủ TechStore"
    >
      {/* CSS-only background — no hydration issues */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 bg-glow-gradient" />

      {/* Subtle gradient orbs — pure CSS, no JS random */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-600/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-600/6 rounded-full blur-3xl" />

      <div className="container-custom relative z-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Content */}
          <div className="space-y-8 order-2 lg:order-1">

            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-600/10 border border-brand-500/25 rounded-full"
            >
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
              <span className="text-sm text-brand-300 font-medium">Hàng nghìn sản phẩm chính hãng</span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight text-balance">
                <span className="text-dark-50">Khám Phá</span>
                <br />
                <span className="gradient-text">Công Nghệ</span>
                <br />
                <span className="text-dark-50">Đỉnh Cao</span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-dark-400 text-lg leading-relaxed max-w-md"
            >
              Laptop, PC Gaming, màn hình và phụ kiện chính hãng. 
              Tư vấn chuyên sâu, bảo hành tận nơi — mua sắm không lo.
            </motion.p>

            {/* Feature badges */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-900 border border-dark-800 rounded-full text-sm text-dark-300"
                >
                  <span className="text-brand-400">{badge.icon}</span>
                  {badge.label}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              <Link href="/products" className="btn-primary btn-lg gap-2 group">
                Khám phá ngay
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/products?category=laptop" className="btn-secondary btn-lg gap-2">
                Xem Laptop
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-4 gap-4 pt-6 border-t border-dark-800"
            >
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-display font-bold text-xl text-brand-400">{s.value}</p>
                  <p className="text-xs text-dark-500 mt-0.5 leading-snug">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Product showcase */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative order-1 lg:order-2 hidden lg:block"
          >
            {/* Main product card */}
            <div className="relative z-10 animate-float">
              <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 shadow-elevation-3">
                <div className="aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden bg-dark-950">
                  <Image
                    src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80"
                    alt="Laptop gaming cao cấp"
                    width={500}
                    height={500}
                    className="w-full h-full object-contain p-6"
                    priority
                  />
                </div>

                {/* Product info */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-display font-bold text-dark-100">ASUS ROG Zephyrus G14</p>
                      <p className="text-sm text-dark-500 mt-0.5">Ryzen 9 · RTX 4070 · OLED 165Hz</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-xl text-brand-400">32.9 triệu</p>
                      <p className="text-xs text-dark-600 line-through">36.9 triệu</p>
                    </div>
                  </div>
                  <Link href="/products/l1" className="btn-primary w-full justify-center gap-2 text-sm">
                    <Zap className="w-4 h-4" />
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>

            {/* Floating badge — Rating */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-4 -left-6 bg-dark-900 border border-dark-700 rounded-2xl px-4 py-3 shadow-elevation-2"
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <div>
                  <p className="text-xs font-bold text-dark-100">4.9 / 5.0</p>
                  <p className="text-[11px] text-dark-500">234 đánh giá</p>
                </div>
              </div>
            </motion.div>

            {/* Floating badge — Discount */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
              className="absolute -top-4 -right-4 bg-brand-600 rounded-2xl px-4 py-3 shadow-glow-sm"
            >
              <p className="text-xs font-bold text-white">Giảm 11%</p>
              <p className="text-[11px] text-brand-200">Hôm nay</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-950 to-transparent" />
    </section>
  );
}
