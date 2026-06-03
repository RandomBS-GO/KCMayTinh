'use client';

import Link from 'next/link';
import { Cpu, Facebook, Youtube, Instagram, Phone, Mail, MapPin } from 'lucide-react';

const footerLinks = {
  products: [
    { label: 'Laptop Gaming',      href: '/products?category=laptop&useCase=gaming' },
    { label: 'Laptop Văn phòng',   href: '/products?category=laptop&useCase=office' },
    { label: 'PC Gaming',          href: '/products?category=pc-gaming' },
    { label: 'Màn hình',           href: '/products?category=monitor' },
    { label: 'Chuột & Bàn phím',   href: '/products?category=mouse' },
    { label: 'Tai nghe',           href: '/products?category=headset' },
  ],
  support: [
    { label: 'Hướng dẫn mua hàng',   href: '/guide' },
    { label: 'Chính sách bảo hành',  href: '/warranty' },
    { label: 'Đổi trả 30 ngày',      href: '/return-policy' },
    { label: 'Tra cứu đơn hàng',     href: '/orders' },
    { label: 'Phương thức thanh toán', href: '/payment' },
    { label: 'Liên hệ hỗ trợ',       href: '/contact' },
  ],
  company: [
    { label: 'Về chúng tôi',       href: '/about' },
    { label: 'Tin tức công nghệ',  href: '/blog' },
    { label: 'Khuyến mãi',         href: '/promotions' },
    { label: 'Tuyển dụng',         href: '/careers' },
    { label: 'Chính sách bảo mật', href: '/privacy' },
    { label: 'Điều khoản dịch vụ', href: '/terms' },
  ],
};

const paymentMethods = [
  { label: 'Visa / Mastercard', icon: '💳' },
  { label: 'MoMo',              icon: '📱' },
  { label: 'VNPay',             icon: '🔷' },
  { label: 'Chuyển khoản',      icon: '🏦' },
  { label: 'COD',               icon: '🚚' },
];

const socials = [
  { icon: <Facebook  className="w-4 h-4" />, href: '#', label: 'Facebook'  },
  { icon: <Youtube   className="w-4 h-4" />, href: '#', label: 'YouTube'   },
  { icon: <Instagram className="w-4 h-4" />, href: '#', label: 'Instagram' },
];

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-dark-900">
      <div className="container-custom pt-14 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-dark-900">

          {/* Brand column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group w-fit" aria-label="TechStore trang chủ">
              <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center shadow-glow-sm transition-transform group-hover:scale-105">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2.2">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              </div>
              <div>
                <span className="font-display font-bold text-xl text-dark-50 tracking-tight">
                  Tech<span className="text-brand-400">Store</span>
                </span>
                <p className="text-[11px] text-dark-600 -mt-0.5 tracking-widest uppercase">Technology Retail</p>
              </div>
            </Link>

            <p className="text-sm text-dark-500 leading-relaxed max-w-xs">
              Chuỗi bán lẻ công nghệ hàng đầu Việt Nam. Chuyên cung cấp laptop, máy tính để bàn, màn hình và phụ kiện chính hãng.
            </p>

            {/* Contact */}
            <div className="space-y-2.5">
              <a href="tel:18008326" className="flex items-center gap-2.5 text-sm text-dark-500 hover:text-dark-200 transition-colors group">
                <Phone className="w-4 h-4 text-brand-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>1800-8326 (miễn phí)</span>
              </a>
              <a href="mailto:support@techstore.vn" className="flex items-center gap-2.5 text-sm text-dark-500 hover:text-dark-200 transition-colors group">
                <Mail className="w-4 h-4 text-brand-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>support@techstore.vn</span>
              </a>
              <div className="flex items-start gap-2.5 text-sm text-dark-500">
                <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                <span>123 Nguyễn Huệ, Q.1, TP.HCM</span>
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-dark-900 border border-dark-800 flex items-center justify-center text-dark-500 hover:text-brand-400 hover:border-brand-500/40 hover:bg-brand-600/10 transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-display font-semibold text-dark-200 mb-4 text-sm uppercase tracking-wider">Sản Phẩm</h4>
            <ul className="space-y-2.5">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-dark-500 hover:text-dark-200 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-dark-200 mb-4 text-sm uppercase tracking-wider">Hỗ Trợ</h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-dark-500 hover:text-dark-200 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-dark-200 mb-4 text-sm uppercase tracking-wider">Công Ty</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-dark-500 hover:text-dark-200 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment methods */}
        <div className="py-6 border-b border-dark-900">
          <p className="text-xs font-semibold text-dark-600 uppercase tracking-wider mb-3">Phương thức thanh toán</p>
          <div className="flex flex-wrap gap-2">
            {paymentMethods.map((method) => (
              <span
                key={method.label}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-900 border border-dark-800 rounded-lg text-xs text-dark-400"
              >
                <span>{method.icon}</span>
                {method.label}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-dark-600">
            © 2025 TechStore. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-dark-700">
            <Link href="/privacy" className="hover:text-dark-400 transition-colors">Bảo mật</Link>
            <Link href="/terms"   className="hover:text-dark-400 transition-colors">Điều khoản</Link>
            <Link href="/sitemap" className="hover:text-dark-400 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
