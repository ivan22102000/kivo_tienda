import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useState } from 'react';
import { CartSidebar } from './cart-sidebar';

export function FloatingCart() {
  const { getCartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const cartCount = getCartCount();

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 relative"
          data-testid="button-floating-cart"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span 
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center"
              data-testid="text-cart-count"
            >
              {cartCount}
            </span>
          )}
        </Button>
      </div>
      
      <CartSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
