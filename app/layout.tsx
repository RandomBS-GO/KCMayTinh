import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: {
    default: 'TechStore AI – Mua Máy Tính Thông Minh với AI Tư Vấn',
    template: '%s | TechStore AI',
  },
  description:
    'Website bán máy tính laptop, PC Gaming, màn hình, linh kiện hàng đầu Việt Nam. AI tư vấn cấu hình phù hợp, so sánh sản phẩm, hỗ trợ ra quyết định mua hàng nhanh chóng.',
  keywords: [
    'laptop',
    'PC gaming',
    'máy tính',
    'linh kiện',
    'AI tư vấn',
    'mua máy tính',
    'laptop gaming',
    'laptop văn phòng',
  ],
  authors: [{ name: 'TechStore AI Team' }],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'http://localhost:3000', // Đổi thành domain thật của bạn sau khi deploy
    siteName: 'TechStore AI',
    title: 'TechStore AI – Mua Máy Tính Thông Minh với AI Tư Vấn',
    description: 'AI tư vấn cấu hình phù hợp, so sánh sản phẩm, hỗ trợ ra quyết định mua hàng',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechStore AI',
    description: 'AI tư vấn máy tính thông minh',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} bg-dark-950 text-slate-100 antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'toast-custom',
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  );
}
