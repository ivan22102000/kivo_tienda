import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product, Category } from '@shared/schema';
import { 
  Smartphone, 
  Shirt, 
  Home, 
  ShoppingCart, 
  Shield, 
  Zap, 
  Heart,
  Star
} from 'lucide-react';

export function HomePage() {
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const categoryIcons = {
    'Electrónicos': <Smartphone className="w-8 h-8 text-blue-600" />,
    'Ropa': <Shirt className="w-8 h-8 text-pink-600" />,
    'Hogar': <Home className="w-8 h-8 text-green-600" />,
    'Abarrotes': <ShoppingCart className="w-8 h-8 text-orange-600" />,
  };

  const featuredProducts = products.slice(0, 8);

  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="primary-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                KIVO
                <span className="text-yellow-300"> - Justo lo que necesitas</span>
              </h1>
              <p className="text-xl mb-8 text-purple-100">
                KIVO - Justo lo que necesitas. Electrónica, ropa, hogar y más.
                Envío gratis en compras superiores a $500.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-white text-primary hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold transition-colors duration-300 transform hover:scale-105"
                  onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="button-view-catalog"
                >
                  Ver Catálogo
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-lg font-semibold transition-all duration-300"
                  onClick={() => document.getElementById('ofertas')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="button-offers"
                >
                  Ofertas del Día
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Dispositivos tecnológicos modernos"
                className="rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                data-testid="img-hero-devices"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Explora por Categorías
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                data-testid={`category-card-${category.id}`}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                  {categoryIcons[category.name as keyof typeof categoryIcons] || (
                    <ShoppingCart className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <section id="catalogo" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Productos Destacados</h2>
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              Ver todos →
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const category = categories.find(cat => cat.id === product.categoryId);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  category={category}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section id="ofertas" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Ofertas Especiales
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Flash Sale */}
            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl p-8 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">¡Flash Sale!</h3>
                <p className="text-lg mb-6">
                  Hasta 70% de descuento en electrónicos seleccionados
                </p>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm">Horas</div>
                  </div>
                  <div className="text-2xl">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">34</div>
                    <div className="text-sm">Min</div>
                  </div>
                  <div className="text-2xl">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">56</div>
                    <div className="text-sm">Seg</div>
                  </div>
                </div>
                <Button className="bg-white text-red-600 hover:bg-gray-100">
                  Ver Ofertas
                </Button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
            </div>

            {/* Free Shipping */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-8 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Envío Gratis</h3>
                <p className="text-lg mb-6">
                  En compras superiores a $500 pesos a todo México
                </p>
                <div className="flex items-center mb-6">
                  <Shield className="w-8 h-8 mr-3" />
                  <span className="text-lg">Válido por tiempo limitado</span>
                </div>
                <Button className="bg-white text-green-600 hover:bg-gray-100">
                  Comprar Ahora
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-12 translate-y-12"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Por qué elegir KIVO?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Compra Segura
              </h3>
              <p className="text-gray-600">
                Protección total en tus datos y transacciones con encriptación SSL
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Envío Rápido
              </h3>
              <p className="text-gray-600">
                Entrega en 24-48 horas en área metropolitana y 3-5 días en interior
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Garantía Total
              </h3>
              <p className="text-gray-600">
                30 días para devoluciones y 1 año de garantía en todos los productos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Lo que dicen nuestros clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                content: "Excelente servicio y productos de calidad. Mi iPhone llegó en perfecto estado y súper rápido. Definitivamente volveré a comprar.",
                author: "María González",
                location: "Ciudad de México"
              },
              {
                content: "Los precios son muy competitivos y la atención al cliente es excelente. Resolvieron todas mis dudas antes de comprar.",
                author: "Carlos Rodríguez",
                location: "Guadalajara"
              },
              {
                content: "Mi experiencia comprando aquí ha sido increíble. Todo llegó súper bien empacado y en tiempo récord.",
                author: "Ana López",
                location: "Monterrey"
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 shadow-sm"
                data-testid={`testimonial-${index}`}
              >
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¡No te pierdas nuestras ofertas!
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Suscríbete y recibe descuentos exclusivos y novedades
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <Input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-6 py-4 rounded-lg border-0 focus:ring-2 focus:ring-white outline-none"
              data-testid="input-newsletter-email"
            />
            <Button
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors duration-300"
              data-testid="button-newsletter-subscribe"
            >
              Suscribirse
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
