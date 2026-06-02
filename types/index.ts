// Types for the entire TechStore AI application

export type ProductCategory =
  | 'laptop'
  | 'pc-gaming'
  | 'monitor'
  | 'mouse'
  | 'keyboard'
  | 'headset'
  | 'component';

export type ProductUseCase = 'gaming' | 'office' | 'graphic' | 'ai' | 'student';

export type ProductBrand =
  | 'ASUS'
  | 'Acer'
  | 'Lenovo'
  | 'Dell'
  | 'HP'
  | 'MSI'
  | 'Apple'
  | 'LG'
  | 'Samsung'
  | 'Logitech'
  | 'Razer'
  | 'SteelSeries'
  | 'HyperX'
  | 'Corsair'
  | 'NVIDIA'
  | 'AMD'
  | 'Intel'
  | 'Gigabyte'
  | 'NZXT'
  | 'Cooler Master';

export interface ProductSpecs {
  cpu?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
  display?: string;
  battery?: string;
  os?: string;
  ports?: string[];
  weight?: string;
  dimensions?: string;
  // Monitor specific
  refreshRate?: string;
  resolution?: string;
  panelType?: string;
  responseTime?: string;
  // Mouse specific
  dpi?: string;
  buttons?: number;
  wireless?: boolean;
  // Keyboard specific
  switchType?: string;
  layout?: string;
  backlight?: string;
  // Headset specific
  driverSize?: string;
  frequency?: string;
  impedance?: string;
  microphone?: boolean;
  // Component specific
  vram?: string;
  tdp?: string;
  socket?: string;
  speed?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  brand: ProductBrand | string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  thumbnail: string;
  description: string;
  shortDescription: string;
  specs: ProductSpecs;
  useCases: ProductUseCase[];
  tags: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  sold: number;
  featured: boolean;
  isNewProduct: boolean;
  isBestseller: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  items: CartItem[];
  total: number;
  shippingFee: number;
  discount: number;
  paymentMethod: 'cod' | 'bank' | 'momo' | 'vnpay';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  product: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  pros: string[];
  cons: string[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  productCards?: ProductCard[];
}

export interface ProductCard {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  slug: string;
}

export interface FilterState {
  category: ProductCategory | 'all';
  brands: string[];
  priceRange: [number, number];
  useCases: ProductUseCase[];
  search: string;
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'bestseller';
  inStock: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}
