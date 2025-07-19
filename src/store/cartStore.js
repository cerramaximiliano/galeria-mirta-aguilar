import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (artwork) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === artwork.id);
        
        if (existingItem) {
          return;
        }
        
        set({ items: [...currentItems, { ...artwork, quantity: 1 }] });
      },
      removeFromCart: (id) => {
        set({ items: get().items.filter(item => item.id !== id) });
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;