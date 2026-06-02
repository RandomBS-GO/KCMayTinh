'use client';

import Link from 'next/link';
import { Cpu, Facebook, Youtube, Instagram, Phone, Mail, MapPin, Sparkles } from 'lucide-react';

const footerLinks = {
  products: [
    { label: 'Laptop Gaming', href: '/products?category=laptop&useCase=gaming' },
    { label: 'Laptop Văn phòng', href: '/products?category=laptop&useCase=office' },
    { label: 'PC Gaming', href: '/products?category=pc-gaming' },
    { label: 'Màn hình', href: '/products?category=monitor' },
    { label: 'Chuột & Bàn phím', href: '/products?category=mouse' },
    { label: 'Tai nghe', href: '/products?category=headset' },
  ],
  support: [
    { label: 'Hướng dẫn mua hàng', href: '/guide' },
    { label: 'Chính sách bảo hành', href: '/warranty' },
    { label: 'Đổi trả 30 ngày', href: '/return-policy' },
    { label: 'Tra cứu đơn hàng', href: '/orders' },
    { label: 'Phương thức thanh toán', href: '/payment' },
    { label: 'Liên hệ hỗ trợ', href: '/contact' },
  ],
  company: [
    { label: 'Về chúng tôi', href: '/about' },
    { label: 'AI Technology', href: '/ai-tech' },
    { label: 'Tin tức công nghệ', href: '/blog' },
    { label: 'Khuyến mãi', href: '/promotions' },
    { label: 'Tuyển dụng', href: '/careers' },
    { label: 'Chính sách bảo mật', href: '/privacy' },
  ],
};

const paymentMethods = ['💳 Visa', '💳 Mastercard', '📱 MoMo', '🔷 VNPay', '🏦 Chuyển khoản', '🚚 COD'];

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-dark-800/50 pt-16 pb-8">
      <div className="container-custom">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-dark-800/50">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-glow">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-2xl text-white">
                  Tech<span className="gradient-text-cyan">Store</span>
                </span>
                <div className="flex items-center gap-1 -mt-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span className="text-xs text-cyan-400 font-medium tracking-wider">AI POWERED</span>
                </div>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Website bán máy tính thông minh hàng đầu Việt Nam tích hợp AI tư vấn mua hàng, giúp bạn ra quyết định nhanh và chính xác.
            </p>

            {/* Contact info */}
            <div className="space-y-2.5">
              <a href="tel:18008326" className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                <Phone className="w-4 h-4 text-cyan-500" />
                <span>1800-TECH-AI (miễn phí)</span>
              </a>
              <a href="mailto:support@techstore.ai" className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                <Mail className="w-4 h-4 text-cyan-500" />
                <span>support@techstore.ai</span>
              </a>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                <span>123 Nguyễn Huệ, Q.1, TP.HCM</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { icon: <Facebook className="w-4 h-4" />, href: '#', label: 'Facebook' },
                { icon: <Youtube className="w-4 h-4" />, href: '#', label: 'Youtube' },
                { icon: <Instagram className="w-4 h-4" />, href: '#', label: 'Instagram' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-dark-800 border border-dark-600 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-display font-semibold text-slate-200 mb-4">Sản Phẩm</h4>
            <ul className="space-y-2.5">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-slate-200 mb-4">Hỗ Trợ</h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-slate-200 mb-4">Công Ty</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment methods */}
        <div className="py-8 border-b border-dark-800/50">
          <p className="text-sm text-slate-500 mb-3">Phương thức thanh toán:</p>
          <div className="flex flex-wrap gap-2">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="px-3 py-1.5 bg-dark-800 border border-dark-600 rounded-lg text-sm text-slate-300"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © 2024 TechStore AI. All rights reserved. | Được xây dựng với ❤️ và 🤖 AI
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <span>Powered by</span>
            <span className="text-cyan-500 font-medium">Google Gemini AI</span>
            <span>&</span>
            <span className="text-blue-500 font-medium">Next.js 14</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
