'use client';

import { motion } from 'framer-motion';
import { useChatStore } from '@/store';
import { Sparkles, Brain, MessageSquare, BarChart2, Target, ShoppingBag } from 'lucide-react';

const aiFeatures = [
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: 'Tư vấn thông minh',
    desc: 'Hỏi bất kỳ câu hỏi nào về sản phẩm',
    example: '"Laptop nào phù hợp học AI?"',
  },
  {
    icon: <BarChart2 className="w-5 h-5" />,
    title: 'So sánh cấu hình',
    desc: 'AI phân tích và so sánh chi tiết',
    example: '"RTX 4060 vs RTX 4070?"',
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: 'Gợi ý theo nhu cầu',
    desc: 'Tư vấn theo budget và mục đích',
    example: '"Laptop gaming dưới 20tr?"',
  },
  {
    icon: <ShoppingBag className="w-5 h-5" />,
    title: 'Hỗ trợ mua hàng',
    desc: 'Hướng dẫn thanh toán và bảo hành',
    example: '"Làm sao để trả góp 0%?"',
  },
];

const demoMessages = [
  { role: 'user', text: 'Tôi cần laptop gaming dưới 25 triệu, chơi được Valorant smooth 🎮' },
  { role: 'ai', text: 'Tôi recommend **ASUS ROG Strix G16** (27.9 triệu, có thể deal thêm) hoặc **Lenovo LOQ 15** (21.9 triệu).\n\n✅ RTX 4060 dư sức Valorant 240fps+\n✅ Màn 165Hz siêu mượt\n\nBạn ưu tiên budget hay hiệu năng cao hơn?' },
  { role: 'user', text: 'Ưu tiên giá tốt nhất, tầm 20tr thôi' },
  { role: 'ai', text: '**Lenovo LOQ 15ARP9** là lựa chọn hoàn hảo! 🏆\n\n💰 Giá: 21.9 triệu (sale 12%)\n🎮 RTX 4060 8GB + Ryzen 7\n📺 165Hz FHD không giật lag\n\nThêm vào giỏ để mua ngay nhé!' },
];

export default function AIAssistantSection() {
  const openChat = useChatStore((s) => s.openChat);

  return (
    <section className="section relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 via-dark-950 to-blue-950/30" />
      <div className="absolute inset-0 dot-bg opacity-20" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Info */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 badge-cyan mb-4">
                <Brain className="w-4 h-4" />
                <span>AI Hệ Hỗ Trợ Ra Quyết Định</span>
              </div>
              <h2 className="section-title">
                Mua Sắm Thông Minh
                <br />
                <span className="gradient-text">Cùng TechBot AI</span>
              </h2>
              <p className="text-slate-400 mt-4 leading-relaxed">
                TechBot AI sử dụng Google Gemini để tư vấn sản phẩm phù hợp nhất với nhu cầu và ngân sách của bạn. Không còn phân vân khi mua máy!
              </p>
            </motion.div>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-4">
              {aiFeatures.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="card p-4 rounded-2xl group hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-cyan-400 group-hover:scale-110 transition-transform">
                      {feat.icon}
                    </div>
                    <h4 className="font-semibold text-slate-200 text-sm">{feat.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{feat.desc}</p>
                  <code className="text-[11px] text-cyan-400 bg-dark-900/50 px-2 py-0.5 rounded-md">
                    {feat.example}
                  </code>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={openChat}
              className="btn-primary btn-lg gap-3 group"
            >
              <span className="text-2xl group-hover:animate-bounce-subtle">🤖</span>
              <span>Trò Chuyện Với TechBot Ngay</span>
              <Sparkles className="w-5 h-5" />
            </button>
          </div>

          {/* Right: Demo chat */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Chat window mockup */}
            <div className="glass-card rounded-3xl border border-cyan-500/20 overflow-hidden shadow-glow">
              {/* Chat header */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-b border-dark-700">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-glow-sm">
                  🤖
                </div>
                <div>
                  <p className="font-bold text-slate-100 text-sm">TechBot AI</p>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs text-emerald-400">Powered by Gemini</span>
                  </div>
                </div>
              </div>

              {/* Chat messages */}
              <div className="p-4 space-y-3 bg-dark-900/50">
                {demoMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                    className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-sm ${
                      msg.role === 'ai' ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : 'bg-dark-700'
                    }`}>
                      {msg.role === 'ai' ? '🤖' : '👤'}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-sm'
                        : 'bg-dark-800 text-slate-300 border border-dark-600 rounded-tl-sm'
                    }`}>
                      {msg.text.split('\n').map((line, li) => (
                        <p key={li} className={li > 0 ? 'mt-1' : ''}>
                          {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm">
                    🤖
                  </div>
                  <div className="bg-dark-800 border border-dark-600 rounded-2xl rounded-tl-sm px-3 py-2 flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="p-3 border-t border-dark-700 flex gap-2">
                <div className="flex-1 px-3 py-2 bg-dark-800 border border-dark-600 rounded-xl text-xs text-slate-500">
                  Hỏi TechBot về sản phẩm...
                </div>
                <button
                  onClick={openChat}
                  className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white"
                >
                  <span className="text-sm">→</span>
                </button>
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-4 bg-cyan-500/5 rounded-4xl blur-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
