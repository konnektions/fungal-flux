import { useState, useEffect } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { User, UserRole, UserProfile } from '../types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<UserRole>('customer')

  // Helper function to get user profile with role
  const getUserProfile = async (userId: string, accessToken: string): Promise<UserProfile | null> => {
    console.log('[AUTH] Fetching profile for user:', userId)
    
    try {
      console.log('[AUTH] Using direct fetch with provided token')
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      
      const response = await fetch(
        `${supabaseUrl}/rest/v1/profiles?user_id=eq.${userId}&limit=1`,
        {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          }
        }
      )
      
      console.log('[AUTH] Fetch response status:', response.status)
      
      if (!response.ok) {
        console.error('[AUTH] Fetch failed:', response.statusText)
        return null
      }
      
      const data = await response.json()
      console.log('[AUTH] Fetch data:', data)
      
      if (!data || data.length === 0) {
        console.error('[AUTH] No profile found')
        return null
      }
      
      console.log('[AUTH] Profile found:', data[0])
      return data[0]
    } catch (error) {
      console.error('[AUTH] Exception:', error)
      return null
    }
  }

  // Helper function to set user with role
  const setUserWithRole = async (supabaseUser: SupabaseUser | null, accessToken?: string) => {
    console.log('[AUTH] setUserWithRole called with user:', supabaseUser?.id)
    if (supabaseUser && accessToken) {
      const profile = await getUserProfile(supabaseUser.id, accessToken)
      const role = profile?.role || 'customer'
      
      console.log('[AUTH] Setting user with role:', role)
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        full_name: profile?.full_name || supabaseUser.user_metadata?.full_name || null,
        avatar_url: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url || null,
        role
      })
      setUserRole(role)
      console.log('[AUTH] User state updated')
    } else {
      console.log('[AUTH] Clearing user state')
      setUser(null)
      setUserRole('customer')
    }
  }

  useEffect(() => {
    console.log('[AUTH] useEffect - Initializing auth')
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[AUTH] Initial session:', session?.user?.id)
      setSession(session)
      setUserWithRole(session?.user ?? null, session?.access_token).then(() => {
        console.log('[AUTH] Initial auth setup complete')
        setLoading(false)
      })
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AUTH] Auth state changed:', event, 'User:', session?.user?.id)
        setSession(session)
        await setUserWithRole(session?.user ?? null, session?.access_token)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    console.log('[AUTH] signIn called for:', email)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    console.log('[AUTH] signIn result:', error ? 'ERROR' : 'SUCCESS', error?.message)
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  // Admin role checking functions
  const isAdmin = userRole === 'admin' || userRole === 'super_admin'
  const isSuperAdmin = userRole === 'super_admin'
  const isCustomer = userRole === 'customer'

  return {
    user,
    session,
    loading,
    userRole,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isAdmin,
    isSuperAdmin,
    isCustomer,
    getUserProfile
  }
}