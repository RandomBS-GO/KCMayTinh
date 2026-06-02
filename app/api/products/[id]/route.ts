/**
 * Single Product API Route
 * GET /api/products/[id] – Get product by ID or slug
 * PUT /api/products/[id] – Update product (admin)
 * DELETE /api/products/[id] – Delete product (admin)
 */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product as ProductModel } from '@/models/Product';
import { getProductById, getProductBySlug, ALL_PRODUCTS } from '@/lib/products-data';

const USE_MOCK = !process.env.MONGODB_URI || process.env.MONGODB_URI.includes('username:password');

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (USE_MOCK) {
      const product = getProductById(id) || getProductBySlug(id);
      if (!product) {
        return NextResponse.json({ success: false, error: 'Sản phẩm không tồn tại' }, { status: 404 });
      }

      // Get related products (same category)
      const related = ALL_PRODUCTS.filter(
        (p) => p._id !== product._id && p.category === product.category
      ).slice(0, 4);

      return NextResponse.json({ success: true, data: product, related });
    }

    await connectDB();

    // Try to find by ID or slug
    let product = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await ProductModel.findById(id).lean();
    }
    if (!product) {
      product = await ProductModel.findOne({ slug: id }).lean();
    }

    if (!product) {
      return NextResponse.json({ success: false, error: 'Sản phẩm không tồn tại' }, { status: 404 });
    }

    // Get related products
    const related = await ProductModel.find({
      _id: { $ne: (product as { _id: string })._id },
      category: (product as any).category,
    })
      .limit(4)
      .lean();

    return NextResponse.json({ success: true, data: product, related });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Lỗi server' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const product = await ProductModel.findByIdAndUpdate(params.id, body, { new: true });
    if (!product) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Lỗi cập nhật' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await ProductModel.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: 'Đã xóa sản phẩm' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Lỗi xóa sản phẩm' }, { status: 500 });
  }
}
