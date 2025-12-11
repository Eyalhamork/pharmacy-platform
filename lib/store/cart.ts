// File: lib/store/cart.ts
// Zustand store for shopping cart state management with localStorage persistence

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
  stock_quantity: number;
  requires_prescription: boolean;
  brand_name: string | null;
  generic_name: string | null;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  hasItem: (id: string) => boolean;
  getItem: (id: string) => CartItem | undefined;
  hasPrescriptionItems: () => boolean;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          
          if (existingItem) {
            // Update quantity if item already exists
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: Math.min(i.quantity + (item.quantity || 1), i.stock_quantity) }
                  : i
              ),
            };
          }
          
          // Add new item
          return {
            items: [...state.items, { ...item, quantity: item.quantity || 1 }],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.id !== id),
            };
          }

          return {
            items: state.items.map((item) =>
              item.id === id
                ? { ...item, quantity: Math.min(quantity, item.stock_quantity) }
                : item
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      hasItem: (id) => {
        return get().items.some((item) => item.id === id);
      },

      getItem: (id) => {
        return get().items.find((item) => item.id === id);
      },

      hasPrescriptionItems: () => {
        return get().items.some((item) => item.requires_prescription);
      },
    }),
    {
      name: 'pharmacy-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
