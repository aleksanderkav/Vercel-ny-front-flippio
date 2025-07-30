import CardGrid from './CardGrid'

const CardLibrary = ({ cards = [], loading = false, onRefresh }) => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-2xl shadow-xl border border-slate-200/50 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-xl shadow-sm">
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
              className="btn btn-secondary"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="spinner mr-2"></div>
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