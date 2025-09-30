import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import {
  Package,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Eye,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { totalProducts, lowStockCount, outOfStockCount, featuredCount, loading, error, refetch } = useDashboardStats();

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      urgent: false
    },
    {
      title: 'Low Stock Items',
      value: lowStockCount,
      icon: AlertTriangle,
      urgent: lowStockCount > 0
    },
    {
      title: 'Out of Stock',
      value: outOfStockCount,
      icon: Package,
      urgent: outOfStockCount > 0
    },
    {
      title: 'Featured Products',
      value: featuredCount,
      icon: TrendingUp,
      urgent: false
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

      {/* Error Banner */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 mb-1">
                Failed to load dashboard statistics
              </h3>
              <p className="text-sm text-red-700 mb-3">
                {error}
              </p>
              <button
                onClick={refetch}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          // Loading Skeleton
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </>
        ) : !error ? (
          // Actual Stats
          stats.map((stat) => {
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
                    {stat.urgent && (
                      <p className="text-sm mt-2 text-yellow-600 font-medium">
                        Needs attention
                      </p>
                    )}
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
          })
        ) : null}
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