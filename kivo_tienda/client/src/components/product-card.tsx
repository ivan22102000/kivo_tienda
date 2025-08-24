import { Product } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  category?: { name: string; icon?: string };
}

export function ProductCard({ product, category }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar productos al carrito",
        variant: "destructive",
      });
      return;
    }

    try {
      await addToCart(product.id);
      toast({
        title: "Producto agregado",
        description: `${product.name} se agregó al carrito`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el producto al carrito",
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
      data-testid={`card-product-${product.id}`}
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        data-testid={`img-product-${product.id}`}
      />
      <div className="p-4">
        {category && (
          <Badge 
            variant="secondary" 
            className="mb-2"
            data-testid={`badge-category-${product.id}`}
          >
            {category.icon} {category.name}
          </Badge>
        )}
        <h3 
          className="font-semibold text-gray-900 mb-2"
          data-testid={`text-name-${product.id}`}
        >
          {product.name}
        </h3>
        <p 
          className="text-gray-600 text-sm mb-3"
          data-testid={`text-description-${product.id}`}
        >
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span 
            className="text-2xl font-bold text-primary"
            data-testid={`text-price-${product.id}`}
          >
            ${parseFloat(product.price).toLocaleString('es-MX')}
          </span>
          <Button
            onClick={handleAddToCart}
            className="bg-primary hover:bg-primary/90 text-white transition-colors duration-300 transform hover:scale-105"
            data-testid={`button-add-cart-${product.id}`}
          >
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
}
