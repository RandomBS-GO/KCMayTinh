const fs = require('fs');

const file = fs.readFileSync('lib/products-data.ts', 'utf8');

// The file has a MOCK_PRODUCTS array that ends with `];`
// We need to inject 56 products before the `];`
// Let's generate a string for 56 products.

const brands = ['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Gigabyte', 'Apple', 'LG', 'Samsung'];
const suffixes = ['Pro', 'Elite', 'Gaming', 'Studio', 'Creator', 'Max', 'Ultra', 'Plus', 'Air', 'OLED', 'Slim'];
const cpus = ['Intel Core i5-13400H', 'Intel Core i7-13700H', 'Intel Core i9-13900HX', 'AMD Ryzen 5 7600H', 'AMD Ryzen 7 7800H', 'AMD Ryzen 9 7940HS', 'Apple M3', 'Apple M3 Pro', 'Apple M3 Max'];
const gpus = ['RTX 4050 6GB', 'RTX 4060 8GB', 'RTX 4070 8GB', 'RTX 4080 12GB', 'RTX 4090 16GB', 'Intel Iris Xe', 'AMD Radeon 780M', 'Apple GPU 10-core', 'Apple GPU 18-core', 'Apple GPU 40-core'];
const rams = ['8GB DDR4', '16GB DDR5', '32GB DDR5', '64GB DDR5'];
const storages = ['512GB SSD PCIe Gen4', '1TB SSD PCIe Gen4', '2TB SSD PCIe Gen4'];

let generated = '';

for (let i = 45; i <= 100; i++) {
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const name = `${brand} ${suffix} ${2024 + Math.floor(Math.random() * 2)} Edition ${i}`;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  const price = 15000000 + Math.floor(Math.random() * 60000000);
  const discount = Math.floor(Math.random() * 20);
  const originalPrice = Math.floor(price * (1 + discount/100));
  
  const imgIndex = Math.floor(Math.random() * 6);
  
  const cpu = cpus[Math.floor(Math.random() * cpus.length)];
  const gpu = gpus[Math.floor(Math.random() * gpus.length)];
  
  const product = `  {
    _id: '${i}',
    name: '${name}',
    slug: '${slug}',
    category: 'laptop',
    brand: '${brand}',
    price: ${price},
    originalPrice: ${originalPrice},
    discount: ${discount},
    images: [img(laptopImages, ${imgIndex})],
    thumbnail: img(laptopImages, ${imgIndex}),
    shortDescription: 'Laptop ${brand} ${suffix} thế hệ mới với hiệu năng cực đỉnh, trang bị ${cpu} và ${gpu}',
    description: '${brand} ${suffix} mang lại trải nghiệm tuyệt vời cho mọi tác vụ từ làm việc, đồ họa đến giải trí. Trang bị cấu hình cực mạnh mẽ bao gồm ${cpu} cùng ${gpu}, máy đáp ứng tốt các tựa game AAA và phần mềm chuyên dụng.',
    specs: {
      cpu: '${cpu}',
      gpu: '${gpu}',
      ram: '${rams[Math.floor(Math.random() * rams.length)]}',
      storage: '${storages[Math.floor(Math.random() * storages.length)]}',
      display: '15.6" QHD 165Hz',
      battery: '70Wh',
      os: 'Windows 11 Home',
      ports: ['2x USB-C', '2x USB-A', 'HDMI 2.1', 'Jack 3.5mm'],
      weight: '1.8 kg',
    },
    useCases: ['gaming', 'office', 'graphic'],
    tags: ['laptop', '${brand.toLowerCase()}', 'gaming'],
    rating: ${(4 + Math.random()).toFixed(1)},
    reviewCount: ${Math.floor(Math.random() * 500)},
    stock: ${Math.floor(Math.random() * 50)},
    sold: ${Math.floor(Math.random() * 1000)},
    featured: ${Math.random() > 0.8},
    isNewProduct: ${Math.random() > 0.7},
    isBestseller: ${Math.random() > 0.8},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
`;
  generated += product;
}

// Find the last closing bracket of MOCK_PRODUCTS array
// Since MOCK_PRODUCTS is the only array exported like this, we can find the last `];`
const lastBracketIndex = file.lastIndexOf('];');

if (lastBracketIndex !== -1) {
  const newContent = file.substring(0, lastBracketIndex) + generated + file.substring(lastBracketIndex);
  fs.writeFileSync('lib/products-data.ts', newContent);
  console.log('Successfully added 56 products to lib/products-data.ts');
} else {
  console.error('Could not find ]; to inject products');
}
