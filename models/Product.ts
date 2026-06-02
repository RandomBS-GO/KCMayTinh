/**
 * Product Mongoose Model
 * Full schema for all product types (laptop, PC, monitor, peripherals)
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  thumbnail: string;
  description: string;
  shortDescription: string;
  specs: {
    cpu?: string;
    gpu?: string;
    ram?: string;
    storage?: string;
    display?: string;
    battery?: string;
    os?: string;
    ports?: string[];
    weight?: string;
    refreshRate?: string;
    resolution?: string;
    panelType?: string;
    responseTime?: string;
    dpi?: string;
    buttons?: number;
    wireless?: boolean;
    switchType?: string;
    layout?: string;
    backlight?: string;
    driverSize?: string;
    frequency?: string;
    impedance?: string;
    microphone?: boolean;
    vram?: string;
    tdp?: string;
  };
  useCases: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  sold: number;
  featured: boolean;
  isNewProduct: boolean;
  isBestseller: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      required: true,
      enum: ['laptop', 'pc-gaming', 'monitor', 'mouse', 'keyboard', 'headset', 'component'],
      index: true,
    },
    brand: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    discount: { type: Number, min: 0, max: 100 },
    images: [{ type: String }],
    thumbnail: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    specs: {
      cpu: String,
      gpu: String,
      ram: String,
      storage: String,
      display: String,
      battery: String,
      os: String,
      ports: [String],
      weight: String,
      refreshRate: String,
      resolution: String,
      panelType: String,
      responseTime: String,
      dpi: String,
      buttons: Number,
      wireless: Boolean,
      switchType: String,
      layout: String,
      backlight: String,
      driverSize: String,
      frequency: String,
      impedance: String,
      microphone: Boolean,
      vram: String,
      tdp: String,
    },
    useCases: [{ type: String, enum: ['gaming', 'office', 'graphic', 'ai', 'student'] }],
    tags: [String],
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    stock: { type: Number, default: 50, min: 0 },
    sold: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    isNewProduct: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Text search index
ProductSchema.index({ name: 'text', description: 'text', tags: 'text', brand: 'text' });

// Compound index for filtering
ProductSchema.index({ category: 1, price: 1, rating: -1 });
ProductSchema.index({ featured: 1, isBestseller: 1 });

export const Product =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
