import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertProductSchema, insertCategorySchema, type Product, type Category } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Package, ShoppingBag, Users, DollarSign } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { z } from 'zod';

const productFormSchema = insertProductSchema.extend({
  price: z.string().min(1, "El precio es requerido"),
  stock: z.string().min(1, "El stock es requerido"),
});

type ProductFormData = z.infer<typeof productFormSchema>;
type CategoryFormData = z.infer<typeof insertCategorySchema>;

export function AdminPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  // Redirect if not admin
  if (!user?.isAdmin) {
    setLocation('/');
    return null;
  }

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Product form
  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      image: '',
      categoryId: '',
      stock: '',
    },
  });

  // Category form
  const categoryForm = useForm<CategoryFormData>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: {
      name: '',
      description: '',
      icon: '',
    },
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const token = localStorage.getItem('token');
      const productData = {
        ...data,
        price: data.price.toString(),
        stock: parseInt(data.stock),
      };
      return apiRequest('POST', '/api/products', productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({ title: "Producto creado exitosamente" });
      setProductDialogOpen(false);
      productForm.reset();
    },
    onError: () => {
      toast({ title: "Error al crear producto", variant: "destructive" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Product> }) => {
      const token = localStorage.getItem('token');
      return apiRequest('PATCH', `/api/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({ title: "Producto actualizado exitosamente" });
      setProductDialogOpen(false);
      setEditingProduct(null);
      productForm.reset();
    },
    onError: () => {
      toast({ title: "Error al actualizar producto", variant: "destructive" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('token');
      return apiRequest('DELETE', `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({ title: "Producto eliminado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al eliminar producto", variant: "destructive" });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const token = localStorage.getItem('token');
      return apiRequest('POST', '/api/categories', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({ title: "Categoría creada exitosamente" });
      setCategoryDialogOpen(false);
      categoryForm.reset();
    },
    onError: () => {
      toast({ title: "Error al crear categoría", variant: "destructive" });
    },
  });

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    productForm.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      categoryId: product.categoryId || '',
      stock: product.stock?.toString() || '0',
    });
    setProductDialogOpen(true);
  };

  const handleProductSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      updateProductMutation.mutate({
        id: editingProduct.id,
        data: {
          ...data,
          price: data.price.toString(),
          stock: parseInt(data.stock),
        },
      });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      deleteProductMutation.mutate(id);
    }
  };

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalRevenue = products.reduce((sum, product) => sum + parseFloat(product.price), 0);
  const lowStockProducts = products.filter(product => (product.stock || 0) < 10).length;

  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona productos, categorías y pedidos</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Productos</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="text-total-products">
                  {totalProducts}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <ShoppingBag className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categorías</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="text-total-categories">
                  {totalCategories}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valor Inventario</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="text-total-revenue">
                  ${totalRevenue.toLocaleString('es-MX')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="text-low-stock">
                  {lowStockProducts}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="products" data-testid="tab-products">Productos</TabsTrigger>
            <TabsTrigger value="categories" data-testid="tab-categories">Categorías</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
              <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setEditingProduct(null);
                      productForm.reset();
                    }}
                    data-testid="button-add-product"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Producto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingProduct ? 'Modifica la información del producto' : 'Completa la información del nuevo producto'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={productForm.handleSubmit(handleProductSubmit)} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre *</Label>
                      <Input
                        id="name"
                        {...productForm.register('name')}
                        placeholder="Nombre del producto"
                        data-testid="input-product-name"
                      />
                      {productForm.formState.errors.name && (
                        <p className="text-sm text-red-600 mt-1">
                          {productForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">Descripción *</Label>
                      <Textarea
                        id="description"
                        {...productForm.register('description')}
                        placeholder="Descripción del producto"
                        data-testid="textarea-product-description"
                      />
                      {productForm.formState.errors.description && (
                        <p className="text-sm text-red-600 mt-1">
                          {productForm.formState.errors.description.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="price">Precio *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        {...productForm.register('price')}
                        placeholder="0.00"
                        data-testid="input-product-price"
                      />
                      {productForm.formState.errors.price && (
                        <p className="text-sm text-red-600 mt-1">
                          {productForm.formState.errors.price.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="stock">Stock *</Label>
                      <Input
                        id="stock"
                        type="number"
                        {...productForm.register('stock')}
                        placeholder="0"
                        data-testid="input-product-stock"
                      />
                      {productForm.formState.errors.stock && (
                        <p className="text-sm text-red-600 mt-1">
                          {productForm.formState.errors.stock.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="categoryId">Categoría *</Label>
                      <Select 
                        value={productForm.watch('categoryId')} 
                        onValueChange={(value) => productForm.setValue('categoryId', value)}
                      >
                        <SelectTrigger data-testid="select-product-category">
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {productForm.formState.errors.categoryId && (
                        <p className="text-sm text-red-600 mt-1">
                          {productForm.formState.errors.categoryId.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="image">URL de Imagen *</Label>
                      <Input
                        id="image"
                        {...productForm.register('image')}
                        placeholder="https://example.com/image.jpg"
                        data-testid="input-product-image"
                      />
                      {productForm.formState.errors.image && (
                        <p className="text-sm text-red-600 mt-1">
                          {productForm.formState.errors.image.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setProductDialogOpen(false)}
                        className="flex-1"
                        data-testid="button-cancel-product"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={createProductMutation.isPending || updateProductMutation.isPending}
                        className="flex-1"
                        data-testid="button-save-product"
                      >
                        {editingProduct ? 'Actualizar' : 'Crear'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const category = categories.find(cat => cat.id === product.categoryId);
                return (
                  <Card key={product.id} data-testid={`product-card-${product.id}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                          {category && (
                            <Badge variant="secondary" className="mt-1">
                              {category.name}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                            data-testid={`button-edit-${product.id}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteProduct(product.id)}
                            data-testid={`button-delete-${product.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded mb-4"
                      />
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-primary">
                          ${parseFloat(product.price).toLocaleString('es-MX')}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          (product.stock || 0) < 10 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          Stock: {product.stock || 0}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h2>
              <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-category">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Categoría
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Nueva Categoría</DialogTitle>
                    <DialogDescription>
                      Completa la información de la nueva categoría
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={categoryForm.handleSubmit((data) => createCategoryMutation.mutate(data))} className="space-y-4">
                    <div>
                      <Label htmlFor="categoryName">Nombre *</Label>
                      <Input
                        id="categoryName"
                        {...categoryForm.register('name')}
                        placeholder="Nombre de la categoría"
                        data-testid="input-category-name"
                      />
                      {categoryForm.formState.errors.name && (
                        <p className="text-sm text-red-600 mt-1">
                          {categoryForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="categoryDescription">Descripción</Label>
                      <Textarea
                        id="categoryDescription"
                        {...categoryForm.register('description')}
                        placeholder="Descripción de la categoría"
                        data-testid="textarea-category-description"
                      />
                    </div>

                    <div>
                      <Label htmlFor="categoryIcon">Icono (Emoji)</Label>
                      <Input
                        id="categoryIcon"
                        {...categoryForm.register('icon')}
                        placeholder="📱"
                        data-testid="input-category-icon"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCategoryDialogOpen(false)}
                        className="flex-1"
                        data-testid="button-cancel-category"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={createCategoryMutation.isPending}
                        className="flex-1"
                        data-testid="button-save-category"
                      >
                        Crear
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const categoryProductCount = products.filter(p => p.categoryId === category.id).length;
                return (
                  <Card key={category.id} data-testid={`category-card-${category.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {category.icon && (
                            <span className="text-2xl">{category.icon}</span>
                          )}
                          <h3 className="font-semibold text-lg text-gray-900">
                            {category.name}
                          </h3>
                        </div>
                        <Badge variant="outline">
                          {categoryProductCount} productos
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {category.description || 'Sin descripción'}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AdminPage;
