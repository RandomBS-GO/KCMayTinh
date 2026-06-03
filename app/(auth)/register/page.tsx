"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { UserPlus, Mail, Lock, User as UserIcon, Phone } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    setIsLoading(true);
    try {
      const res  = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Đăng ký thành công! Đang đăng nhập...");
        await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });
        router.push("/");
        router.refresh();
      } else {
        toast.error(data.message || "Đăng ký thất bại.");
      }
    } catch {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-dark-950 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Về trang chủ">
            <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center shadow-glow-sm">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2.2">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <span className="font-display font-bold text-xl text-dark-50">
              Tech<span className="text-brand-400">Store</span>
            </span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-dark-50 mt-6">Tạo tài khoản mới</h1>
          <p className="text-dark-400 text-sm mt-1.5">Đăng ký để nhận ưu đãi thành viên độc quyền</p>
        </div>

        <div className="card p-7 space-y-5">

          {/* Google Sign-Up */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-dark-800 border border-dark-700 hover:border-dark-600 hover:bg-dark-700 text-dark-100 text-sm font-medium rounded-xl transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Đăng ký bằng Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-dark-800" />
            <span className="text-xs text-dark-600">hoặc điền thông tin</span>
            <div className="flex-1 border-t border-dark-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark-300 mb-1.5">Họ và tên</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  id="name" name="name" type="text" required
                  value={formData.name} onChange={handleChange}
                  className="input pl-10" placeholder="Nguyễn Văn A"
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-dark-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  id="reg-email" name="email" type="email" required
                  value={formData.email} onChange={handleChange}
                  className="input pl-10" placeholder="example@gmail.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-dark-300 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  id="reg-password" name="password" type="password" required minLength={6}
                  value={formData.password} onChange={handleChange}
                  className="input pl-10" placeholder="Ít nhất 6 ký tự"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-dark-300 mb-1.5">
                Số điện thoại <span className="text-dark-600 font-normal">(tùy chọn)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  id="phone" name="phone" type="tel"
                  value={formData.phone} onChange={handleChange}
                  className="input pl-10" placeholder="0901 234 567"
                  autoComplete="tel"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 mt-2 text-sm"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Tạo tài khoản
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-dark-600 text-center">
            Bằng cách đăng ký, bạn đồng ý với{" "}
            <Link href="/terms" className="text-brand-400 hover:underline">Điều khoản dịch vụ</Link>{" "}
            và{" "}
            <Link href="/privacy" className="text-brand-400 hover:underline">Chính sách bảo mật</Link>.
          </p>
        </div>

        <p className="text-center text-sm text-dark-500 mt-6">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
