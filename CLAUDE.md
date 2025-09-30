# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Vite
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint for code linting
- `npm run preview` - Preview production build locally
- `npm run db:types` - Generate TypeScript types from Supabase database schema

## Architecture Overview

This is a React e-commerce application for mushroom products built with:

**Tech Stack:**
- **Frontend:** React 18 + TypeScript + Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **State Management:** React Context API (CartContext)
- **Icons:** Lucide React

**Key Architecture Patterns:**

### Component Structure
- `src/components/` - Reusable UI components (Header, Footer, Cart, ProductCard, ProductModal)
- `src/pages/` - Route-specific page components (HomePage, ShopPage, AboutPage, ContactPage)
- `src/context/` - React Context providers for global state
- `src/lib/` - External service configurations and utilities
- `src/types/` - TypeScript type definitions
- `src/data/` - Static data and mock data files

### State Management
The app uses React Context API with useReducer for cart state management. The CartContext provides:
- Add/remove/update cart items
- Cart persistence and calculations
- Global cart state across components

### Database Integration
Uses Supabase for backend services:
- Product data storage and retrieval
- Database types auto-generated via `npm run db:types`
- Service layer in `src/lib/supabase.ts` with helper functions:
  - `productService.getAll()` - Get all products
  - `productService.getFeatured()` - Get featured products
  - `productService.getByCategory(category)` - Get products by category

### Product Categories
The app supports three product categories:
- `grow-kits` - Mushroom growing kits
- `liquid-cultures` - Liquid culture syringes
- `supplies` - Growing supplies and accessories

### Component Props Pattern
Components follow a consistent prop-drilling pattern for navigation and product selection:
- `onNavigate` - Function for programmatic navigation
- `onProductClick` - Function to open product modal
- Product data flows from database through service layer to components

### Environment Variables
Requires Supabase configuration:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Admin System

The application includes a comprehensive admin dashboard for inventory management:

### Admin Authentication
- **Role-based access control** with `customer`, `admin`, `super_admin` roles
- **Protected routes** using `ProtectedRoute` component with role requirements
- **Enhanced useAuth hook** with role checking functions (`isAdmin`, `isSuperAdmin`, `isCustomer`)
- **Unified login** system - same form for customers and admins with post-login routing

### Admin Dashboard Features
- **Dashboard Overview** - Stats, quick actions, and recent activity
- **Product Management** - Full CRUD operations with bulk actions
- **Inventory Tracking** - Stock levels, low stock alerts, stock history
- **Category Filtering** - Integrated with main shop filtering system
- **Responsive Design** - Mobile-optimized admin interface

### Admin Routes Structure
```
/admin                    - Dashboard overview
/admin/products          - Product list and management
/admin/products/add      - Add new product
/admin/products/:id      - Product details
/admin/products/:id/edit - Edit product
/admin/inventory         - Stock management
/admin/analytics         - Sales and inventory reports
/admin/settings          - Admin configuration
```

### Database Requirements
The admin system requires a `profiles` table with the following structure:
```sql
CREATE TABLE profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Admin Access Control
- **Authentication Required** - All admin routes require valid authentication
- **Role Verification** - Admin role checked on every route access
- **Session Management** - Auto-logout after inactivity for security
- **Breadcrumb Navigation** - Clear navigation path in admin interface

## Important Notes

- Database types are generated automatically - run `npm run db:types` after schema changes
- The app uses Vite's environment variable pattern (`import.meta.env.VITE_*`)
- Product images should be stored in `public/` directory and referenced with relative paths
- Cart state is managed entirely in memory - no persistence between sessions
- All navigation uses React Router's programmatic navigation with scroll-to-top behavior
- **Admin users** are redirected to `/admin` after login, customers to `/`
- **Demo credentials** available in development mode via login page