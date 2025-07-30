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

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey) 