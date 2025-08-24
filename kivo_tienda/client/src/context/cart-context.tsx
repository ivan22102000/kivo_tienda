import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@shared/schema';
import { useAuth } from './auth-context';
import { apiRequest } from '@/lib/queryClient';

interface CartContextType {
  cartItems: CartItem[];
  products: Product[];
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      refreshCart();
      fetchProducts();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const refreshCart = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) throw new Error('Usuario no autenticado');
    
    await apiRequest('POST', '/api/cart', { productId, quantity });
    await refreshCart();
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) throw new Error('Usuario no autenticado');
    
    await apiRequest('PATCH', `/api/cart/${itemId}`, { quantity });
    await refreshCart();
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) throw new Error('Usuario no autenticado');
    
    await apiRequest('DELETE', `/api/cart/${itemId}`);
    await refreshCart();
  };

  const clearCart = async () => {
    if (!user) throw new Error('Usuario no autenticado');
    
    await apiRequest('DELETE', '/api/cart');
    await refreshCart();
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product ? parseFloat(product.price) * item.quantity : 0);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      products,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartCount,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
