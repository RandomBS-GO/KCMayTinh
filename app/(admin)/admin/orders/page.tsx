'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Eye, MoreHorizontal, Download, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(search.toLowerCase()) || 
                          order.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
                          order.customer?.phone?.includes(search);
    const status = order.orderStatus || order.status || 'pending';
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered': return 'badge-green';
      case 'shipped': return 'badge-cyan';
      case 'processing': return 'badge-blue';
      case 'pending': return 'badge-orange';
      case 'cancelled': return 'badge-red';
      // Fallback for mock data strings if any
      case 'Đã giao': return 'badge-green';
      case 'Đang giao': return 'badge-cyan';
      case 'Chờ xác nhận': return 'badge-orange';
      case 'Đã hủy': return 'badge-red';
      default: return 'badge-purple';
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'delivered': return 'Đã giao';
      case 'shipped': return 'Đang giao';
      case 'processing': return 'Đang xử lý';
      case 'pending': return 'Chờ xác nhận';
      case 'cancelled': return 'Đã hủy';
      default: return status;
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
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-500" />
                  </td>
                </tr>
              ) : filteredOrders.map(order => (
                <tr key={order._id || order.id}>
                  <td>
                    <span className="font-mono text-cyan-400 font-semibold">{order.orderNumber || order.id}</span>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{order.customer?.name}</span>
                      <span className="text-xs text-slate-500">{order.customer?.phone}</span>
                    </div>
                  </td>
                  <td className="text-sm text-slate-400">
                    {format(new Date(order.createdAt || order.date), "dd/MM/yyyy HH:mm", { locale: vi })}
                  </td>
                  <td className="text-center">
                    <span className="inline-block bg-dark-700 w-6 h-6 rounded-full text-xs leading-6 text-slate-300">
                      {Array.isArray(order.items) ? order.items.length : order.items}
                    </span>
                  </td>
                  <td>
                    <span className="font-bold price-tag text-sm">{formatPrice(order.total || order.totalAmount || 0)}</span>
                  </td>
                  <td className="text-sm text-slate-400">
                    {order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod === 'bank' ? 'Chuyển khoản' : order.paymentMethod}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(order.orderStatus || order.status || 'pending')}`}>
                      {translateStatus(order.orderStatus || order.status || 'pending')}
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
        {(!isLoading && filteredOrders.length === 0) && (
          <div className="p-8 text-center text-slate-500">
            Không tìm thấy đơn hàng nào phù hợp
          </div>
        )}
      </div>
    </div>
  );
}
