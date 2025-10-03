import { useState, useEffect } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { User, UserRole, UserProfile } from '../types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<UserRole>('customer')

  // Helper function to create a user profile
  const createUserProfile = async (userId: string, accessToken: string, supabaseUser: SupabaseUser): Promise<UserProfile | null> => {
    console.log('[AUTH] Creating profile for user:', userId)

    try {
      // Determine role based on email or metadata
      let role: UserRole = 'customer'

      // Check for admin emails (you can customize this list)
      const superAdminEmails = ['fungalfluxsupplies@gmail.com']
      const adminEmails = ['admin@fungalflux.com']

      if (superAdminEmails.includes(supabaseUser.email || '')) {
        role = 'super_admin'
        console.log('[AUTH] Assigning super_admin role based on email')
      } else if (adminEmails.includes(supabaseUser.email || '')) {
        role = 'admin'
        console.log('[AUTH] Assigning admin role based on email')
      }

      // Check user metadata for role hint
      if (supabaseUser.user_metadata?.role) {
        role = supabaseUser.user_metadata.role as UserRole
        console.log('[AUTH] Assigning role from metadata:', role)
      }

      const newProfile = {
        id: crypto.randomUUID(),
        user_id: userId,
        full_name: supabaseUser.user_metadata?.full_name || null,
        avatar_url: supabaseUser.user_metadata?.avatar_url || null,
        role: role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('[AUTH] Creating profile:', newProfile)

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles`,
        {
          method: 'POST',
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(newProfile)
        }
      )

      console.log('[AUTH] Profile creation response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[AUTH] Profile creation failed:', response.status, response.statusText, errorText)
        return null
      }

      const createdProfile = await response.json()
      console.log('[AUTH] Profile created successfully:', createdProfile[0])
      return createdProfile[0]
    } catch (error) {
      console.error('[AUTH] Profile creation exception:', error)
      return null
    }
  }

  // Helper function to get user profile with role
  const getUserProfile = async (userId: string, accessToken: string, supabaseUser?: SupabaseUser): Promise<UserProfile | null> => {
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
        const errorText = await response.text()
        console.error('[AUTH] Fetch failed:', response.status, response.statusText, errorText)
        return null
      }

      const data = await response.json()
      console.log('[AUTH] Fetch data:', data)

      if (!data || data.length === 0) {
        console.log('[AUTH] No profile found, attempting to create one')
        if (supabaseUser) {
          return await createUserProfile(userId, accessToken, supabaseUser)
        } else {
          console.error('[AUTH] Cannot create profile: no user data provided')
          return null
        }
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
      const profile = await getUserProfile(supabaseUser.id, accessToken, supabaseUser)
      const role = profile?.role || 'customer'

      console.log('[AUTH] Setting user with role:', role)
      const userData = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        full_name: profile?.full_name || supabaseUser.user_metadata?.full_name || null,
        avatar_url: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url || null,
        role
      };
      setUser(userData);
      setUserRole(role);

      // Store user data in localStorage for login redirect logic
      localStorage.setItem('user', JSON.stringify(userData));

      console.log('[AUTH] User state updated')
    } else {
      console.log('[AUTH] Clearing user state')
      setUser(null)
      setUserRole('customer')
      // Clear user data from localStorage
      localStorage.removeItem('user')
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

  // Helper function to update user role (for admin use)
  const updateUserRole = async (targetUserId: string, newRole: UserRole) => {
    console.log('[AUTH] Updating user role:', targetUserId, 'to', newRole)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?id=eq.${targetUserId}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            role: newRole,
            updated_at: new Date().toISOString()
          })
        }
      )

      if (!response.ok) {
        console.error('[AUTH] Role update failed:', response.statusText)
        return { error: 'Failed to update role' }
      }

      console.log('[AUTH] Role updated successfully')
      // Refresh the page to get updated role
      window.location.reload()

      return { error: null }
    } catch (error) {
      console.error('[AUTH] Role update exception:', error)
      return { error: 'Exception updating role' }
    }
  }

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
    getUserProfile,
    updateUserRole
  }
}