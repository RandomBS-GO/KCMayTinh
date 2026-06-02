/**
 * Products API Route
 * GET /api/products – List products with filtering, sorting, pagination
 * POST /api/products – Create new product (admin only)
 */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product } from '@/models/Product';
import {
  ALL_PRODUCTS,
  getProductsByCategory,
  searchProducts,
  getFeaturedProducts,
  getBestsellerProducts,
  getNewProducts,
} from '@/lib/products-data';

// Use mock data in development if no MongoDB URI
const USE_MOCK = !process.env.MONGODB_URI || process.env.MONGODB_URI.includes('username:password');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || '';
    const brand = searchParams.get('brand') || '';
    const minPrice = parseInt(searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '999999999');
    const useCase = searchParams.get('useCase') || '';
    const sortBy = searchParams.get('sortBy') || 'featured';
    const featured = searchParams.get('featured') === 'true';
    const bestseller = searchParams.get('bestseller') === 'true';
    const isNew = searchParams.get('isNew') === 'true';

    if (USE_MOCK) {
      // Use mock data
      let products = [...ALL_PRODUCTS];

      if (featured) products = getFeaturedProducts();
      else if (bestseller) products = getBestsellerProducts();
      else if (isNew) products = getNewProducts();
      else {
        if (search) products = searchProducts(search);
        else if (category !== 'all') products = getProductsByCategory(category);
      }

      // Filter by brand
      if (brand) {
        const brands = brand.split(',');
        products = products.filter((p) => brands.includes(p.brand));
      }

      // Filter by price
      products = products.filter((p) => p.price >= minPrice && p.price <= maxPrice);

      // Filter by use case
      if (useCase) {
        const useCases = useCase.split(',');
        products = products.filter((p) =>
          p.useCases.some((uc) => useCases.includes(uc))
        );
      }

      // Sort
      switch (sortBy) {
        case 'price-asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          products.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'bestseller':
          products.sort((a, b) => b.sold - a.sold);
          break;
        default:
          products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      }

      // Pagination
      const total = products.length;
      const paginatedProducts = products.slice((page - 1) * limit, page * limit);

      return NextResponse.json({
        success: true,
        data: paginatedProducts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    }

    // MongoDB mode
    await connectDB();

    const query: Record<string, unknown> = {};

    if (category !== 'all') query.category = category;
    if (brand) query.brand = { $in: brand.split(',') };
    if (featured) query.featured = true;
    if (bestseller) query.isBestseller = true;
    if (isNew) query.isNew = true;
    if (useCase) query.useCases = { $in: useCase.split(',') };
    if (minPrice || maxPrice < 999999999) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    }
    if (search) {
      query.$text = { $search: search };
    }

    const sortOptions: Record<string, 1 | -1> = {};
    switch (sortBy) {
      case 'price-asc': sortOptions.price = 1; break;
      case 'price-desc': sortOptions.price = -1; break;
      case 'rating': sortOptions.rating = -1; break;
      case 'newest': sortOptions.createdAt = -1; break;
      case 'bestseller': sortOptions.sold = -1; break;
      default: sortOptions.featured = -1; sortOptions.rating = -1;
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi tải sản phẩm' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Basic auth check
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const product = new Product(body);
    await product.save();

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Lỗi khi tạo sản phẩm' }, { status: 500 });
  }
}
