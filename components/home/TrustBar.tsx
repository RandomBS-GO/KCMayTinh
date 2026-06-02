'use client';

import { Truck, Shield, RotateCcw, CreditCard, Headphones, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const trustItems = [
  { icon: <Truck className="w-5 h-5" />, title: 'Miễn phí vận chuyển', desc: 'Đơn từ 5 triệu', color: 'text-cyan-400' },
  { icon: <Shield className="w-5 h-5" />, title: 'Bảo hành chính hãng', desc: '12-24 tháng', color: 'text-blue-400' },
  { icon: <RotateCcw className="w-5 h-5" />, title: 'Đổi trả dễ dàng', desc: '30 ngày', color: 'text-emerald-400' },
  { icon: <CreditCard className="w-5 h-5" />, title: 'Trả góp 0%', desc: '12 tháng qua thẻ', color: 'text-purple-400' },
  { icon: <Headphones className="w-5 h-5" />, title: 'Hỗ trợ 24/7', desc: 'AI + Nhân viên', color: 'text-orange-400' },
  { icon: <Zap className="w-5 h-5" />, title: 'Giao hàng nhanh', desc: 'TP.HCM & Hà Nội', color: 'text-yellow-400' },
];

export default function TrustBar() {
  return (
    <section className="bg-dark-900/50 border-y border-dark-800 py-6">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 group"
            >
              <div className={`flex-shrink-0 ${item.color} group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">{item.title}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
