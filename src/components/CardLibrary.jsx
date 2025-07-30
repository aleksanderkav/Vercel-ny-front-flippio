import CardGrid from './CardGrid'

const CardLibrary = ({ cards = [], loading = false, onRefresh }) => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm">
                <span className="text-xl">📚</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  Card Library
                </h2>
                <p className="text-slate-500">
                  Your collection of tracked cards
                </p>
              </div>
            </div>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                '🔄 Refresh'
              )}
            </button>
          </div>
          
          <CardGrid 
            cards={cards}
            loading={loading}
            onRefresh={onRefresh}
          />
        </div>
      </div>
    </div>
  )
}

export default CardLibrary 