'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart, User, MapPin, CreditCard, CheckCircle2,
  ChevronRight, Truck, Shield, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: '🚚', desc: 'Trả tiền mặt khi nhận hàng' },
  { id: 'bank', label: 'Chuyển khoản ngân hàng', icon: '🏦', desc: 'VCB, Techcombank, MB Bank...' },
  { id: 'momo', label: 'Ví MoMo', icon: '📱', desc: 'Quét QR thanh toán nhanh' },
  { id: 'vnpay', label: 'VNPay QR', icon: '🔷', desc: 'Quét QR bằng app ngân hàng' },
];

const CITIES = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Nha Trang', 'Hải Phòng', 'Khác'];

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ orderNumber: string } | null>(null);

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'TP. Hồ Chí Minh',
    district: '',
    note: '',
  });

  const shippingFee = totalPrice >= 5_000_000 ? 0 : 50_000;
  const total = totalPrice + shippingFee;

  const handleCustomerChange = (field: string, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.name || !customer.email || !customer.phone || !customer.address) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (items.length === 0) {
      toast.error('Giỏ hàng trống!');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          items: items.map((item) => ({
            productId: item.product._id,
            name: item.product.name,
            thumbnail: item.product.thumbnail,
            price: item.product.price,
            quantity: item.quantity,
          })),
          paymentMethod,
          shippingFee,
          total,
          note: customer.note,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrderSuccess({ orderNumber: data.data.orderNumber });
        clearCart();
        setStep(3);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Lỗi khi đặt hàng. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-slate-300 mb-4">Giỏ hàng trống</h2>
        <Link href="/products" className="btn-primary">Mua sắm ngay</Link>
      </div>
    );
  }

  // Success state
  if (step === 3 && orderSuccess) {
    return (
      <div className="container-custom py-20 max-w-lg mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12 }}
        >
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>

          <h1 className="font-display text-3xl font-bold text-slate-100 mb-3">
            Đặt Hàng Thành Công! 🎉
          </h1>
          <p className="text-slate-400 mb-2">
            Mã đơn hàng của bạn:
          </p>
          <code className="text-xl font-bold font-mono text-cyan-400 bg-dark-800 px-4 py-2 rounded-xl border border-cyan-500/30">
            {orderSuccess.orderNumber}
          </code>

          <div className="mt-6 card p-5 rounded-2xl text-left space-y-3">
            <h3 className="font-semibold text-slate-200">Thông tin đơn hàng</h3>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Khách hàng:</span>
              <span className="text-slate-200">{customer.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Email:</span>
              <span className="text-slate-200">{customer.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Điện thoại:</span>
              <span className="text-slate-200">{customer.phone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Tổng tiền:</span>
              <span className="font-bold price-tag text-base">{formatPrice(total)}</span>
            </div>
          </div>

          <p className="text-sm text-slate-400 mt-4">
            📧 Email xác nhận đã được gửi đến <span className="text-cyan-400">{customer.email}</span>
          </p>
          <p className="text-sm text-slate-400 mt-1">
            📞 Chúng tôi sẽ liên hệ trong vòng 30 phút để xác nhận đơn hàng.
          </p>

          <div className="flex gap-3 mt-8">
            <Link href="/products" className="btn-primary flex-1">
              Tiếp tục mua sắm
            </Link>
            <Link href="/" className="btn-secondary flex-1">
              Về trang chủ
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-dark-900/50 border-b border-dark-800 py-6">
        <div className="container-custom">
          <h1 className="section-title">Thanh Toán</h1>

          {/* Progress steps */}
          <div className="flex items-center gap-4 mt-4">
            {[
              { num: 1, label: 'Thông tin' },
              { num: 2, label: 'Thanh toán' },
              { num: 3, label: 'Hoàn tất' },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  step >= s.num
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 border-transparent text-white'
                    : 'border-dark-600 text-slate-500'
                }`}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className={`text-sm ${step >= s.num ? 'text-slate-200' : 'text-slate-500'}`}>
                  {s.label}
                </span>
                {i < 2 && <ChevronRight className="w-4 h-4 text-slate-600" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Customer info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6 rounded-2xl space-y-5"
              >
                <h2 className="font-display font-bold text-xl text-slate-100 flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  Thông tin khách hàng
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Họ và tên *</label>
                    <input
                      type="text"
                      value={customer.name}
                      onChange={(e) => handleCustomerChange('name', e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Số điện thoại *</label>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => handleCustomerChange('phone', e.target.value)}
                      placeholder="0912 345 678"
                      className="input"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-slate-400 mb-1.5">Email *</label>
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(e) => handleCustomerChange('email', e.target.value)}
                      placeholder="email@example.com"
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Tỉnh/Thành phố *</label>
                    <select
                      value={customer.city}
                      onChange={(e) => handleCustomerChange('city', e.target.value)}
                      className="input"
                      required
                    >
                      {CITIES.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Quận/Huyện *</label>
                    <input
                      type="text"
                      value={customer.district}
                      onChange={(e) => handleCustomerChange('district', e.target.value)}
                      placeholder="Quận 1"
                      className="input"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-slate-400 mb-1.5">Địa chỉ cụ thể *</label>
                    <input
                      type="text"
                      value={customer.address}
                      onChange={(e) => handleCustomerChange('address', e.target.value)}
                      placeholder="Số nhà, tên đường, phường/xã"
                      className="input"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-slate-400 mb-1.5">Ghi chú (tùy chọn)</label>
                    <textarea
                      value={customer.note}
                      onChange={(e) => handleCustomerChange('note', e.target.value)}
                      placeholder="Ghi chú về đơn hàng, giao hàng ngoài giờ hành chính..."
                      className="input resize-none h-20"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-6 rounded-2xl space-y-4"
              >
                <h2 className="font-display font-bold text-xl text-slate-100 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  Phương thức thanh toán
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                        paymentMethod === method.id
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-dark-600 hover:border-dark-500'
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{method.label}</p>
                        <p className="text-xs text-slate-500">{method.desc}</p>
                      </div>
                      <div className={`ml-auto w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                        paymentMethod === method.id ? 'border-cyan-500 bg-cyan-500' : 'border-dark-500'
                      }`} />
                    </button>
                  ))}
                </div>

                {/* VNPay/MoMo QR mock */}
                {(paymentMethod === 'momo' || paymentMethod === 'vnpay') && (
                  <div className="p-4 bg-dark-900 rounded-xl border border-dark-600 text-center">
                    <p className="text-sm text-slate-400 mb-3">Quét mã QR để thanh toán</p>
                    <div className="w-32 h-32 bg-white rounded-lg mx-auto flex items-center justify-center text-xs text-dark-950">
                      [QR Code Demo]
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Số tiền: <span className="text-cyan-400 font-bold">{formatPrice(total)}</span></p>
                  </div>
                )}
              </motion.div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 text-lg gap-3"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Đang xử lý...</>
                ) : (
                  <>Xác Nhận Đặt Hàng ({formatPrice(total)})</>
                )}
              </button>
            </form>
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            <div className="card p-5 rounded-2xl sticky top-28">
              <h3 className="font-display font-bold text-lg text-slate-100 mb-4">
                Đơn hàng ({items.length} sản phẩm)
              </h3>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto scrollbar-hide">
                {items.map((item) => (
                  <div key={item.product._id} className="flex gap-3">
                    <div className="w-16 h-16 product-image-wrapper rounded-lg flex-shrink-0">
                      <img src={item.product.thumbnail} alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain p-1"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/1e293b/94a3b8?text=IMG'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 line-clamp-2 font-medium">{item.product.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-slate-500">x{item.quantity}</span>
                        <span className="text-sm font-bold price-tag">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dark-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Tạm tính</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Phí vận chuyển</span>
                  <span className={shippingFee === 0 ? 'text-emerald-400' : ''}>
                    {shippingFee === 0 ? 'Miễn phí 🎉' : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-dark-700">
                  <span className="text-slate-200">Tổng cộng</span>
                  <span className="price-tag">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="mt-4 space-y-2">
                {[
                  { icon: <Truck className="w-4 h-4" />, text: 'Giao hàng toàn quốc' },
                  { icon: <Shield className="w-4 h-4" />, text: 'Bảo hành 24 tháng' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="text-cyan-400">{item.icon}</div>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
