import SearchBar from './SearchBar'

const Hero = ({ onSearch, loading, searchStatus }) => {
  return (
    <div className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-16">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold gradient-text mb-8">
            Track Card Prices
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
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