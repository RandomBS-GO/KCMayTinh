'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ShieldCheck, Truck, Headphones, BadgePercent,
  CheckCircle2, ArrowRight,
} from 'lucide-react';

const reasons = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: '100% Chính hãng',
    desc: 'Toàn bộ sản phẩm được nhập khẩu trực tiếp từ nhà sản xuất. Bao gồm hóa đơn VAT đầy đủ.',
    color: 'text-brand-400',
    bg:   'bg-brand-600/10',
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: 'Bảo hành 24 tháng',
    desc: 'Chính sách bảo hành toàn diện 24 tháng tại trung tâm bảo hành ủy quyền trên toàn quốc.',
    color: 'text-emerald-400',
    bg:   'bg-emerald-500/10',
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: 'Giao hàng nhanh',
    desc: 'Giao hàng trong ngày tại TP.HCM, Hà Nội. Toàn quốc 1–3 ngày. Miễn phí đơn từ 5 triệu.',
    color: 'text-amber-400',
    bg:   'bg-amber-500/10',
  },
  {
    icon: <Headphones className="w-6 h-6" />,
    title: 'Tư vấn chuyên sâu',
    desc: 'Đội ngũ kỹ thuật viên với 10+ năm kinh nghiệm tư vấn cấu hình, hỗ trợ 24/7.',
    color: 'text-accent-400',
    bg:   'bg-accent-600/10',
  },
  {
    icon: <BadgePercent className="w-6 h-6" />,
    title: 'Trả góp 0% lãi suất',
    desc: 'Hỗ trợ trả góp 0% qua 10+ ngân hàng và ví điện tử. Thủ tục đơn giản, duyệt nhanh.',
    color: 'text-rose-400',
    bg:   'bg-rose-500/10',
  },
  {
    icon: <CheckCircle2 className="w-6 h-6" />,
    title: 'Đổi trả trong 30 ngày',
    desc: 'Không hài lòng? Đổi trả miễn phí trong 30 ngày, không cần lý do. Hoàn tiền ngay.',
    color: 'text-cyan-400',
    bg:   'bg-cyan-500/10',
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="section bg-dark-950 border-y border-dark-900">
      <div className="container-custom">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 badge-brand mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cam kết của TechStore</span>
          </div>
          <h2 className="section-title">
            Tại Sao Chọn{' '}
            <span className="gradient-text">TechStore?</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto mt-4">
            Chúng tôi không chỉ bán sản phẩm — chúng tôi đồng hành cùng bạn từ lúc tư vấn đến sau khi mua hàng.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="card p-6 group hover:border-dark-700 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className={`w-11 h-11 ${item.bg} rounded-xl flex items-center justify-center mb-4 ${item.color} group-hover:scale-110 transition-transform duration-200`}>
                {item.icon}
              </div>
              <h3 className="font-display font-semibold text-dark-100 mb-2">{item.title}</h3>
              <p className="text-sm text-dark-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/products" className="btn-primary btn-lg gap-2 group">
            Khám phá sản phẩm
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
