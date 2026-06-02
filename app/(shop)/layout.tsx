import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/shop/CartDrawer';
import ChatBot from '@/components/ai/ChatBot';
import CompareBar from '@/components/shop/CompareBar';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
      <ChatBot />
      <CompareBar />
    </>
  );
}
