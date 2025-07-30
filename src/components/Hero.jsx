import SearchBar from './SearchBar'

const Hero = ({ onSearch, loading, searchStatus }) => {
  return (
    <div style={{
      paddingTop: '5rem',
      paddingBottom: '5rem',
      paddingLeft: '1rem',
      paddingRight: '1rem'
    }}>
      <div style={{
        maxWidth: '52rem',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: 700,
            color: '#1e293b',
            margin: 0,
            marginBottom: '2rem',
            letterSpacing: '-0.025em',
            lineHeight: '1.2'
          }}>
            Track Card Prices
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#64748b',
            maxWidth: '40rem',
            margin: '0 auto',
            lineHeight: '1.7',
            fontWeight: 500
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