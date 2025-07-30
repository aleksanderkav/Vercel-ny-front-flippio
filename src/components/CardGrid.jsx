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
    if (price >= 100) return 'text-purple-600'
    if (price >= 50) return 'text-orange-600'
    return 'text-emerald-600'
  }

  const getPriceBadgeColor = (price) => {
    if (price >= 100) return 'badge-info'
    if (price >= 50) return 'badge-warning'
    return 'badge-success'
  }

  if (loading) {
    return (
      <div className="text-center py-24">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full shadow-sm mb-6">
          <div className="spinner"></div>
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
        <div className="badge badge-success">
          💰 Live Prices
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className="card"
          >
            {/* Card Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900 text-lg mb-1">
                {card.name || 'Unknown Card'}
              </h3>
              <p className="text-slate-500 text-sm">
                #{card.id?.substring(0, 8)}...
              </p>
            </div>
            
            {/* Card Content */}
            <div className="p-6 gap-4">
              {card.latest_price && card.latest_price > 0 ? (
                <div className="gap-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-slate-500">
                      Latest Price
                    </span>
                    <span className={`text-2xl font-bold ${getPriceColor(card.latest_price)}`}>
                      {formatPrice(card.latest_price)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2">
                    <span className={`badge ${getPriceBadgeColor(card.latest_price)}`}>
                      📊 {card.price_count} entries
                    </span>
                    {card.last_price_update && (
                      <span className="badge badge-info">
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
                  <button className="btn btn-orange">
                    🚀 Scrape Prices
                  </button>
                </div>
              )}
              
              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-200 mt-4">
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