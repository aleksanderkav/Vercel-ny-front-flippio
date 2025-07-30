import SearchBar from './SearchBar'

const Hero = ({ onSearch, loading, searchStatus }) => {
  return (
    <div style={{
      paddingTop: '6rem',
      paddingBottom: '6rem',
      paddingLeft: '1rem',
      paddingRight: '1rem'
    }}>
      <div style={{
        maxWidth: '56rem',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '2rem',
            margin: 0,
            marginBottom: '2rem'
          }}>
            Track Card Prices
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#475569',
            maxWidth: '42rem',
            margin: '0 auto'
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