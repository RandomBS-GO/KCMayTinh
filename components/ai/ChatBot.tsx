'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Sparkles, RotateCcw, Minimize2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { useChatStore } from '@/store';
import { ChatMessage } from '@/types';
import { generateId } from '@/lib/utils';

// Quick question suggestions
const QUICK_QUESTIONS = [
  '💻 Laptop gaming dưới 20 triệu?',
  '🤖 Máy nào học AI tốt nhất?',
  '⚡ So sánh RTX 4060 vs RTX 4070',
  '📚 Laptop sinh viên giá tốt?',
  '🎮 PC gaming 30 triệu build gì?',
  '🖥️ Màn hình 4K gaming tốt nhất?',
];

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `Dạ em chào anh/chị ạ! 👋 Em là **Linh** - Nhân viên tư vấn của TechStore.
  
Anh/chị đang có nhu cầu tìm mua máy tính để học tập, làm việc hay chơi game ạ? 
Anh/chị cứ thoải mái chia sẻ nhu cầu và mức tài chính mong muốn, em sẽ rà soát kho hàng và tư vấn cho mình những mẫu máy phù hợp nhất và tiết kiệm nhất nhé! 😊`,
  timestamp: new Date(),
};

interface ChatBotProps {
  productContext?: {
    name: string;
    price: number;
    specs: Record<string, unknown>;
    category: string;
  };
}

export default function ChatBot({ productContext }: ChatBotProps) {
  const isOpen = useChatStore((s) => s.isOpen);
  const toggleChat = useChatStore((s) => s.toggleChat);
  const closeChat = useChatStore((s) => s.closeChat);

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          productContext,
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.response || 'Xin lỗi, tôi không thể trả lời lúc này. Vui lòng thử lại!',
        timestamp: new Date(),
        productCards: data.productCards,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: 'assistant',
          content: '⚠️ Đã có lỗi xảy ra. Vui lòng thử lại hoặc gọi hotline **1800-TECH-AI** để được hỗ trợ trực tiếp.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const resetChat = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="ai-chat-button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleChat}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-glow-lg flex flex-col items-center justify-center gap-0.5 group"
          >
            {/* Pulse rings */}
            <span className="absolute inset-0 rounded-2xl bg-cyan-500/30 animate-pulse-ring" />
            <span className="absolute inset-0 rounded-2xl bg-cyan-500/20 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />

            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" alt="Agent" className="w-8 h-8 rounded-full object-cover group-hover:animate-bounce-subtle border-2 border-cyan-400" />
            <span className="text-[9px] text-white/80 font-medium tracking-wide mt-1">HỖ TRỢ</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? 'auto' : undefined,
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-24px)] flex flex-col bg-dark-900 border border-dark-600 rounded-2xl shadow-2xl overflow-hidden"
            style={{ maxHeight: isMinimized ? '64px' : '600px' }}
          >
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-b border-dark-700 flex-shrink-0">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-glow-sm overflow-hidden p-0.5">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" alt="Agent" className="w-full h-full rounded-[10px] object-cover" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-dark-900 rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-sm text-slate-100">Tư vấn viên - Linh</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs text-emerald-400">Đang hoạt động</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={resetChat}
                  title="Bắt đầu chat mới"
                  className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={closeChat}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-sm ${
                        msg.role === 'assistant'
                          ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-glow-sm overflow-hidden p-[1px]'
                          : 'bg-dark-700'
                      }`}>
                        {msg.role === 'assistant' ? <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" alt="Agent" className="w-full h-full rounded-md object-cover" /> : <User className="w-4 h-4 text-slate-400" />}
                      </div>

                      {/* Bubble */}
                      <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                        <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-sm'
                            : 'bg-dark-800 text-slate-200 border border-dark-600 rounded-tl-sm'
                        }`}>
                          {msg.role === 'assistant' ? (
                            <ReactMarkdown
                              components={{
                                p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                                strong: ({ children }) => <strong className="font-semibold text-cyan-300">{children}</strong>,
                                ul: ({ children }) => <ul className="list-disc list-inside space-y-0.5 my-1">{children}</ul>,
                                li: ({ children }) => <li className="text-slate-300">{children}</li>,
                                code: ({ children }) => <code className="bg-dark-700 px-1 rounded text-xs font-mono text-cyan-400">{children}</code>,
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          ) : (
                            <p>{msg.content}</p>
                          )}
                        </div>

                        {/* Product cards from AI */}
                        {msg.productCards && msg.productCards.length > 0 && (
                          <div className="space-y-2 w-full">
                            {msg.productCards.map((card) => (
                              <Link
                                key={card.id}
                                href={`/products/${card.id}`}
                                className="flex items-center gap-2 p-2 bg-dark-800 border border-dark-600 hover:border-cyan-500/50 rounded-xl transition-all group"
                              >
                                <div className="w-12 h-12 flex-shrink-0 product-image-wrapper rounded-lg overflow-hidden">
                                  <img
                                    src={card.image}
                                    alt={card.name}
                                    className="w-full h-full object-contain p-1"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/1e293b/94a3b8?text=IMG';
                                    }}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-slate-200 group-hover:text-cyan-400 transition-colors line-clamp-1">
                                    {card.name}
                                  </p>
                                  <p className="text-xs price-tag font-bold">
                                    {new Intl.NumberFormat('vi-VN').format(card.price)} VND
                                  </p>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 flex-shrink-0" />
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  <AnimatePresence>
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm overflow-hidden p-[1px]">
                          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" alt="Agent" className="w-full h-full rounded-md object-cover" />
                        </div>
                        <div className="bg-dark-800 border border-dark-600 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                          {[0, 1, 2].map((i) => (
                            <span
                              key={i}
                              className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick questions */}
                {messages.length <= 1 && (
                  <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                    {QUICK_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="text-xs px-2.5 py-1.5 bg-dark-800 border border-dark-600 hover:border-cyan-500/50 hover:text-cyan-400 text-slate-400 rounded-lg transition-all whitespace-nowrap"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input form */}
                <form onSubmit={handleSubmit} className="p-3 border-t border-dark-700 flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nhập câu hỏi của bạn..."
                    disabled={isLoading}
                    className="flex-1 px-3 py-2.5 bg-dark-800 border border-dark-600 text-slate-200 placeholder-slate-500 rounded-xl text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white hover:shadow-glow transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Footer */}
                <div className="px-4 pb-3 text-center">
                  <p className="text-[10px] text-slate-600 flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Powered by Google Gemini AI
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
