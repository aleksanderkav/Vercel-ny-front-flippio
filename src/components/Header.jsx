import { isSupabaseConfigured } from '../lib/supabase'

const Header = ({ version = '1.0.0' }) => {
  return (
    <div className="sticky top-0 z-50 glass border-b border-slate-200/60 shadow-sm">
      <div className="container py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl shadow-sm">
              <span className="text-xl">🎴</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Trading Card Tracker
              </h1>
              <p className="text-slate-500">
                v{version} • Live Market Prices
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`badge ${isSupabaseConfigured ? 'badge-success' : 'badge-warning'}`}>
              {isSupabaseConfigured ? '🟢 Connected' : '🟡 Config'}
            </div>
            <div className="badge badge-info">
              🚀 v{version}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header 