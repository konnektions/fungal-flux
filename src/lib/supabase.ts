import { createClient } from '@supabase/supabase-js'
import { demoProducts } from '../data/demoProducts'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Provide fallbacks for development
const fallbackUrl = 'https://your-project-id.supabase.co'
const fallbackKey = 'public-anon-key'

// Use environment variables or fallbacks
const url = supabaseUrl || fallbackUrl
const key = supabaseAnonKey || fallbackKey

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Using fallback values for development.')
  console.warn('Make sure to create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(url, key)

// Debug function to check current user and permissions
export const debugAuth = async () => {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session:', session);

    if (session?.user) {
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      console.log('User profile:', profile);

      // Test products table access
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .limit(1);

      console.log('Products access test:', { data: products, error: productsError });

      return {
        session,
        profile,
        productsAccess: { data: products, error: productsError }
      };
    }

    return { session: null, profile: null, productsAccess: null };
  } catch (error) {
    console.error('Debug auth error:', error);
    return { error };
  }
}

// Make debug function available globally for troubleshooting
if (typeof window !== 'undefined') {
  (window as unknown as Window & { debugSupabaseAuth: typeof debugAuth }).debugSupabaseAuth = debugAuth;
}

// Helper functions unchanged...
export const productService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (err) {
      console.warn('[productService.getAll] Falling back to demo products:', err instanceof Error ? err.message : err)
      return demoProducts
    }
  },

  async getFeatured() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (err) {
      console.warn('[productService.getFeatured] Falling back to demo products:', err instanceof Error ? err.message : err)
      return demoProducts.filter(p => p.featured && p.in_stock)
    }
  },

  async getByCategory(category: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (err) {
      console.warn('[productService.getByCategory] Falling back to demo products:', err instanceof Error ? err.message : err)
      return demoProducts.filter(p => p.category === category)
    }
  }
}