import { useState } from 'react'

const SearchBar = ({ onSearch, loading = false, searchStatus = '' }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    await onSearch(searchQuery)
    setSearchQuery('')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-slate-700 mb-3">
              Search for Cards
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., Pikachu PSA 10, Charizard PSA 9"
              className="w-full px-4 py-4 text-lg border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-colors disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                <span>Scraping Prices...</span>
              </div>
            ) : (
              '🚀 Search & Scrape Prices'
            )}
          </button>
        </form>
        
        {searchStatus && (
          <div className={`mt-6 p-4 rounded-xl border transition-all ${
            searchStatus.includes('Error') 
              ? 'bg-red-50 border-red-200 text-red-700' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}>
            <div className="flex items-center">
              <span className="text-lg mr-3">
                {searchStatus.includes('Error') ? '❌' : '✅'}
              </span>
              <span className="font-medium">{searchStatus}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar 