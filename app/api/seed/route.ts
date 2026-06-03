import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product } from '@/models/Product';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { ALL_PRODUCTS } from '@/lib/products-data';

// Map of real product image placeholders by brand/category
const BRAND_IMAGES: Record<string, string[]> = {
  'ASUS_laptop': [
    'https://dlcdnwebimgs.asus.com/gain/97E259EB-41BD-4428-AB01-B73307BCF5A0/w240/h175',
    'https://dlcdnwebimgs.asus.com/gain/D20D64EA-E526-4EDC-A20D-1BFE9D4AECE8/w240/h175'
  ],
  'MSI_laptop': [
    'https://asset.msi.com/resize/image/global/product/product_16727282216fdffb272337d110f96894da066b1d4e.png62405b38c58fe0f07fcef2367d8a9ba1/400.png',
    'https://asset.msi.com/resize/image/global/product/product_1642491176bc5a58fa49d63c469b27521ab299ebf4.png62405b38c58fe0f07fcef2367d8a9ba1/400.png'
  ],
  'Lenovo_laptop': [
    'https://p3-ofp.static.pub//fes/cms/2023/12/15/4xydy4ep233tyff9v1q6mnh223n09a473215.png',
    'https://p3-ofp.static.pub/ShareResource/na/products/legion/400x300/lenovo-legion-pro-7-gen-8-16-inch-amd.png'
  ],
  'Acer_laptop': [
    'https://images.acer.com/is/image/acer/Predator-Helios-18-PH18-71-AG-Black-01a-1?$Product-Cards-XL$',
    'https://images.acer.com/is/image/acer/Predator-Helios-Neo-16-PHN16-72-Black-01a-1?$Product-Cards-XL$'
  ],
  'Dell_laptop': [
    'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/alienware-notebooks/alienware-m18-r2/media-gallery/awm18-r2-black-gallery-3.png?fmt=png-alpha&wid=800&hei=600',
    'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/alienware-notebooks/alienware-x16-r2/media-gallery/awx16-r2-lunar-silver-gallery-1.png?fmt=png-alpha&wid=800&hei=600'
  ],
  'Apple_laptop': [
    'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697230830200',
  ],
  'LG_monitor': [
    'https://www.lg.com/vn/images/man-hinh-may-tinh/md07567789/gallery/D-01.jpg'
  ],
  'Samsung_monitor': [
    'https://images.samsung.com/is/image/samsung/p6pim/vn/ls49cg954eexxv/gallery/vn-odyssey-oled-g9-g95sc-467262-ls49cg954eexxv-537446450?$650_519_PNG$'
  ],
  'ASUS_monitor': [
    'https://dlcdnwebimgs.asus.com/gain/B5C953DB-CA3E-448A-9FF3-1ADDF8097CFA/w240/h175'
  ],
  'DELL_monitor': [
    'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/alienware/aw3225qf/media-gallery/aw3225qf-black-gallery-1.png?fmt=png-alpha&wid=800&hei=600'
  ],
  'Logitech_mouse': [
    'https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight-2/gallery-1-pro-x-superlight-2-magenta.png?v=1'
  ],
  'Razer_mouse': [
    'https://assets2.razerzone.com/images/pnx.assets/e3d0979becc80ce94d2f0eb3a77a940f/razer-deathadder-v3-pro-white-500x500.png'
  ],
  'Akko_keyboard': [
    'https://en.akkogear.com/wp-content/uploads/2023/11/MOD007B-HE-1.png'
  ],
  'Keychron_keyboard': [
    'https://www.keychron.com/cdn/shop/files/Keychron-Q1-Max-QMK-VIA-Wireless-Custom-Mechanical-Keyboard-Carbon-Black.png'
  ],
  'HyperX_headset': [
    'https://row.hyperx.com/cdn/shop/files/hyperx_cloud_iii_wireless_black_1_main_1024x1024.jpg'
  ],
  'SteelSeries_headset': [
    'https://media.steelseriescdn.com/thumbs/catalogue/products/00969-arctis-nova-pro-wireless-xbox/bb6ba202118349cb86efd0319efb0981.png.500x400_q100_crop-fit_optimize.png'
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
