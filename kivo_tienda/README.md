# KIVO - Justo lo que necesitas

Una tienda online moderna y completa construida con React, Express y TypeScript. KIVO es tu tienda de todo un poco: electrónica, ropa, hogar y abarrotes. Ofrece una experiencia de compra fluida con autenticación de usuarios, carrito de compras funcional y panel de administración.

## 🌟 Características Principales

### Para Clientes
- **Catálogo dinámico** de productos organizados por categorías
- **Carrito de compras** funcional con persistencia
- **Sistema de checkout** completo con información del cliente
- **Autenticación** segura de usuarios
- **Diseño responsive** optimizado para móvil y escritorio
- **Interfaz moderna** con colores oficiales violeta (#6C63FF) y blanco

### Para Administradores
- **Panel de administración** completo
- **CRUD de productos** (crear, leer, actualizar, eliminar)
- **Gestión de categorías**
- **Estadísticas** de inventario y ventas
- **Control de stock** con alertas de stock bajo

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **Wouter** para enrutamiento
- **TanStack Query** para gestión de estado del servidor
- **Shadcn/ui** para componentes UI
- **React Hook Form** para formularios
- **Zod** para validación de esquemas

### Backend
- **Node.js** con Express
- **TypeScript** para tipado estático
- **Drizzle ORM** para manejo de base de datos
- **bcryptjs** para hash de contraseñas
- **Almacenamiento en memoria** para desarrollo

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 18 o superior
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone [URL_DEL_REPOSITORIO]
cd kivo-tienda
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configuración de variables de entorno**
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/basedatos
```

Para obtener tu `DATABASE_URL` de Supabase:
- Ve a https://supabase.com/dashboard/projects
- Crea un nuevo proyecto (gratis)
- En la página del proyecto, haz clic en "Connect"
- Copia la URI bajo "Connection string" -> "Transaction pooler"
- Reemplaza `[YOUR-PASSWORD]` con tu contraseña de base de datos

4. **Configurar la base de datos**
```bash
npm run db:push
```

5. **Ejecutar el proyecto en desarrollo**
```bash
npm run dev
```

6. **Abrir en el navegador**
- Ve a http://localhost:5000
- Usa las credenciales de prueba: `admin` / `password` para acceso de administrador

## 🗄️ Estructura de la Base de Datos

### Tablas Principales
- **productos** (id, nombre, precio, categoría, stock, imagen)
- **clientes/usuarios** (id, nombre, email, contraseña, is_admin)
- **categorías** (id, nombre, descripción, icono)
- **pedidos** (id, usuario_id, fecha, total, estado, datos_cliente)
- **detalle_pedido** (id, pedido_id, producto_id, cantidad, subtotal)
- **carrito** (id, usuario_id, producto_id, cantidad)

### Características de la Base de Datos
- **PostgreSQL** compatible (Supabase)
- **Diseño estándar SQL** - Fácil migración a MySQL u otros motores
- **Relaciones con claves foráneas** para integridad de datos
- **UUIDs** como claves primarias para escalabilidad

## 🔐 Autenticación y Roles

### Usuarios
- **Registro/Login** con email y contraseña
- **Hash seguro** de contraseñas con bcryptjs
- **Sesiones** persistentes con tokens

### Roles de Usuario
- **Cliente**: Navegar catálogo, agregar al carrito, realizar pedidos
- **Administrador**: CRUD completo de productos y categorías, ver estadísticas

### Credenciales de Prueba
- **Admin**: `admin` / `password`

## 📱 Características de la Interfaz

### Diseño
- **Colores oficiales**: Violeta (#6C63FF) y Blanco (#FFFFFF)
- **Responsive design** - Optimizado para móvil y escritorio
- **Estilo juvenil y moderno** con animaciones suaves

### Secciones Principales
- **Header** con logo KIVO, menú de navegación y búsqueda
- **Banner principal** con llamada a la acción
- **Catálogo dinámico** organizado por categorías
- **Ofertas destacadas** con temporizadores
- **Sección de beneficios** con íconos
- **Testimonios** de clientes
- **Footer** completo con enlaces y contacto
- **Carrito flotante** con contador de productos

### Funcionalidades del Carrito
- **Agregar/quitar productos** con actualización en tiempo real
- **Ver total** acumulado
- **Checkout completo** con formulario de datos del cliente
- **Persistencia** de datos entre sesiones

## 🚀 Despliegue en Producción

### Frontend (Vercel)
1. **Conectar repositorio** en Vercel
2. **Configurar build**: 
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Variables de entorno**: Agregar `VITE_API_URL` si es necesario
4. **Deploy automático** en cada push

### Backend (Render)
1. **Crear nuevo Web Service** en Render
2. **Conectar repositorio** de GitHub
3. **Configuración**:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Variables de entorno**: Agregar `DATABASE_URL`
5. **Deploy automático**

### Base de Datos (Supabase)
- **Ya está en la nube** - No requiere configuración adicional
- **Backups automáticos** incluidos
- **SSL** habilitado por defecto

## 📄 Endpoints del API

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Productos
- `GET /api/products` - Listar todos los productos
- `GET /api/products/:id` - Obtener producto específico
- `POST /api/products` - Crear producto (Admin)
- `PATCH /api/products/:id` - Actualizar producto (Admin)
- `DELETE /api/products/:id` - Eliminar producto (Admin)

### Categorías
- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría (Admin)

### Carrito
- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart` - Agregar producto al carrito
- `PATCH /api/cart/:id` - Actualizar cantidad
- `DELETE /api/cart/:id` - Eliminar producto del carrito
- `DELETE /api/cart` - Vaciar carrito

### Pedidos
- `GET /api/orders` - Obtener pedidos (usuario: propios, admin: todos)
- `POST /api/orders` - Crear nuevo pedido
- `PATCH /api/orders/:id` - Actualizar estado (Admin)

## 🛠️ Arquitectura Técnica

### Backend
- **Express.js** con TypeScript
- **Drizzle ORM** para manejo de base de datos
- **Validación** con Zod schemas
- **Middleware** de autenticación JWT-style
- **Estructura modular**: rutas, controladores, storage

### Frontend
- **React 18** con TypeScript
- **Wouter** para routing ligero
- **TanStack Query** para estado del servidor
- **React Hook Form** + Zod para formularios
- **Tailwind CSS** + Shadcn/ui para componentes

### Estado de la Aplicación
- **Context API** para autenticación y carrito
- **Cache inteligente** con TanStack Query
- **Persistencia** en localStorage para sesiones

## 📝 Desarrollo y Mantenimiento

### Scripts Disponibles
```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run db:push      # Sincronizar esquema de DB
npm run db:push --force  # Forzar sincronización
```

### Estructura de Archivos
```
├── client/           # Frontend React
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   ├── pages/       # Páginas principales
│   │   ├── context/     # Estado global
│   │   └── lib/         # Utilidades
├── server/          # Backend Express
│   ├── routes.ts    # Definición de rutas API
│   ├── storage.ts   # Interfaz de base de datos
│   └── index.ts     # Servidor principal
├── shared/          # Tipos y esquemas compartidos
└── README.md        # Documentación
```

## 🔧 Solución de Problemas

### Errores Comunes
1. **Error de conexión a DB**: Verificar `DATABASE_URL`
2. **Dependencias faltantes**: Ejecutar `npm install`
3. **Puerto ocupado**: Cambiar puerto en configuración
4. **Permisos CORS**: Verificar configuración del servidor

### Logs y Debugging
- **Frontend**: Consola del navegador
- **Backend**: Terminal del servidor
- **Base de datos**: Panel de Supabase

## 👥 Contribución

1. Fork del repositorio
2. Crear branch para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas:
- **Email**: soporte@kivo.mx
- **GitHub Issues**: [Crear issue](https://github.com/tu-usuario/kivo/issues)

---

**KIVO - Justo lo que necesitas** 💜
