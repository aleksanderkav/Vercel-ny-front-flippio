import SearchBar from './SearchBar'

const Hero = ({ onSearch, loading, searchStatus }) => {
  return (
    <div style={{
      paddingTop: '3rem',
      paddingBottom: '4rem',
      paddingLeft: '1rem',
      paddingRight: '1rem'
    }}>
      <div style={{
        maxWidth: '48rem',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#1e293b',
            margin: 0,
            marginBottom: '1rem',
            letterSpacing: '-0.025em',
            lineHeight: '1.2'
          }}>
            Add New Cards
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#64748b',
            maxWidth: '36rem',
            margin: '0 auto',
            lineHeight: '1.6',
            fontWeight: 500
          }}>
            Search and add new cards to your collection
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