# Overview

KIVO es una plataforma de e-commerce completa construida con React y Express, que ofrece una experiencia de compra online completa. La aplicación atiende tanto a clientes como a administradores con una interfaz moderna y responsive que incluye navegación del catálogo de productos, funcionalidad de carrito de compras, autenticación de usuarios y herramientas administrativas completas para el manejo de inventario y pedidos.

**Eslogan oficial**: "KIVO - Justo lo que necesitas"
**Tipo de tienda**: Todo un poco (electrónica, ropa, hogar, abarrotes)
**Colores oficiales**: Violeta (#6C63FF) y Blanco (#FFFFFF)

# Estado del Proyecto

✅ **PROYECTO COMPLETADO** - Diciembre 2024
- Todos los requerimientos implementados
- Base de datos configurada con Supabase
- Frontend y backend funcionando
- README.md completo con documentación
- Listo para despliegue en producción

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18** with TypeScript for type safety and modern development
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query** for server state management and caching
- **Tailwind CSS** with custom design system using primary violet color (#6C63FF)
- **Shadcn/ui** component library for consistent UI components
- **React Hook Form** with **Zod** validation for form handling
- **Context API** for authentication and cart state management

## Backend Architecture
- **Express.js** with TypeScript for the REST API server
- **In-memory storage** implementation for development with interfaces designed for easy database migration
- **bcryptjs** for password hashing and authentication
- **Drizzle ORM** with PostgreSQL schema definitions ready for production database
- Session-based authentication with simple token system
- RESTful API design with proper error handling and middleware

## Data Storage Design
- **Development**: In-memory storage using Maps for rapid prototyping
- **Production Ready**: Drizzle ORM configuration with PostgreSQL schema
- **Database Schema**: Users, products, categories, cart items, orders, and order items with proper relationships
- **Data Models**: Comprehensive TypeScript interfaces for all entities

## Authentication & Authorization
- **Role-based access control** with user and admin roles
- **JWT-style token authentication** with localStorage persistence
- **Protected routes** for admin functionality
- **Password hashing** with bcryptjs for security
- **Session management** with automatic token validation

## UI/UX Architecture
- **Responsive design** with mobile-first approach
- **Component composition** using Radix UI primitives
- **Custom CSS variables** for consistent theming
- **Floating cart** with persistent state
- **Toast notifications** for user feedback
- **Form validation** with real-time error display

# External Dependencies

## Core Framework Dependencies
- **@tanstack/react-query**: Server state management and data fetching
- **wouter**: Lightweight routing library for React
- **drizzle-orm**: Type-safe SQL ORM for database operations
- **@neondatabase/serverless**: PostgreSQL driver for production database

## UI Component Libraries
- **@radix-ui/react-***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe CSS class variants
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel component for product displays

## Form Handling & Validation
- **react-hook-form**: Performant forms with minimal re-renders
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation library
- **drizzle-zod**: Integration between Drizzle ORM and Zod

## Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **esbuild**: JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development tools

## Production Dependencies
- **bcryptjs**: Password hashing library
- **connect-pg-simple**: PostgreSQL session store
- **date-fns**: Date manipulation utilities