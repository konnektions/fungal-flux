import { createClient } from '@supabase/supabase-js'

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

// Helper functions unchanged...
export const productService = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getFeatured() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .eq('in_stock', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}