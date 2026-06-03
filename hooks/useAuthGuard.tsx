'use client';

/**
 * useAuthGuard — bảo vệ các hành động yêu cầu đăng nhập
 * 
 * Sử dụng trong ProductCard, CartDrawer, WishlistPage...
 * Nếu chưa đăng nhập → hiển thị toast với link đăng nhập
 * và trả về `false` để component biết mà không thực hiện action.
 */
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export function useAuthGuard() {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  const isLoggedIn = !!session;

  /**
   * Gọi trước khi thực hiện action cần đăng nhập.
   * @returns `true` nếu đã đăng nhập, `false` nếu chưa (và hiện toast)
   */
  const requireAuth = (actionLabel = 'thực hiện hành động này'): boolean => {
    if (isLoading) return false;

    if (!isLoggedIn) {
      toast(
        (t) => (
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-dark-100">
              Vui lòng đăng nhập để {actionLabel}
            </p>
            <div className="flex gap-2 mt-1">
              <Link
                href="/login"
                onClick={() => toast.dismiss(t.id)}
                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                onClick={() => toast.dismiss(t.id)}
                className="px-3 py-1.5 bg-dark-700 hover:bg-dark-600 text-dark-200 text-xs font-medium rounded-lg transition-colors"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        ),
        {
          icon: '🔒',
          duration: 4000,
          style: {
            background: '#18181b',
            border: '1px solid #27272a',
            color: '#fafafa',
          },
        }
      );
      return false;
    }

    return true;
  };

  return { isLoggedIn, isLoading, requireAuth };
}
