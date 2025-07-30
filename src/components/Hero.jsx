import SearchBar from './SearchBar'

const Hero = ({ onSearch, loading, searchStatus }) => {
  return (
    <div style={{
      paddingTop: '4rem',
      paddingBottom: '4rem',
      paddingLeft: '1rem',
      paddingRight: '1rem'
    }}>
      <div style={{
        maxWidth: '48rem',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 600,
            color: '#1e293b',
            margin: 0,
            marginBottom: '1.5rem',
            letterSpacing: '-0.025em'
          }}>
            Track Card Prices
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#64748b',
            maxWidth: '36rem',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Discover real-time market prices for trading cards from eBay and other marketplaces
          </p>
        </div>

        <SearchBar 
          onSearch={onSearch}
          loading={loading}
          searchStatus={searchStatus}
        />
      </div>
    </div>
  )
}

export default Hero 