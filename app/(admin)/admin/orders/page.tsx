'use client';

import { useState } from 'react';
import { Search, Filter, Eye, MoreHorizontal, Download } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// Mock order data
const MOCK_ORDERS = [
  {
    id: 'TS849201',
    customer: { name: 'Nguyễn Văn A', phone: '0912345678', email: 'vana@example.com' },
    date: '2024-05-15T10:30:00Z',
    total: 32990000,
    status: 'Đã giao',
    paymentMethod: 'Chuyển khoản',
    items: 2
  },
  {
    id: 'TS849202',
    customer: { name: 'Trần Thị B', phone: '0987654321', email: 'tranb@example.com' },
    date: '2024-05-15T14:20:00Z',
    total: 1590000,
    status: 'Đang giao',
    paymentMethod: 'COD',
    items: 1
  },
  {
    id: 'TS849203',
    customer: { name: 'Lê Văn C', phone: '0909090909', email: 'levanc@example.com' },
    date: '2024-05-16T09:15:00Z',
    total: 14990000,
    status: 'Chờ xác nhận',
    paymentMethod: 'VNPay',
    items: 1
  },
  {
    id: 'TS849204',
    customer: { name: 'Phạm Thị D', phone: '0933333333', email: 'phamd@example.com' },
    date: '2024-05-16T11:45:00Z',
    total: 3190000,
    status: 'Đã hủy',
    paymentMethod: 'MoMo',
    items: 1
  },
  {
    id: 'TS849205',
    customer: { name: 'Hoàng Văn E', phone: '0944444444', email: 'hoange@example.com' },
    date: '2024-05-17T08:00:00Z',
    total: 79990000,
    status: 'Đã giao',
    paymentMethod: 'Chuyển khoản',
    items: 3
  },
  {
    id: 'TS849206',
    customer: { name: 'Đỗ Thị F', phone: '0955555555', email: 'dotf@example.com' },
    date: '2024-05-17T15:30:00Z',
    total: 18490000,
    status: 'Đang giao',
    paymentMethod: 'COD',
    items: 1
  },
  {
    id: 'TS849207',
    customer: { name: 'Ngô Văn G', phone: '0966666666', email: 'ngog@example.com' },
    date: '2024-05-18T10:10:00Z',
    total: 42990000,
    status: 'Chờ xác nhận',
    paymentMethod: 'Chuyển khoản',
    items: 1
  }
];

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = MOCK_ORDERS.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase()) || 
                          order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
                          order.customer.phone.includes(search);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đã giao': return 'badge-green';
      case 'Đang giao': return 'badge-cyan';
      case 'Chờ xác nhận': return 'badge-orange';
      case 'Đã hủy': return 'badge-red';
      default: return 'badge-purple';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-100">Quản lý Đơn hàng</h1>
          <p className="text-slate-400 text-sm mt-1">Theo dõi và xử lý các đơn đặt hàng từ khách.</p>
        </div>
        <button className="btn-secondary btn-sm gap-2 whitespace-nowrap">
          <Download className="w-4 h-4" /> Xuất Excel
        </button>
      </div>

      {/* Filters & Search */}
      <div className="card p-4 rounded-2xl flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, tên KH, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 h-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input h-10 py-0 min-w-[180px]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Chờ xác nhận">Chờ xác nhận</option>
            <option value="Đang giao">Đang giao</option>
            <option value="Đã giao">Đã giao</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table w-full whitespace-nowrap">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Số lượng</th>
                <th>Tổng tiền</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>
                    <span className="font-mono text-cyan-400 font-semibold">{order.id}</span>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{order.customer.name}</span>
                      <span className="text-xs text-slate-500">{order.customer.phone}</span>
                    </div>
                  </td>
                  <td className="text-sm text-slate-400">
                    {format(new Date(order.date), "dd/MM/yyyy HH:mm", { locale: vi })}
                  </td>
                  <td className="text-center">
                    <span className="inline-block bg-dark-700 w-6 h-6 rounded-full text-xs leading-6 text-slate-300">
                      {order.items}
                    </span>
                  </td>
                  <td>
                    <span className="font-bold price-tag text-sm">{formatPrice(order.total)}</span>
                  </td>
                  <td className="text-sm text-slate-400">
                    {order.paymentMethod}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg bg-dark-700 text-slate-400 hover:text-cyan-400 hover:bg-dark-600 transition-colors" title="Xem chi tiết">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg bg-dark-700 text-slate-400 hover:text-slate-200 hover:bg-dark-600 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            Không tìm thấy đơn hàng nào phù hợp
          </div>
        )}
      </div>
    </div>
  );
}
