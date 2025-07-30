import { isSupabaseConfigured } from '../lib/supabase'

const CardGrid = ({ cards = [], loading = false, onRefresh }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  const getPriceColor = (price) => {
    if (price >= 100) return 'from-violet-600 to-purple-600'
    if (price >= 50) return 'from-orange-500 to-red-500'
    return 'from-emerald-500 to-teal-500'
  }

  const getPriceBadgeColor = (price) => {
    if (price >= 100) return 'bg-violet-50 text-violet-700 border-violet-200'
    if (price >= 50) return 'bg-orange-50 text-orange-700 border-orange-200'
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }

  if (loading) {
    return (
      <div className="text-center py-24">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full shadow-sm mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
        <p className="text-lg text-slate-600">Loading your card collection...</p>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-400 rounded-full shadow-sm mb-6">
          <span className="text-2xl">📭</span>
        </div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">
          {!isSupabaseConfigured ? 'Configuration Required' : 'No cards found'}
        </h3>
        <p className="text-slate-600">
          {!isSupabaseConfigured ? (
            <>
              Supabase environment variables need to be configured.<br />
              <span className="text-sm text-slate-500">
                Check the README for setup instructions.
              </span>
            </>
          ) : (
            'Start by searching for a card above to build your collection'
          )}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <p className="text-lg font-semibold text-slate-700">
          Found {cards.length} card{cards.length !== 1 ? 's' : ''}
        </p>
        <div className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
          💰 Live Prices
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-slate-200 overflow-hidden transition-all duration-200 hover:-translate-y-1"
          >
            {/* Card Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900 text-lg truncate mb-1">
                {card.name || 'Unknown Card'}
              </h3>
              <p className="text-slate-500 text-sm">
                #{card.id?.substring(0, 8)}...
              </p>
            </div>
            
            {/* Card Content */}
            <div className="p-6 space-y-4">
              {card.latest_price && card.latest_price > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Latest Price
                    </span>
                    <span className={`text-2xl font-bold bg-gradient-to-r ${getPriceColor(card.latest_price)} bg-clip-text text-transparent`}>
                      {formatPrice(card.latest_price)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${getPriceBadgeColor(card.latest_price)}`}>
                      📊 {card.price_count} entries
                    </span>
                    {card.last_price_update && (
                      <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        📅 {new Date(card.last_price_update).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4">
                    <span className="text-xl">💰</span>
                  </div>
                  <p className="font-medium text-orange-700 mb-4">
                    No Price Data
                  </p>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    🚀 Scrape Prices
                  </button>
                </div>
              )}
              
              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-400 text-center">
                  Added: {new Date(card.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CardGrid 