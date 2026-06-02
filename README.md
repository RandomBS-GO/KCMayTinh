**TechStore AI** – Website Bán Máy Tính Thông Minh Tích Hợp AI

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini-4285F4)](https://aistudio.google.com)

## 🌟 Demo

> **Live Demo**: https://techstore-ai.vercel.app

## 📋 Giới Thiệu

TechStore AI là website bán máy tính thông minh tích hợp AI tư vấn mua hàng, giúp khách hàng ra quyết định nhanh và chính xác. Được xây dựng như một **startup product thực thụ** với đầy đủ tính năng:

- 🤖 **AI Chat Tư Vấn** powered by Google Gemini
- 🛒 **E-commerce hoàn chỉnh** với 100+ sản phẩm
- 📊 **Hệ hỗ trợ ra quyết định** thông minh
- 📱 **Responsive** mobile + desktop
- 🌙 **Dark mode** mặc định, đẹp hiện đại

## 🚀 Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Frontend + Backend | Next.js 14 (App Router + API Routes) |
| Language | TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| Database | MongoDB Atlas (với mock data fallback) |
| AI | Google Gemini 1.5 Flash |
| State | Zustand |
| Deploy | Vercel |

## ⚡ Cài Đặt Nhanh

### 1. Clone & Install

```bash
git clone https://github.com/your-username/techstore-ai.git
cd techstore-ai
npm install
```

### 2. Tạo file môi trường

```bash
cp .env.example .env.local
```

Chỉnh sửa `.env.local`:

```env
# Bắt buộc: Lấy miễn phí tại https://aistudio.google.com
GEMINI_API_KEY=your_key_here

# Tùy chọn: MongoDB Atlas (có mock data nếu không có)
MONGODB_URI=mongodb+srv://...
```

### 3. Chạy Development

```bash
npm run dev
```

Mở http://localhost:3000

## 🗄️ Database Setup (Tùy chọn)

Website chạy với **mock data** ngay mà không cần MongoDB. Để dùng MongoDB thực:

1. Tạo tài khoản [MongoDB Atlas](https://cloud.mongodb.com) (free)
2. Tạo cluster, lấy connection string
3. Điền vào `MONGODB_URI` trong `.env.local`
4. Chạy seed: `npm run seed`

## 🤖 AI Setup

1. Truy cập https://aistudio.google.com
2. Tạo API key miễn phí (15 req/min, 1M tokens/ngày)
3. Điền vào `GEMINI_API_KEY` trong `.env.local`

> ✅ **Không cần API key:** Website vẫn hoạt động với mock AI responses!

## 🚀 Deploy lên Vercel

### Cách 1: One-click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/techstore-ai)

### Cách 2: Manual

```bash
# Cài Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables trên Vercel dashboard
```

## 📁 Cấu Trúc Thư Mục

```
techstore-ai/
├── app/
│   ├── (shop)/           # Shop pages (layout với Header/Footer)
│   │   ├── page.tsx      # Trang chủ
│   │   ├── products/     # Danh sách & chi tiết sản phẩm
│   │   ├── checkout/     # Thanh toán
│   │   └── compare/      # So sánh sản phẩm
│   ├── (admin)/          # Admin dashboard
│   │   └── admin/
│   └── api/              # API Routes
│       ├── products/     # Products CRUD
│       ├── orders/       # Orders management
│       └── ai/chat/      # Gemini AI chat
├── components/
│   ├── layout/           # Header, Footer
│   ├── home/             # Trang chủ sections
│   ├── shop/             # ProductCard, CartDrawer, CompareBar
│   └── ai/               # ChatBot, ProductAI
├── lib/
│   ├── mongodb.ts        # DB connection
│   ├── gemini.ts         # AI client
│   └── products-data.ts  # Mock data (100 sản phẩm)
├── models/               # Mongoose models
├── store/                # Zustand state
└── types/                # TypeScript types
```

## 🌐 API Documentation

### Products

```http
GET /api/products                    # Danh sách sản phẩm
GET /api/products?category=laptop    # Lọc theo danh mục
GET /api/products?search=asus        # Tìm kiếm
GET /api/products?sortBy=price-asc   # Sắp xếp
GET /api/products/{id}               # Chi tiết sản phẩm
POST /api/products                   # Tạo sản phẩm (admin)
```

### Orders

```http
POST /api/orders         # Tạo đơn hàng
GET /api/orders          # Danh sách đơn hàng
```

### AI Chat

```http
POST /api/ai/chat
Body: {
  "message": "Laptop gaming dưới 20 triệu?",
  "history": [],
  "productContext": {...}  // optional
}
```

## 👥 Phân Chia Công Việc (2 thành viên)

| Thành viên | Phụ trách |
|------------|-----------|
| **Member 1** | Frontend UI (Trang chủ, sản phẩm, giỏ hàng), AI Chat Widget, Deploy Vercel |
| **Member 2** | Backend API, Database schema, Admin dashboard, N8N workflow, Báo cáo |

## 🔧 Commands

```bash
npm run dev      # Chạy development server
npm run build    # Build production
npm run start    # Chạy production server
npm run lint     # Kiểm tra code
npm run seed     # Seed database (cần MongoDB URI)
```

## 📊 N8N Workflow

Import file `n8n-workflows/techstore-ai-workflow.json` vào N8N Cloud:
- Trigger: Đơn hàng mới → Gửi email xác nhận
- Trigger: Chat AI → Xử lý và trả về kết quả
- Trigger: Khách hàng mới → Gửi welcome email

## 📝 License

MIT License – Đồ án môn Hệ Hỗ Trợ Ra Quyết Định

---

Made with ❤️ by TechStore AI Team | Powered by Next.js + Gemini AI
