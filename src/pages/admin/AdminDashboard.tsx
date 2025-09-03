import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Eye
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Products',
      value: '127',
      change: '+12%',
      trend: 'up',
      icon: Package
    },
    {
      title: 'Low Stock Items',
      value: '8',
      change: '-3 from yesterday',
      trend: 'down',
      icon: AlertTriangle,
      urgent: true
    },
    {
      title: 'Orders Today',
      value: '24',
      change: '+18%',
      trend: 'up',
      icon: ShoppingCart
    },
    {
      title: 'Revenue This Month',
      value: '$12,450',
      change: '+23%',
      trend: 'up',
      icon: TrendingUp
    }
  ];

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'Add a new product to your inventory',
      icon: Package,
      href: '/admin/products/add',
      color: 'bg-blue-500'
    },
    {
      title: 'View Low Stock',
      description: 'Check items that need restocking',
      icon: AlertTriangle,
      href: '/admin/inventory/low-stock',
      color: 'bg-yellow-500'
    },
    {
      title: 'View All Products',
      description: 'Manage your product catalog',
      icon: Eye,
      href: '/admin/products',
      color: 'bg-green-500'
    },
    {
      title: 'Analytics',
      description: 'View sales and inventory reports',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.full_name || user?.email}
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className={`text-sm mt-2 ${
                    stat.urgent 
                      ? 'text-yellow-600' 
                      : stat.trend === 'up' 
                        ? 'text-green-600' 
                        : 'text-gray-500'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${
                  stat.urgent 
                    ? 'bg-yellow-100' 
                    : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    stat.urgent 
                      ? 'text-yellow-600' 
                      : 'text-gray-600'
                  }`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.title}
                href={action.href}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
              >
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {action.description}
                </p>
              </a>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                New order #1234 received
              </p>
              <p className="text-xs text-gray-500">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Lion's Mane Kit stock is running low (2 remaining)
              </p>
              <p className="text-xs text-gray-500">15 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                New product "Reishi Grow Kit" was added
              </p>
              <p className="text-xs text-gray-500">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}