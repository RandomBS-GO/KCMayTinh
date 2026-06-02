import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price to Vietnamese currency format
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format price as short form (e.g., 25.9tr, 1.2tỷ)
 */
export function formatPriceShort(price: number): string {
  if (price >= 1_000_000_000) {
    return `${(price / 1_000_000_000).toFixed(1)} tỷ`;
  }
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(1)} triệu`;
  }
  return formatPrice(price);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100);
}

/**
 * Generate product slug from name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Truncate text to a specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Format rating to display stars
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Get category label in Vietnamese
 */
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'laptop': 'Laptop',
    'pc-gaming': 'PC Gaming',
    'monitor': 'Màn hình',
    'mouse': 'Chuột',
    'keyboard': 'Bàn phím',
    'headset': 'Tai nghe',
    'component': 'Linh kiện',
    'all': 'Tất cả',
  };
  return labels[category] || category;
}

/**
 * Get use case label in Vietnamese
 */
export function getUseCaseLabel(useCase: string): string {
  const labels: Record<string, string> = {
    'gaming': 'Gaming',
    'office': 'Văn phòng',
    'graphic': 'Đồ họa',
    'ai': 'AI/Machine Learning',
    'student': 'Sinh viên',
  };
  return labels[useCase] || useCase;
}

/**
 * Get use case icon
 */
export function getUseCaseIcon(useCase: string): string {
  const icons: Record<string, string> = {
    'gaming': '🎮',
    'office': '💼',
    'graphic': '🎨',
    'ai': '🤖',
    'student': '📚',
  };
  return icons[useCase] || '💻';
}

/**
 * Get category icon
 */
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'laptop': '💻',
    'pc-gaming': '🖥️',
    'monitor': '🖥️',
    'mouse': '🖱️',
    'keyboard': '⌨️',
    'headset': '🎧',
    'component': '⚙️',
  };
  return icons[category] || '📦';
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Format date to Vietnamese format
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * Get payment method label
 */
export function getPaymentLabel(method: string): string {
  const labels: Record<string, string> = {
    'cod': 'Thanh toán khi nhận hàng',
    'bank': 'Chuyển khoản ngân hàng',
    'momo': 'Ví MoMo',
    'vnpay': 'VNPay QR',
  };
  return labels[method] || method;
}

/**
 * Get order status label
 */
export function getOrderStatusLabel(status: string): { label: string; color: string } {
  const statuses: Record<string, { label: string; color: string }> = {
    'pending': { label: 'Chờ xác nhận', color: 'orange' },
    'confirmed': { label: 'Đã xác nhận', color: 'blue' },
    'shipping': { label: 'Đang giao hàng', color: 'cyan' },
    'delivered': { label: 'Đã giao hàng', color: 'green' },
    'cancelled': { label: 'Đã hủy', color: 'red' },
  };
  return statuses[status] || { label: status, color: 'gray' };
}
