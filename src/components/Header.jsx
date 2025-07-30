import { isSupabaseConfigured } from '../lib/supabase'

const Header = ({ version = '1.0.0' }) => {
  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-sm">
              <span className="text-xl">🎴</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Trading Card Tracker
              </h1>
              <p className="text-sm text-slate-500">
                v{version} • Live Market Prices
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isSupabaseConfigured 
                ? 'bg-emerald-500 text-white' 
                : 'bg-orange-500 text-white'
            }`}>
              {isSupabaseConfigured ? '🟢 Connected' : '🟡 Config'}
            </div>
            <div className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
              🚀 v{version}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header 