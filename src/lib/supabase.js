import { createClient } from '@supabase/supabase-js'

// Try both process.env and import.meta.env for Railway compatibility
const supabaseUrl = process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug environment variables
console.log('🔍 Supabase.js - Environment Variables:')
console.log('process.env.VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? 'Set' : 'NOT SET')
console.log('import.meta.env.VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'NOT SET')
console.log('Final supabaseUrl:', supabaseUrl ? 'Set' : 'NOT SET')
console.log('Final supabaseAnonKey:', supabaseAnonKey ? 'Set' : 'NOT SET')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables are missing!')
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.')
  console.error('process.env check:', {
    url: !!process.env.VITE_SUPABASE_URL,
    key: !!process.env.VITE_SUPABASE_ANON_KEY
  })
  console.error('import.meta.env check:', {
    url: !!import.meta.env.VITE_SUPABASE_URL,
    key: !!import.meta.env.VITE_SUPABASE_ANON_KEY
  })
}

// Create a mock Supabase client if environment variables are missing
const createMockSupabase = () => {
  console.log('⚠️ Using mock Supabase client - environment variables not set')
  return {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ data: [], error: null }),
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null })
      }),
      order: () => Promise.resolve({ data: [], error: null })
    })
  }
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : createMockSupabase()

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey) 