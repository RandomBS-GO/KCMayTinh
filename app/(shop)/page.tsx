import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BannerPromo from '@/components/home/BannerPromo';
import BestsellerProducts from '@/components/home/BestsellerProducts';
import AIAssistantSection from '@/components/home/AIAssistantSection';
import TrustBar from '@/components/home/TrustBar';
import NewsletterSection from '@/components/home/NewsletterSection';

export const metadata: Metadata = {
  title: 'TechStore AI – Website Bán Máy Tính Thông Minh Hàng Đầu Việt Nam',
  description:
    'Mua laptop, PC gaming, màn hình, linh kiện với giá tốt nhất. AI tư vấn cấu hình phù hợp, so sánh sản phẩm, hỗ trợ ra quyết định mua hàng nhanh chóng.',
};

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <TrustBar />
      <CategorySection />
      <FeaturedProducts />
      <BannerPromo />
      <BestsellerProducts />
      <AIAssistantSection />
      <NewsletterSection />
    </div>
  );
}
