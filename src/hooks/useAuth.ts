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
  const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  // Helper function to set user with role
  const setUserWithRole = async (supabaseUser: SupabaseUser | null) => {
    if (supabaseUser) {
      const profile = await getUserProfile(supabaseUser.id)
      const role = profile?.role || 'customer'
      
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        full_name: profile?.full_name || supabaseUser.user_metadata?.full_name || null,
        avatar_url: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url || null,
        role
      })
      setUserRole(role)
    } else {
      setUser(null)
      setUserRole('customer')
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUserWithRole(session?.user ?? null).then(() => {
        setLoading(false)
      })
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        await setUserWithRole(session?.user ?? null)
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
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