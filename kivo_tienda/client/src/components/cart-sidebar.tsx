import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/context/cart-context';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cartItems, products, updateQuantity, removeFromCart, getCartTotal, clearCart, refreshCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [checkoutForm, setCheckoutForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
  });

  const cartTotal = getCartTotal();

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la cantidad",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      toast({
        title: "Producto eliminado",
        description: "El producto se eliminó del carrito",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      await apiRequest('POST', '/api/orders', checkoutForm);
      
      toast({
        title: "Pedido creado",
        description: "Tu pedido se ha creado exitosamente",
      });
      
      setShowCheckout(false);
      setCheckoutForm({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        shippingAddress: '',
      });
      onClose();
      await refreshCart();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el pedido",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showCheckout) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Finalizar Compra</SheetTitle>
          </SheetHeader>
          
          <form onSubmit={handleCheckout} className="space-y-4 mt-6">
            <div>
              <Label htmlFor="customerName">Nombre completo *</Label>
              <Input
                id="customerName"
                value={checkoutForm.customerName}
                onChange={(e) => setCheckoutForm(prev => ({ ...prev, customerName: e.target.value }))}
                required
                data-testid="input-customer-name"
              />
            </div>
            
            <div>
              <Label htmlFor="customerEmail">Correo electrónico *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={checkoutForm.customerEmail}
                onChange={(e) => setCheckoutForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                required
                data-testid="input-customer-email"
              />
            </div>
            
            <div>
              <Label htmlFor="customerPhone">Teléfono</Label>
              <Input
                id="customerPhone"
                value={checkoutForm.customerPhone}
                onChange={(e) => setCheckoutForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                data-testid="input-customer-phone"
              />
            </div>
            
            <div>
              <Label htmlFor="shippingAddress">Dirección de envío *</Label>
              <Textarea
                id="shippingAddress"
                value={checkoutForm.shippingAddress}
                onChange={(e) => setCheckoutForm(prev => ({ ...prev, shippingAddress: e.target.value }))}
                required
                data-testid="textarea-shipping-address"
              />
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span data-testid="text-checkout-total">
                  ${cartTotal.toLocaleString('es-MX')}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCheckout(false)}
                className="flex-1"
                data-testid="button-back-to-cart"
              >
                Volver al Carrito
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
                data-testid="button-place-order"
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Carrito de Compras</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto mt-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500" data-testid="text-empty-cart">
                Tu carrito está vacío
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const product = products.find(p => p.id === item.productId);
                if (!product) return null;

                return (
                  <div 
                    key={item.id} 
                    className="flex items-center space-x-4 border-b pb-4"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                      data-testid={`img-cart-item-${item.id}`}
                    />
                    <div className="flex-1">
                      <h4 
                        className="font-medium"
                        data-testid={`text-cart-item-name-${item.id}`}
                      >
                        {product.name}
                      </h4>
                      <p 
                        className="text-sm text-gray-500"
                        data-testid={`text-cart-item-price-${item.id}`}
                      >
                        ${parseFloat(product.price).toLocaleString('es-MX')}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span 
                          className="px-3 py-1 text-sm"
                          data-testid={`text-quantity-${item.id}`}
                        >
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveItem(item.id)}
                          data-testid={`button-remove-${item.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span data-testid="text-cart-total">
                ${cartTotal.toLocaleString('es-MX')}
              </span>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={clearCart}
                className="flex-1"
                data-testid="button-clear-cart"
              >
                Vaciar Carrito
              </Button>
              <Button
                onClick={() => setShowCheckout(true)}
                className="flex-1"
                data-testid="button-checkout"
              >
                Finalizar Compra
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
