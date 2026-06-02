/**
 * Orders API Route
 * POST /api/orders – Create new order
 * GET /api/orders – List orders (admin)
 */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Order } from '@/models/Order';

// In-memory orders for mock mode
const mockOrders: unknown[] = [];

const USE_MOCK = !process.env.MONGODB_URI || process.env.MONGODB_URI.includes('username:password');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { customer, items, paymentMethod } = body;
    if (!customer?.name || !customer?.email || !customer?.phone || !items?.length) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin đặt hàng' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    );
    const shippingFee = subtotal >= 5_000_000 ? 0 : 50_000;
    const discount = body.discount || 0;
    const total = subtotal + shippingFee - discount;

    const orderNumber = 'TS' + Date.now().toString().slice(-8);

    const orderData = {
      orderNumber,
      customer,
      items: items.map((item: { productId: string; name: string; thumbnail?: string; price: number; quantity: number }) => ({
        productId: item.productId,
        name: item.name,
        thumbnail: item.thumbnail || '',
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      })),
      subtotal,
      shippingFee,
      discount,
      total,
      promoCode: body.promoCode,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      note: body.note,
      createdAt: new Date().toISOString(),
    };

    if (USE_MOCK) {
      mockOrders.push(orderData);

      // Trigger N8N webhook if configured
      if (process.env.N8N_WEBHOOK_URL) {
        fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event: 'new_order', order: orderData }),
        }).catch(() => {/* ignore N8N errors */});
      }

      return NextResponse.json({
        success: true,
        data: orderData,
        message: `Đặt hàng thành công! Mã đơn: ${orderNumber}`,
      }, { status: 201 });
    }

    await connectDB();
    const order = new Order(orderData);
    await order.save();

    return NextResponse.json({
      success: true,
      data: order,
      message: `Đặt hàng thành công! Mã đơn: ${order.orderNumber}`,
    }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi tạo đơn hàng' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    if (USE_MOCK) {
      return NextResponse.json({ success: true, data: mockOrders, total: mockOrders.length });
    }

    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({ success: true, data: orders, total: orders.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Lỗi khi tải đơn hàng' }, { status: 500 });
  }
}
