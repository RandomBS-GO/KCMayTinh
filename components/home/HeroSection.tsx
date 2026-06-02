'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Shield, Cpu } from 'lucide-react';
import { useChatStore } from '@/store';

// Particle component for hero background
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            background: i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#3b82f6' : '#8b5cf6',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 8 + 5}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.6 + 0.1,
          }}
        />
      ))}
    </div>
  );
}

const stats = [
  { value: '10,000+', label: 'Khách hàng tin dùng' },
  { value: '100+', label: 'Sản phẩm chính hãng' },
  { value: '99%', label: 'Đánh giá hài lòng' },
  { value: '24/7', label: 'Hỗ trợ AI tư vấn' },
];

const techBadges = [
  { icon: '🤖', label: 'AI Tư Vấn' },
  { icon: '⚡', label: 'Giao Nhanh' },
  { icon: '🛡️', label: 'Bảo Hành' },
  { icon: '💳', label: 'Trả Góp 0%' },
];

export default function HeroSection() {
  const openChat = useChatStore((s) => s.openChat);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-hero-gradient">
      {/* Animated background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 bg-glow-gradient" />
      <Particles />

      {/* Gradient orbs */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            {/* AI badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full border border-cyan-500/20"
            >
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300 font-medium">Tích hợp Google Gemini AI</span>
            </motion.div>

            {/* Main headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1]">
                <span className="text-slate-100">Mua Máy</span>
                <br />
                <span className="gradient-text">Thông Minh</span>
                <br />
                <span className="text-slate-100">Với AI</span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-400 leading-relaxed max-w-lg"
            >
              AI tư vấn cấu hình máy phù hợp, so sánh sản phẩm thông minh và hỗ trợ ra quyết định mua hàng nhanh chóng. Trải nghiệm mua sắm công nghệ thế hệ mới.
            </motion.p>

            {/* Tech badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {techBadges.map((badge) => (
                <span
                  key={badge.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 glass-card rounded-full text-sm text-slate-300 border border-dark-600"
                >
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </span>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/products" className="btn-primary btn-lg gap-2 group">
                <span>Khám Phá Ngay</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={openChat}
                className="btn-outline btn-lg gap-2 group"
              >
                <span className="text-xl group-hover:animate-bounce-subtle">🤖</span>
                <span>Hỏi AI Tư Vấn</span>
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-4 gap-4 pt-4 border-t border-dark-700/50"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display font-bold text-xl text-cyan-400">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right content – 3D-style product showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Main product card */}
            <div className="relative z-10 glass-card p-6 rounded-3xl border border-cyan-500/20 shadow-glow-lg animate-float">
              <div className="aspect-square max-w-[400px] mx-auto product-image-wrapper rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600"
                  alt="ASUS ROG Gaming Laptop"
                  className="w-full h-full object-contain p-6"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/1e293b/06b6d4?text=TechStore+AI';
                  }}
                />
              </div>

              {/* Product info overlay */}
              <div className="mt-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display font-bold text-slate-100">ASUS ROG Zephyrus G14</p>
                    <p className="text-sm text-slate-400">Ryzen 9 · RTX 4070 · OLED 165Hz</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-xl gradient-text-cyan">32.9 triệu</p>
                    <p className="text-xs text-slate-500 line-through">36.9 triệu</p>
                  </div>
                </div>

                <button
                  className="w-full btn-primary gap-2"
                  onClick={() => window.location.href = '/products/1'}
                >
                  <Zap className="w-4 h-4" />
                  Xem sản phẩm
                </button>
              </div>
            </div>

            {/* Floating info cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute -top-4 -right-4 glass-card px-4 py-3 rounded-2xl border border-emerald-500/20 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <div>
                  <p className="text-xs font-semibold text-emerald-400">AI Đề xuất</p>
                  <p className="text-xs text-slate-400">Phù hợp Gaming + AI</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 -left-4 glass-card px-4 py-3 rounded-2xl border border-cyan-500/20 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <div>
                  <p className="text-xs font-semibold text-cyan-400">4.9 / 5.0</p>
                  <p className="text-xs text-slate-400">234 đánh giá</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 2 }}
              className="absolute top-1/2 -right-8 glass-card px-3 py-2 rounded-xl border border-blue-500/20 shadow-lg"
            >
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-slate-300 font-medium">RTX 4070 · 8GB</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-950 to-transparent" />
    </section>
  );
}
