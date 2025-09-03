import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  BarChart3
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: Package,
    children: [
      { name: 'All Products', href: '/admin/products' },
      { name: 'Add Product', href: '/admin/products/add' },
      { name: 'Categories', href: '/admin/products/categories' }
    ]
  },
  {
    name: 'Inventory',
    href: '/admin/inventory',
    icon: ShoppingBag,
    children: [
      { name: 'Stock Levels', href: '/admin/inventory' },
      { name: 'Low Stock', href: '/admin/inventory/low-stock' },
      { name: 'Stock History', href: '/admin/inventory/history' }
    ]
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings
  }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, signOut, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const isActiveLink = (href: string, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Admin', href: '/admin' }];
    
    let currentPath = '';
    pathSegments.slice(1).forEach((segment, index) => {
      currentPath += `/${segment}`;
      const href = `/admin${currentPath}`;
      
      // Find matching navigation item or create a readable name
      const navItem = navigationItems.find(item => 
        item.href === href || item.children?.some(child => child.href === href)
      );
      
      let name = segment.charAt(0).toUpperCase() + segment.slice(1);
      if (navItem) {
        name = navItem.name;
      } else if (navItem?.children) {
        const childItem = navItem.children.find(child => child.href === href);
        if (childItem) name = childItem.name;
      }
      
      breadcrumbs.push({ name, href });
    });
    
    return breadcrumbs;
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this area.</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-[#2D4A3E] hover:underline"
          >
            <Home className="w-4 h-4" />
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link to="/admin" className="flex items-center gap-3">
            <img 
              src="/greenLogo.png" 
              alt="Fungal Flux" 
              className="w-8 h-8 object-contain"
            />
            <div>
              <h1 className="font-bold text-[#2D4A3E]">Fungal Flux</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveLink(item.href, item.exact);
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedItems.includes(item.name);

              return (
                <li key={item.name}>
                  <div>
                    {hasChildren ? (
                      <button
                        onClick={() => toggleExpanded(item.name)}
                        className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? 'bg-[#2D4A3E] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          {item.name}
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                    ) : (
                      <Link
                        to={item.href}
                        className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? 'bg-[#2D4A3E] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    )}
                  </div>

                  {hasChildren && isExpanded && (
                    <ul className="mt-2 ml-4 space-y-1">
                      {item.children?.map((child) => (
                        <li key={child.name}>
                          <Link
                            to={child.href}
                            className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                              isActiveLink(child.href)
                                ? 'bg-[#8FA89E] text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User menu at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-2 text-sm">
            <div className="w-8 h-8 bg-[#2D4A3E] rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {user?.full_name || user?.email}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role || 'Admin'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mt-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Breadcrumbs */}
              <nav className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center">
                    {index > 0 && (
                      <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                    )}
                    {index === breadcrumbs.length - 1 ? (
                      <span className="text-gray-900 font-medium">{crumb.name}</span>
                    ) : (
                      <Link
                        to={crumb.href}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {crumb.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">View Store</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}