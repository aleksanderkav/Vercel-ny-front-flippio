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
    <div style={{
      maxWidth: '42rem',
      margin: '0 auto'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
        border: '2px solid rgba(226, 232, 240, 0.8)',
        padding: '3rem'
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '0.75rem'
            }}>
              Search for Cards
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., Pikachu PSA 10, Charizard PSA 9"
              style={{
                width: '100%',
                padding: '1.25rem',
                fontSize: '1.125rem',
                border: '2px solid #e2e8f0',
                borderRadius: '1.25rem',
                outline: 'none',
                transition: 'all 0.3s ease-in-out',
                backgroundColor: loading ? '#f8fafc' : '#ffffff',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6'
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0'
                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            style={{
              width: '100%',
              padding: '1.25rem',
              fontSize: '1.125rem',
              fontWeight: 700,
              color: '#ffffff',
              backgroundColor: loading || !searchQuery.trim() ? '#94a3b8' : '#4f46e5',
              border: 'none',
              borderRadius: '1.25rem',
              cursor: loading || !searchQuery.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3), 0 4px 6px -2px rgba(79, 70, 229, 0.2)',
              transform: loading || !searchQuery.trim() ? 'none' : 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              if (!loading && searchQuery.trim()) {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.backgroundColor = '#4338ca'
                e.target.style.boxShadow = '0 20px 25px -5px rgba(79, 70, 229, 0.4), 0 10px 10px -5px rgba(79, 70, 229, 0.3)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && searchQuery.trim()) {
                e.target.style.transform = 'translateY(0)'
                e.target.style.backgroundColor = '#4f46e5'
                e.target.style.boxShadow = '0 10px 15px -3px rgba(79, 70, 229, 0.3), 0 4px 6px -2px rgba(79, 70, 229, 0.2)'
              }
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <span>Searching Prices...</span>
              </>
            ) : (
                              '🚀 Search & Get Prices'
            )}
          </button>
        </form>
        
        {searchStatus && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid',
            backgroundColor: searchStatus.includes('Error') ? '#fffbeb' : '#ecfdf5',
            borderColor: searchStatus.includes('Error') ? '#fcd34d' : '#a7f3d0',
            color: searchStatus.includes('Error') ? '#92400e' : '#065f46'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '1.125rem', marginRight: '0.75rem' }}>
                {searchStatus.includes('Error') ? '❌' : '✅'}
              </span>
              <span style={{ fontWeight: 500 }}>{searchStatus}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar 