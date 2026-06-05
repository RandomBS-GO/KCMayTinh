import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Order } from '@/models/Order';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Allow updating paymentStatus, orderStatus
    const updateData: any = {};
    if (body.paymentStatus) updateData.paymentStatus = body.paymentStatus;
    if (body.orderStatus) updateData.orderStatus = body.orderStatus;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: false, error: 'Không có dữ liệu cập nhật' }, { status: 400 });
    }

    const order = await Order.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ success: false, error: 'Lỗi khi cập nhật đơn hàng' }, { status: 500 });
  }
}
