import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProductSchema, insertCategorySchema, loginSchema } from "@shared/schema";
import bcrypt from "bcryptjs";

interface AuthenticatedRequest extends Express.Request {
  user?: any;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware para autenticación
  const authenticateUser = async (req: AuthenticatedRequest, res: Express.Response, next: Express.NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    try {
      // En una aplicación real, verificaríamos el JWT aquí
      // Por simplicidad, usamos el token como userId
      const user = await storage.getUser(token);
      if (!user) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Token inválido" });
    }
  };

  const requireAdmin = (req: AuthenticatedRequest, res: Express.Response, next: Express.NextFunction) => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Verificar si el usuario ya existe
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token: user.id });
    } catch (error) {
      res.status(400).json({ message: "Error al crear usuario", error });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token: user.id });
    } catch (error) {
      res.status(400).json({ message: "Error al iniciar sesión", error });
    }
  });

  app.get("/api/auth/me", authenticateUser, async (req: AuthenticatedRequest, res) => {
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener categorías", error });
    }
  });

  app.post("/api/categories", authenticateUser, requireAdmin, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: "Error al crear categoría", error });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const categoryId = req.query.categoryId as string;
      const products = categoryId 
        ? await storage.getProductsByCategory(categoryId)
        : await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener productos", error });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener producto", error });
    }
  });

  app.post("/api/products", authenticateUser, requireAdmin, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Error al crear producto", error });
    }
  });

  app.patch("/api/products/:id", authenticateUser, requireAdmin, async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Error al actualizar producto", error });
    }
  });

  app.delete("/api/products/:id", authenticateUser, requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      res.json({ message: "Producto eliminado" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar producto", error });
    }
  });

  // Cart routes
  app.get("/api/cart", authenticateUser, async (req: AuthenticatedRequest, res) => {
    try {
      const cartItems = await storage.getCartItems(req.user.id);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener carrito", error });
    }
  });

  app.post("/api/cart", authenticateUser, async (req: AuthenticatedRequest, res) => {
    try {
      const { productId, quantity = 1 } = req.body;
      
      // Verificar si el producto ya está en el carrito
      const existingItems = await storage.getCartItems(req.user.id);
      const existingItem = existingItems.find(item => item.productId === productId);
      
      if (existingItem) {
        const updatedItem = await storage.updateCartItem(existingItem.id, existingItem.quantity + quantity);
        res.json(updatedItem);
      } else {
        const cartItem = await storage.addToCart({
          userId: req.user.id,
          productId,
          quantity,
        });
        res.json(cartItem);
      }
    } catch (error) {
      res.status(400).json({ message: "Error al agregar al carrito", error });
    }
  });

  app.patch("/api/cart/:id", authenticateUser, async (req, res) => {
    try {
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(req.params.id, quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Item no encontrado" });
      }
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Error al actualizar carrito", error });
    }
  });

  app.delete("/api/cart/:id", authenticateUser, async (req, res) => {
    try {
      const deleted = await storage.removeFromCart(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Item no encontrado" });
      }
      res.json({ message: "Item eliminado del carrito" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar del carrito", error });
    }
  });

  app.delete("/api/cart", authenticateUser, async (req: AuthenticatedRequest, res) => {
    try {
      await storage.clearCart(req.user.id);
      res.json({ message: "Carrito vaciado" });
    } catch (error) {
      res.status(500).json({ message: "Error al vaciar carrito", error });
    }
  });

  // Orders routes
  app.get("/api/orders", authenticateUser, async (req: AuthenticatedRequest, res) => {
    try {
      const orders = req.user.isAdmin 
        ? await storage.getOrders()
        : await storage.getUserOrders(req.user.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener pedidos", error });
    }
  });

  app.post("/api/orders", authenticateUser, async (req: AuthenticatedRequest, res) => {
    try {
      const { customerName, customerEmail, customerPhone, shippingAddress } = req.body;
      
      // Obtener items del carrito
      const cartItems = await storage.getCartItems(req.user.id);
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "El carrito está vacío" });
      }

      // Calcular total
      let total = 0;
      for (const item of cartItems) {
        const product = await storage.getProduct(item.productId!);
        if (product) {
          total += parseFloat(product.price) * item.quantity;
        }
      }

      // Crear orden
      const order = await storage.createOrder({
        userId: req.user.id,
        total: total.toString(),
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
      });

      // Crear items de la orden
      for (const item of cartItems) {
        const product = await storage.getProduct(item.productId!);
        if (product) {
          await storage.createOrderItem({
            orderId: order.id,
            productId: item.productId!,
            quantity: item.quantity,
            price: product.price,
          });
        }
      }

      // Limpiar carrito
      await storage.clearCart(req.user.id);

      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Error al crear pedido", error });
    }
  });

  app.patch("/api/orders/:id", authenticateUser, requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ message: "Pedido no encontrado" });
      }
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Error al actualizar pedido", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
