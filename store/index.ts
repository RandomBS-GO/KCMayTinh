/**
 * Zustand store for cart and UI state management
 */
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '@/types';
import toast from 'react-hot-toast';

// ==================== CART STORE ====================
interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find((i) => i.product._id === product._id);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.product._id === product._id
                ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                : i
            ),
          });
          toast.success(`Đã cập nhật số lượng ${product.name}`, {
            icon: '🛒',
          });
        } else {
          set({ items: [...items, { product, quantity }] });
          toast.success(`Đã thêm ${product.name} vào giỏ`, {
            icon: '✅',
          });
        }

        // Open cart after adding
        set({ isOpen: true });
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.product._id !== productId) });
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng', { icon: '🗑️' });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product._id === productId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    {
      name: 'techstore-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// ==================== COMPARE STORE ====================
interface CompareStore {
  products: Product[];
  isOpen: boolean;

  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  clearProducts: () => void;
  toggleCompare: () => void;
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  products: [],
  isOpen: false,

  addProduct: (product) => {
    const { products } = get();
    if (products.length >= 3) {
      toast.error('Chỉ có thể so sánh tối đa 3 sản phẩm!');
      return;
    }
    if (products.find((p) => p._id === product._id)) {
      toast.error('Sản phẩm đã có trong danh sách so sánh!');
      return;
    }
    set({ products: [...products, product], isOpen: true });
    toast.success('Đã thêm vào danh sách so sánh', { icon: '⚖️' });
  },

  removeProduct: (productId) => {
    const newProducts = get().products.filter((p) => p._id !== productId);
    set({ products: newProducts, isOpen: newProducts.length > 0 });
  },

  clearProducts: () => set({ products: [], isOpen: false }),

  toggleCompare: () => set({ isOpen: !get().isOpen }),
}));

// ==================== WISHLIST STORE ====================
interface WishlistStore {
  items: string[]; // product IDs
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggle: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        if (!get().items.includes(productId)) {
          set({ items: [...get().items, productId] });
          toast.success('Đã thêm vào danh sách yêu thích ❤️');
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((id) => id !== productId) });
        toast.success('Đã xóa khỏi danh sách yêu thích');
      },

      toggle: (productId) => {
        if (get().items.includes(productId)) {
          get().removeItem(productId);
        } else {
          get().addItem(productId);
        }
      },

      isWishlisted: (productId) => get().items.includes(productId),

      clearWishlist: () => {
        set({ items: [] });
        toast.success('Đã xóa tất cả danh sách yêu thích');
      },
    }),
    {
      name: 'techstore-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

