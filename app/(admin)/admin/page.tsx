'use client';

import { motion } from 'framer-motion';
import { ALL_PRODUCTS } from '@/lib/products-data';
import { formatPrice } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const stats = [
  { label: 'Tổng sản phẩm', value: ALL_PRODUCTS.length, icon: '📦', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { label: 'Doanh thu hôm nay', value: '12.5 triệu', icon: '💰', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Đơn hàng mới', value: 23, icon: '🛒', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Khách hàng', value: '1,234', icon: '👥', color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

const revenueData = [
  { month: 'T1', revenue: 45 }, { month: 'T2', revenue: 52 },
  { month: 'T3', revenue: 48 }, { month: 'T4', revenue: 67 },
  { month: 'T5', revenue: 73 }, { month: 'T6', revenue: 89 },
];

const categoryData = [
  { name: 'Laptop', value: 40, color: '#06b6d4' },
  { name: 'PC Gaming', value: 25, color: '#3b82f6' },
  { name: 'Màn hình', value: 15, color: '#8b5cf6' },
  { name: 'Phụ kiện', value: 20, color: '#f59e0b' },
];

const recentOrders = [
  { id: 'TS12345678', customer: 'Nguyễn Văn A', product: 'ASUS ROG G14 2024', total: 32_990_000, status: 'Đang giao' },
  { id: 'TS12345677', customer: 'Trần Thị B', product: 'Logitech MX Master 3S', total: 1_590_000, status: 'Đã giao' },
  { id: 'TS12345676', customer: 'Lê Văn C', product: 'LG UltraGear OLED 27"', total: 14_990_000, status: 'Chờ xác nhận' },
  { id: 'TS12345675', customer: 'Phạm Thị D', product: 'Razer BlackShark V2 Pro', total: 3_190_000, status: 'Đã giao' },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-100">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Tổng quan hoạt động TechStore AI</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card p-5 rounded-2xl"
          >
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center text-xl mb-3`}>
              {stat.icon}
            </div>
            <p className={`font-display font-bold text-2xl ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 card p-5 rounded-2xl">
          <h3 className="font-semibold text-slate-200 mb-4">Doanh thu 6 tháng (triệu đồng)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Bar dataKey="revenue" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="card p-5 rounded-2xl">
          <h3 className="font-semibold text-slate-200 mb-4">Theo danh mục</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-slate-400">{item.name}</span>
                </div>
                <span className="text-slate-300 font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-dark-700">
          <h3 className="font-semibold text-slate-200">Đơn hàng gần đây</h3>
        </div>
        <table className="data-table w-full">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td className="font-mono text-cyan-400 text-xs">{order.id}</td>
                <td className="text-slate-300">{order.customer}</td>
                <td className="text-slate-400 text-xs max-w-[150px] truncate">{order.product}</td>
                <td className="font-bold price-tag">{formatPrice(order.total)}</td>
                <td>
                  <span className={`badge text-xs ${
                    order.status === 'Đã giao' ? 'badge-green' :
                    order.status === 'Đang giao' ? 'badge-cyan' :
                    'badge-orange'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
