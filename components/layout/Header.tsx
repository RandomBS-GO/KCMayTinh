'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Search, Menu, X, ChevronDown,
  Heart, User, LogOut, Package, Settings, Shield,
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/store';
import { getCategoryLabel } from '@/lib/utils';

const categories = [
  { value: 'laptop',    label: 'Laptop',    icon: '💻' },
  { value: 'pc-gaming', label: 'PC Gaming',  icon: '🖥️' },
  { value: 'monitor',   label: 'Màn hình',   icon: '🖥️' },
  { value: 'mouse',     label: 'Chuột',      icon: '🖱️' },
  { value: 'keyboard',  label: 'Bàn phím',   icon: '⌨️' },
  { value: 'headset',   label: 'Tai nghe',   icon: '🎧' },
  { value: 'component', label: 'Linh kiện',  icon: '⚙️' },
];

const navLinks = [
  { href: '/',         label: 'Trang chủ' },
  { href: '/products', label: 'Sản phẩm'  },
];

export default function Header() {
  const pathname = usePathname();
  const router   = useRouter();

  const [isScrolled,         setIsScrolled]         = useState(false);
  const [isMobileOpen,       setIsMobileOpen]        = useState(false);
  const [isCategoryOpen,     setIsCategoryOpen]      = useState(false);
  const [isUserOpen,         setIsUserOpen]          = useState(false);
  const [searchQuery,        setSearchQuery]         = useState('');
  const [isSearchFocused,    setIsSearchFocused]     = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const userRef     = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();
  const cartItems = useCartStore((s) => s.totalItems());
  const openCart  = useCartStore((s) => s.openCart);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsMobileOpen(false); }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const userInitial = session?.user?.name?.charAt(0).toUpperCase() ?? 'U';

  return (
    <>
      <motion.header
        initial={{ y: -4, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-dark-950/95 backdrop-blur-xl border-b border-dark-800/80 shadow-elevation-2'
            : 'bg-dark-950/80 backdrop-blur-md border-b border-transparent'
        }`}
      >
        {/* Promo bar */}
        <div className="bg-brand-600 text-white text-center text-xs py-2 px-4 font-medium hidden md:block">
          🎉 Freeship đơn từ 5 triệu &nbsp;|&nbsp; 🛡️ Bảo hành chính hãng 24 tháng &nbsp;|&nbsp; 📞 Hotline: 1800-8326
        </div>

        <div className="container-custom">
          <div className="flex items-center gap-4 h-14">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group" aria-label="TechStore trang chủ">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-glow-sm transition-transform group-hover:scale-105">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2.2">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              </div>
              <span className="font-display font-bold text-xl text-dark-50 tracking-tight">
                Tech<span className="text-brand-400">Store</span>
              </span>
            </Link>

            {/* Category dropdown */}
            <div ref={categoryRef} className="relative hidden lg:block">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-dark-300 hover:text-dark-100 rounded-lg hover:bg-dark-800 transition-all"
                aria-expanded={isCategoryOpen}
                aria-haspopup="true"
              >
                Danh mục
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-52 bg-dark-900 border border-dark-700 rounded-xl shadow-elevation-3 overflow-hidden"
                  >
                    <div className="p-1.5">
                      {categories.map((cat) => (
                        <Link
                          key={cat.value}
                          href={`/products?category=${cat.value}`}
                          onClick={() => setIsCategoryOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-dark-300 hover:text-dark-100 hover:bg-dark-800 rounded-lg transition-colors"
                        >
                          <span className="text-base w-5 text-center">{cat.icon}</span>
                          <span>{cat.label}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder='Tìm sản phẩm, thương hiệu...'
                  aria-label="Tìm kiếm sản phẩm"
                  className={`w-full pl-10 pr-16 py-2 bg-dark-900 border text-sm text-dark-100 placeholder-dark-500 rounded-xl outline-none transition-all duration-200 ${
                    isSearchFocused
                      ? 'border-brand-500 ring-2 ring-brand-500/20'
                      : 'border-dark-700 hover:border-dark-600'
                  }`}
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Tìm
                </button>
              </div>
            </form>

            {/* Right icons */}
            <div className="flex items-center gap-1 ml-auto">

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2 text-dark-400 hover:text-red-400 hover:bg-dark-800 rounded-lg transition-all"
                aria-label="Danh sách yêu thích"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 text-dark-400 hover:text-brand-400 hover:bg-dark-800 rounded-lg transition-all"
                aria-label={`Giỏ hàng (${cartItems} sản phẩm)`}
              >
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {cartItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-600 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                    >
                      {cartItems > 9 ? '9+' : cartItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* User menu — Desktop */}
              <div ref={userRef} className="relative hidden lg:block">
                {session ? (
                  <>
                    <button
                      onClick={() => setIsUserOpen(!isUserOpen)}
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-dark-900 border border-dark-700 hover:border-dark-600 rounded-xl transition-all"
                      aria-expanded={isUserOpen}
                      aria-haspopup="true"
                    >
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name ?? 'Avatar'}
                          width={24}
                          height={24}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {userInitial}
                        </div>
                      )}
                      <span className="text-sm font-medium text-dark-200 max-w-[90px] truncate">
                        {session.user?.name?.split(' ').pop()}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-dark-500 transition-transform duration-200 ${isUserOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isUserOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-dark-900 border border-dark-700 rounded-xl shadow-elevation-3 overflow-hidden"
                        >
                          {/* User info */}
                          <div className="px-4 py-3 border-b border-dark-800">
                            <p className="text-sm font-semibold text-dark-100 truncate">{session.user?.name}</p>
                            <p className="text-xs text-dark-500 truncate mt-0.5">{session.user?.email}</p>
                          </div>

                          {/* Menu items */}
                          <div className="p-1.5">
                            <Link href="/profile" onClick={() => setIsUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-dark-300 hover:text-dark-100 hover:bg-dark-800 rounded-lg transition-colors">
                              <User className="w-4 h-4" /> Tài khoản
                            </Link>
                            <Link href="/orders" onClick={() => setIsUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-dark-300 hover:text-dark-100 hover:bg-dark-800 rounded-lg transition-colors">
                              <Package className="w-4 h-4" /> Đơn hàng của tôi
                            </Link>
                            <Link href="/wishlist" onClick={() => setIsUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-dark-300 hover:text-dark-100 hover:bg-dark-800 rounded-lg transition-colors">
                              <Heart className="w-4 h-4" /> Yêu thích
                            </Link>

                            {session.user?.role === 'admin' && (
                              <>
                                <div className="my-1 border-t border-dark-800" />
                                <Link href="/admin" onClick={() => setIsUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-amber-400 hover:bg-dark-800 rounded-lg transition-colors">
                                  <Shield className="w-4 h-4" /> Quản trị Admin
                                </Link>
                              </>
                            )}

                            <div className="my-1 border-t border-dark-800" />
                            <button
                              onClick={() => signOut({ callbackUrl: '/' })}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-dark-800 rounded-lg transition-colors text-left"
                            >
                              <LogOut className="w-4 h-4" /> Đăng xuất
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/login" className="text-sm font-medium text-dark-300 hover:text-dark-100 px-3 py-2 rounded-lg hover:bg-dark-800 transition-colors">
                      Đăng nhập
                    </Link>
                    <Link href="/register" className="btn-primary btn-sm">
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden p-2 text-dark-400 hover:text-dark-100 hover:bg-dark-800 rounded-lg transition-all"
                aria-label={isMobileOpen ? 'Đóng menu' : 'Mở menu'}
              >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Desktop sub-nav */}
          <nav className="hidden lg:flex items-center gap-6 pb-2 text-sm" aria-label="Danh mục sản phẩm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors font-medium ${
                  pathname === link.href
                    ? 'text-brand-400'
                    : 'text-dark-400 hover:text-dark-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={`/products?category=${cat.value}`}
                className={`transition-colors ${
                  pathname?.includes(cat.value)
                    ? 'text-brand-400'
                    : 'text-dark-500 hover:text-dark-300'
                }`}
              >
                {cat.icon} {cat.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden border-t border-dark-800 bg-dark-950/98 backdrop-blur-xl overflow-hidden"
            >
              {/* Mobile search */}
              <div className="p-4 border-b border-dark-800">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm sản phẩm..."
                      className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-dark-700 text-dark-100 placeholder-dark-500 text-sm rounded-xl outline-none focus:border-brand-500"
                    />
                  </div>
                </form>
              </div>

              {/* Mobile categories */}
              <nav className="p-3 border-b border-dark-800">
                <p className="px-3 py-1.5 text-xs font-semibold text-dark-500 uppercase tracking-wider">Danh mục</p>
                {categories.map((cat) => (
                  <Link
                    key={cat.value}
                    href={`/products?category=${cat.value}`}
                    className="flex items-center gap-3 px-3 py-2.5 text-dark-300 hover:text-dark-100 hover:bg-dark-800 rounded-lg transition-colors"
                  >
                    <span className="w-5 text-center">{cat.icon}</span>
                    <span className="text-sm">{cat.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Mobile user section */}
              <div className="p-3">
                {session ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-3 bg-dark-900 rounded-xl mb-2">
                      {session.user?.image ? (
                        <Image src={session.user.image} alt="Avatar" width={36} height={36} className="rounded-full" />
                      ) : (
                        <div className="w-9 h-9 bg-brand-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                          {userInitial}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-dark-100 truncate">{session.user?.name}</p>
                        <p className="text-xs text-dark-500 truncate">{session.user?.email}</p>
                      </div>
                    </div>
                    <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 text-dark-300 hover:text-dark-100 hover:bg-dark-800 rounded-lg transition-colors">
                      <User className="w-4 h-4" /> <span className="text-sm">Tài khoản</span>
                    </Link>
                    <Link href="/orders" className="flex items-center gap-3 px-3 py-2.5 text-dark-300 hover:text-dark-100 hover:bg-dark-800 rounded-lg transition-colors">
                      <Package className="w-4 h-4" /> <span className="text-sm">Đơn hàng</span>
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-dark-800 rounded-lg transition-colors text-left mt-1"
                    >
                      <LogOut className="w-4 h-4" /> <span className="text-sm">Đăng xuất</span>
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 px-1">
                    <Link href="/login" className="flex-1 btn-secondary text-center text-sm py-2.5">
                      Đăng nhập
                    </Link>
                    <Link href="/register" className="flex-1 btn-primary text-center text-sm py-2.5">
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer */}
      <div className="h-[calc(56px+36px)] lg:h-[calc(56px+36px+32px)]" />
    </>
  );
}
