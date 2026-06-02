'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success('Đăng ký thành công! Bạn sẽ nhận được ưu đãi sớm nhất 🎉');
    setEmail('');
  };

  return (
    <section className="section bg-dark-900/50 border-t border-dark-800">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 badge-purple mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Newsletter</span>
          </div>

          <h2 className="section-title mb-3">
            Nhận Ưu Đãi <span className="gradient-text">Độc Quyền</span>
          </h2>
          <p className="text-slate-400 mb-8">
            Đăng ký để nhận thông báo khuyến mãi, sản phẩm mới nhất và lời khuyên từ AI về máy tính phù hợp với bạn.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email của bạn..."
                  className="w-full pl-10 pr-4 py-3 input"
                  required
                />
              </div>
              <button type="submit" className="btn-primary whitespace-nowrap">
                Đăng ký
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-medium">
              <span>✅</span>
              <span>Đã đăng ký thành công!</span>
            </div>
          )}

          <p className="text-xs text-slate-600 mt-4">
            Không spam. Hủy đăng ký bất kỳ lúc nào. Chính sách bảo mật của chúng tôi.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
