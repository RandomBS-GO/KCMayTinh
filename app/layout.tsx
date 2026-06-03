import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: {
    default: 'TechStore – Laptop, PC Gaming & Phụ Kiện Chính Hãng',
    template: '%s | TechStore',
  },
  description:
    'TechStore – Chuỗi bán lẻ công nghệ hàng đầu Việt Nam. Laptop, PC Gaming, màn hình, linh kiện chính hãng. Bảo hành 24 tháng, giao hàng nhanh, trả góp 0%.',
  keywords: [
    'laptop',
    'PC gaming',
    'máy tính',
    'linh kiện máy tính',
    'laptop gaming',
    'laptop văn phòng',
    'màn hình gaming',
    'mua laptop chính hãng',
    'techstore',
  ],
  authors: [{ name: 'TechStore Team' }],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://kc-may-tinh.vercel.app',
    siteName: 'TechStore',
    title: 'TechStore – Laptop, PC Gaming & Phụ Kiện Chính Hãng',
    description: 'Chuỗi bán lẻ công nghệ hàng đầu Việt Nam. Laptop, PC Gaming, linh kiện chính hãng.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechStore',
    description: 'Laptop, PC Gaming, linh kiện chính hãng – Bảo hành 24 tháng, giao hàng nhanh.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

import Providers from '@/components/Providers';

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
        <Providers>
          {children}
        </Providers>
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
