import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BannerPromo from '@/components/home/BannerPromo';
import BestsellerProducts from '@/components/home/BestsellerProducts';
import WhyChooseUsSection from '@/components/home/AIAssistantSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export const metadata: Metadata = {
  title: 'TechStore – Laptop, PC Gaming & Phụ Kiện Chính Hãng Hàng Đầu Việt Nam',
  description:
    'Mua laptop, PC gaming, màn hình, linh kiện với giá tốt nhất. Bảo hành 24 tháng chính hãng, giao hàng nhanh, trả góp 0% lãi suất.',
};

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <BannerPromo />
      <BestsellerProducts />
      <WhyChooseUsSection />
      <NewsletterSection />
    </div>
  );
}
