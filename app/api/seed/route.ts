import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product } from '@/models/Product';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { ALL_PRODUCTS } from '@/lib/products-data';

// Map of real product image placeholders by brand/category
const BRAND_IMAGES: Record<string, string[]> = {
  'ASUS_laptop': [
    'https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/thumbnail.webp'
  ],
  'MSI_laptop': [
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500'
  ],
  'Lenovo_laptop': [
    'https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/thumbnail.webp'
  ],
  'Acer_laptop': [
    'https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/thumbnail.webp'
  ],
  'Dell_laptop': [
    'https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/thumbnail.webp'
  ],
  'Apple_laptop': [
    'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp'
  ],
  'LG_monitor': [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500'
  ],
  'Samsung_monitor': [
    'https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=500'
  ],
  'ASUS_monitor': [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500'
  ],
  'DELL_monitor': [
    'https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=500'
  ],
  'Logitech_mouse': [
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'
  ],
  'Razer_mouse': [
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c3c9c?w=500'
  ],
  'Akko_keyboard': [
    'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500'
  ],
  'Keychron_keyboard': [
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500'
  ],
  'HyperX_headset': [
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500'
  ],
  'SteelSeries_headset': [
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500'
  ]
};

export async function GET(request: Request) {
  try {
    await connectDB();

    // 1. Delete all existing data
    await Product.deleteMany({});
    await User.deleteMany({ email: 'Admin@gmail.com' });

    // 2. Create Admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    const admin = new User({
      name: 'Admin',
      email: 'Admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
    });
    await admin.save();

    // 3. Prepare products with better images
    const updatedProducts = ALL_PRODUCTS.map((product) => {
      const p = { ...product };
      // Try to find a matching image array
      const key = `${p.brand}_${p.category}`;
      if (BRAND_IMAGES[key] && BRAND_IMAGES[key].length > 0) {
        // Pick a random image from the brand/category array
        const img = BRAND_IMAGES[key][Math.floor(Math.random() * BRAND_IMAGES[key].length)];
        p.images = [img];
        p.thumbnail = img;
      }
      delete (p as any)._id; // Remove string _id to allow Mongoose to auto-generate ObjectId
      return p;
    });

    // 4. Insert products
    await Product.insertMany(updatedProducts);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      adminEmail: 'Admin@gmail.com',
      productsSeeded: updatedProducts.length,
    });
  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
