"use client";

import { useSession } from "next-auth/react";
import { User, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="min-h-screen pt-24 pb-12 flex justify-center items-center text-cyan-400">Đang tải...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-slate-100">Vui lòng đăng nhập</h1>
        <Link href="/login" className="mt-4 px-6 py-2 bg-cyan-500 text-white rounded-lg">Đăng nhập ngay</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-display font-bold text-slate-100 mb-8">Tài khoản của tôi</h1>
      
      <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6 md:p-8 shadow-glow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-8 border-b border-dark-700">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-glow-sm">
            {session?.user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-100">{session?.user?.name}</h2>
            <p className="text-slate-400 mt-1 flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4" /> {session?.user?.email}
            </p>
            <span className="inline-block mt-3 px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-medium">
              Thành viên TechStore
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" /> Thông tin cá nhân
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Họ và tên</label>
                <div className="px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-slate-100">
                  {session?.user?.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                <div className="px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-slate-100">
                  {session?.user?.email}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" /> Địa chỉ giao hàng
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1"><Phone className="w-4 h-4"/> Số điện thoại</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-slate-100 focus:border-cyan-500 outline-none" 
                  placeholder="Chưa cập nhật"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1"><MapPin className="w-4 h-4"/> Địa chỉ</label>
                <textarea 
                  className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-slate-100 focus:border-cyan-500 outline-none resize-none h-24" 
                  placeholder="Chưa cập nhật địa chỉ giao hàng"
                  disabled
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-dark-700 flex justify-end">
          <button className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-colors shadow-glow-sm">
            Lưu thay đổi (Sắp ra mắt)
          </button>
        </div>
      </div>
    </div>
  );
}
