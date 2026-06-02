'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import { Product } from '@/types';
import { ALL_PRODUCTS } from '@/lib/products-data';
import { formatPrice, getCategoryLabel } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    // In a real app, this would be an API call
    let filtered = [...ALL_PRODUCTS];
    
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }
    
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }
    
    setProducts(filtered);
  }, [search, category]);

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      // Optimistic UI update
      setProducts(products.filter(p => p._id !== id));
      toast.success('Đã xóa sản phẩm thành công');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-100">Quản lý Sản phẩm</h1>
          <p className="text-slate-400 text-sm mt-1">Quản lý danh sách sản phẩm, tồn kho và giá cả.</p>
        </div>
        <button className="btn-primary btn-sm gap-2 whitespace-nowrap">
          <Plus className="w-4 h-4" /> Thêm Sản Phẩm
        </button>
      </div>

      {/* Filters & Search */}
      <div className="card p-4 rounded-2xl flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, thương hiệu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 h-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input h-10 py-0 min-w-[150px]"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="laptop">Laptop</option>
            <option value="pc-gaming">PC Gaming</option>
            <option value="monitor">Màn hình</option>
            <option value="mouse">Chuột</option>
            <option value="keyboard">Bàn phím</option>
            <option value="headset">Tai nghe</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table w-full whitespace-nowrap">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Danh mục</th>
                <th>Thương hiệu</th>
                <th>Giá bán</th>
                <th>Tồn kho</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 15).map(product => (
                <tr key={product._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 product-image-wrapper rounded-lg flex-shrink-0">
                        <img 
                          src={product.thumbnail} 
                          alt={product.name}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x40/1e293b/94a3b8?text=IMG'; }}
                        />
                      </div>
                      <p className="text-sm font-medium text-slate-200 max-w-[200px] truncate" title={product.name}>
                        {product.name}
                      </p>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-dark-700 text-slate-300 border border-dark-600">
                      {getCategoryLabel(product.category)}
                    </span>
                  </td>
                  <td className="text-slate-300 text-sm">{product.brand}</td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-bold price-tag text-sm">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      product.stock > 10 ? 'badge-green' : 
                      product.stock > 0 ? 'badge-orange' : 'badge-red'
                    }`}>
                      {product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg bg-dark-700 text-slate-400 hover:text-cyan-400 hover:bg-dark-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="p-1.5 rounded-lg bg-dark-700 text-slate-400 hover:text-red-400 hover:bg-dark-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-dark-700 flex justify-between items-center text-sm text-slate-400">
          <span>Hiển thị 15 / {products.length} sản phẩm</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 bg-dark-700 rounded hover:bg-dark-600 transition-colors">Trước</button>
            <button className="px-3 py-1 bg-cyan-600 text-white rounded">1</button>
            <button className="px-3 py-1 bg-dark-700 rounded hover:bg-dark-600 transition-colors">2</button>
            <button className="px-3 py-1 bg-dark-700 rounded hover:bg-dark-600 transition-colors">3</button>
            <button className="px-3 py-1 bg-dark-700 rounded hover:bg-dark-600 transition-colors">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}
