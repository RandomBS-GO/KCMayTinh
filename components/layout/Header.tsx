'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Cpu,
  ChevronDown,
  Sparkles,
  Heart,
  Bell,
  User,
  LogOut,
  Package
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore, useChatStore } from '@/store';
import { getCategoryLabel } from '@/lib/utils';

const categories = [
  { value: 'laptop', icon: '💻' },
  { value: 'pc-gaming', icon: '🖥️' },
  { value: 'monitor', icon: '🖥️' },
  { value: 'mouse', icon: '🖱️' },
  { value: 'keyboard', icon: '⌨️' },
  { value: 'headset', icon: '🎧' },
  { value: 'component', icon: '⚙️' },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { data: session } = useSession();
  const cartItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openCart);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-dark-950/95 backdrop-blur-xl border-b border-dark-700/50 shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20 border-b border-cyan-500/10 py-1.5 text-center text-xs text-slate-400 hidden md:block">
          🎉 Giảm 10% laptop gaming – Mã: <span className="text-cyan-400 font-semibold">GAMING10</span>
          &nbsp;|&nbsp; Freeship đơn từ 5 triệu &nbsp;|&nbsp; Hotline: <span className="text-cyan-400">1800-TECH-AI</span>
        </div>

        <div className="container-custom">
          <div className="flex items-center gap-4 py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
              </div>
              <div>
                <span className="font-display font-bold text-xl text-white">
                  Tech<span className="gradient-text-cyan">Store</span>
                </span>
                <div className="flex items-center gap-1 -mt-1">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                  <span className="text-[10px] text-cyan-400 font-medium tracking-wider">AI POWERED</span>
                </div>
              </div>
            </Link>

            {/* Categories dropdown */}
            <div className="relative hidden lg:block">
              <button
                onMouseEnter={() => setIsCategoryMenuOpen(true)}
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white rounded-lg hover:bg-dark-700/50 transition-all text-sm font-medium"
              >
                <span>Danh mục</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isCategoryMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseEnter={() => setIsCategoryMenuOpen(true)}
                    onMouseLeave={() => setIsCategoryMenuOpen(false)}
                    className="absolute top-full left-0 mt-1 w-52 card border border-dark-600 shadow-xl py-2 z-50"
                  >
                    {categories.map((cat) => (
                      <Link
                        key={cat.value}
                        href={`/products?category=${cat.value}`}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-dark-700/50 hover:text-cyan-400 transition-colors text-sm text-slate-300"
                      >
                        <span className="text-base">{cat.icon}</span>
                        <span>{getCategoryLabel(cat.value)}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Tìm laptop, PC, phụ kiện... (vd: "RTX 4070", "MacBook")'
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-800/80 border border-dark-600 text-slate-200 placeholder-slate-500 rounded-xl text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-medium hover:bg-cyan-500/30 transition-colors"
                >
                  Tìm
                </button>
              </div>
            </form>

            {/* User Account */}
            <div className="hidden lg:block relative">
              {session ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-xl transition-all"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {session.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-medium text-slate-200 max-w-[100px] truncate">{session.user?.name}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                  
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-dark-800 border border-dark-600 rounded-xl shadow-xl overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-dark-700">
                          <p className="text-sm font-medium text-slate-200 truncate">{session.user?.name}</p>
                          <p className="text-xs text-slate-400 truncate">{session.user?.email}</p>
                        </div>
                        <div className="p-1">
                          <Link href="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-cyan-400 hover:bg-dark-700 rounded-lg transition-colors">
                            <User className="w-4 h-4" /> Tài khoản
                          </Link>
                          <Link href="/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-cyan-400 hover:bg-dark-700 rounded-lg transition-colors">
                            <Package className="w-4 h-4" /> Đơn hàng
                          </Link>
                          {session.user?.role === 'admin' && (
                            <Link href="/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-amber-400 hover:bg-dark-700 rounded-lg transition-colors">
                              <Sparkles className="w-4 h-4" /> Quản trị Admin
                            </Link>
                          )}
                          <button onClick={() => signOut()} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-dark-700 rounded-lg transition-colors text-left">
                            <LogOut className="w-4 h-4" /> Đăng xuất
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl text-sm font-medium hover:from-cyan-500/30 hover:to-blue-500/30 transition-all group"
                >
                  <User className="w-4 h-4" />
                  <span>Đăng nhập</span>
                </Link>
              )}
            </div>

            {/* Nav icons */}
            <div className="flex items-center gap-1">
              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2.5 text-slate-400 hover:text-red-400 hover:bg-dark-700 rounded-xl transition-all"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2.5 text-slate-400 hover:text-cyan-400 hover:bg-dark-700 rounded-xl transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-glow-sm"
                  >
                    {cartItems > 9 ? '9+' : cartItems}
                  </motion.span>
                )}
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 text-slate-400 hover:text-white hover:bg-dark-700 rounded-xl transition-all"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Nav links (desktop) */}
          <nav className="hidden lg:flex items-center gap-6 pb-3 text-sm">
            {[
              { href: '/', label: 'Trang chủ' },
              { href: '/products', label: 'Sản phẩm' },
              { href: '/products?category=laptop', label: '💻 Laptop' },
              { href: '/products?category=pc-gaming', label: '🖥️ PC Gaming' },
              { href: '/products?useCase=gaming', label: '🎮 Gaming' },
              { href: '/products?useCase=office', label: '💼 Văn phòng' },
              { href: '/products?useCase=student', label: '📚 Sinh viên' },
              { href: '/products?featured=true', label: '⭐ Nổi bật' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-cyan-400 ${
                  pathname === link.href ? 'text-cyan-400 font-medium' : 'text-slate-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-dark-700 bg-dark-950/98 backdrop-blur-xl overflow-hidden"
            >
              {/* Search on mobile */}
              <form onSubmit={handleSearch} className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm sản phẩm..."
                    className="w-full pl-10 pr-4 py-2.5 input text-sm"
                  />
                </div>
              </form>

              <nav className="px-4 pb-4 space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.value}
                    href={`/products?category=${cat.value}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-dark-800 rounded-xl transition-colors"
                  >
                    <span>{cat.icon}</span>
                    <span>{getCategoryLabel(cat.value)}</span>
                  </Link>
                ))}
                
                {/* Mobile Auth */}
                <div className="px-4 pt-4 border-t border-dark-700 mt-2">
                  {session ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 px-4 py-3 bg-dark-800 rounded-xl mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                          {session.user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-200 truncate">{session.user?.name}</p>
                          <p className="text-xs text-slate-400 truncate">{session.user?.email}</p>
                        </div>
                      </div>
                      <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-dark-800 rounded-xl transition-colors">
                        <User className="w-5 h-5" /> Tài khoản
                      </Link>
                      <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-dark-800 rounded-xl transition-colors">
                        <Package className="w-5 h-5" /> Đơn hàng
                      </Link>
                      <button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-dark-800 rounded-xl transition-colors text-left">
                        <LogOut className="w-5 h-5" /> Đăng xuất
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-xl transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">Đăng nhập / Đăng ký</span>
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-[120px] lg:h-[108px]" />
    </>
  );
}
