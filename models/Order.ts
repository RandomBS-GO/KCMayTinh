/**
 * Order Mongoose Model
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
  };
  items: Array<{
    productId: string;
    name: string;
    thumbnail: string;
    price: number;
    quantity: number;
    subtotal: number;
  }>;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  promoCode?: string;
  paymentMethod: 'cod' | 'bank' | 'momo' | 'vnpay';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
      default: () => 'TS' + Date.now().toString().slice(-8),
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        thumbnail: String,
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        subtotal: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    promoCode: String,
    paymentMethod: {
      type: String,
      enum: ['cod', 'bank', 'momo', 'vnpay'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'],
      default: 'pending',
    },
    trackingNumber: String,
    note: String,
  },
  { timestamps: true }
);

OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ 'customer.email': 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1, createdAt: -1 });

export const Order =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
