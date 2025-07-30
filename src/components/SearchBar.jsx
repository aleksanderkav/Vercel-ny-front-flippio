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
      <div className="glass rounded-2xl shadow-xl border border-slate-200/50 p-8">
        <form onSubmit={handleSubmit} className="gap-6">
          <div className="mb-6">
            <label className="block text-lg font-semibold text-slate-700 mb-3">
              Search for Cards
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., Pikachu PSA 10, Charizard PSA 9"
              className="form-input"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="btn btn-primary w-full text-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="spinner mr-3"></div>
                <span>Scraping Prices...</span>
              </div>
            ) : (
              '🚀 Search & Scrape Prices'
            )}
          </button>
        </form>
        
        {searchStatus && (
          <div className={`mt-6 p-4 rounded-xl border ${
            searchStatus.includes('Error') 
              ? 'badge-warning' 
              : 'badge-success'
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