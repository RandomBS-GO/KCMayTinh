import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard – TechStore AI',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-dark-900 border-r border-dark-700 flex flex-col">
        <div className="p-5 border-b border-dark-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg">⚙️</div>
            <div>
              <p className="font-display font-bold text-slate-100 text-sm">Admin Panel</p>
              <p className="text-xs text-slate-500">TechStore AI</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: '/admin', icon: '📊', label: 'Dashboard' },
            { href: '/admin/products', icon: '📦', label: 'Sản phẩm' },
            { href: '/admin/orders', icon: '🛒', label: 'Đơn hàng' },
            { href: '/admin/customers', icon: '👥', label: 'Khách hàng' },
            { href: '/admin/promotions', icon: '🎁', label: 'Khuyến mãi' },
            { href: '/admin/ai-logs', icon: '🤖', label: 'AI Logs' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-dark-800 transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-dark-700">
          <a href="/" className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Về trang chủ
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
