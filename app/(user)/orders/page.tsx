"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  totalAmount?: number;
  orderStatus: string;
  status?: string;
  items: any[];
  customer?: { name: string; email: string };
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;
    setIsLoading(true);
    const email = encodeURIComponent(session.user.email);
    fetch(`/api/orders?email=${email}`)
      .then((res) => res.ok ? res.json() : null)
      .then((responseData) => {
        setOrders(responseData?.data || []);
      })
      .catch(() => toast.error("Không thể tải danh sách đơn hàng"))
      .finally(() => setIsLoading(false));
  }, [status, session?.user?.email]);


  if (status === "loading") {
    return <div className="min-h-screen pt-24 pb-12 flex justify-center items-center text-brand-400">Đang tải...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-slate-100">Vui lòng đăng nhập</h1>
        <Link href="/login" className="mt-4 px-6 py-2 bg-brand-600 text-white rounded-lg">Đăng nhập ngay</Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-medium"><Clock className="w-3.5 h-3.5" /> Chờ xử lý</span>;
      case "processing":
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium"><Package className="w-3.5 h-3.5" /> Đang chuẩn bị hàng</span>;
      case "shipped":
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-medium"><Package className="w-3.5 h-3.5" /> Đang giao hàng</span>;
      case "delivered":
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-medium"><CheckCircle className="w-3.5 h-3.5" /> Đã giao</span>;
      case "cancelled":
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-medium"><XCircle className="w-3.5 h-3.5" /> Đã hủy</span>;
      default:
        return <span className="px-3 py-1 bg-slate-500/10 text-slate-400 border border-slate-500/20 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-100">Đơn hàng của tôi</h1>
          <p className="text-slate-400 mt-2">Theo dõi và quản lý các đơn hàng bạn đã đặt mua.</p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-dark-900 border border-dark-700 rounded-2xl p-12 text-center shadow-glow-sm">
          <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-slate-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Chưa có đơn hàng nào</h2>
          <p className="text-slate-400 mb-6">Bạn chưa thực hiện bất kỳ giao dịch mua hàng nào.</p>
          <Link href="/products" className="inline-flex px-6 py-2.5 bg-gradient-to-r from-brand-600 to-accent-600 text-white font-medium rounded-xl hover:from-brand-500 hover:to-accent-500 transition-colors shadow-glow-sm">
            Bắt đầu mua sắm
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-dark-900 border border-dark-700 rounded-2xl p-6 shadow-glow-sm transition-all hover:border-dark-600">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-dark-700">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-slate-100">Mã đơn: #{order.orderNumber}</span>
                    {getStatusBadge(order.orderStatus ?? order.status ?? 'pending')}
                  </div>
                  <div className="text-sm text-slate-400 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> 
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">Tổng tiền</div>
                  <div className="text-xl font-bold text-brand-400">
                    {formatPrice(order.total ?? order.totalAmount ?? 0)}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-dark-800 rounded-lg overflow-hidden flex-shrink-0 border border-dark-700">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-slate-100 font-medium truncate">{item.name}</h4>
                      <p className="text-sm text-slate-400">Số lượng: {item.quantity} x {formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
