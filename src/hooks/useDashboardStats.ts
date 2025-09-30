import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  featuredCount: number;
  loading: boolean;
  error: string | null;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    featuredCount: 0,
    loading: true,
    error: null,
  });

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      // Fetch total products count
      const { count: totalProducts, error: totalError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Fetch low stock count (stock_quantity < 10 AND stock_quantity > 0)
      const { count: lowStockCount, error: lowStockError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lt('stock_quantity', 10)
        .gt('stock_quantity', 0);

      if (lowStockError) throw lowStockError;

      // Fetch out of stock count (stock_quantity = 0)
      const { count: outOfStockCount, error: outOfStockError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('stock_quantity', 0);

      if (outOfStockError) throw outOfStockError;

      // Fetch featured products count
      const { count: featuredCount, error: featuredError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('featured', true);

      if (featuredError) throw featuredError;

      setStats({
        totalProducts: totalProducts || 0,
        lowStockCount: lowStockCount || 0,
        outOfStockCount: outOfStockCount || 0,
        featuredCount: featuredCount || 0,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dashboard statistics';
      setStats(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { ...stats, refetch: fetchStats };
}