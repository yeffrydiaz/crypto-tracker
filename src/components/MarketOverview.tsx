const ASSETS = [
  { id: 'bitcoin', symbol: 'bitcoin', name: 'Bitcoin', ticker: 'BTC', color: 'text-orange-400' },
  { id: 'ethereum', symbol: 'ethereum', name: 'Ethereum', ticker: 'ETH', color: 'text-blue-400' },
  { id: 'solana', symbol: 'solana', name: 'Solana', ticker: 'SOL', color: 'text-purple-400' },
  { id: 'cardano', symbol: 'cardano', name: 'Cardano', ticker: 'ADA', color: 'text-teal-400' },
  { id: 'polkadot', symbol: 'polkadot', name: 'Polkadot', ticker: 'DOT', color: 'text-pink-400' },
  { id: 'chainlink', symbol: 'chainlink', name: 'Chainlink', ticker: 'LINK', color: 'text-blue-300' },
];

interface Props {
  prices: Record<string, number>;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
}

export function MarketOverview({ prices, connectionStatus }: Props) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Live Market Prices</h2>
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' :
              connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
              'bg-red-400'
            }`}
          />
          <span className="text-xs text-gray-400 capitalize">{connectionStatus}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {ASSETS.map(asset => {
          const price = prices[asset.symbol];
          return (
            <div key={asset.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/30 hover:border-gray-500/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-bold ${asset.color}`}>{asset.ticker}</span>
                <span className="text-xs text-gray-500">{asset.name}</span>
              </div>
              <div className="text-lg font-semibold text-white">
                {price !== undefined ? (
                  `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                ) : (
                  <span className="text-gray-500 animate-pulse">Loading...</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-gray-500 text-center">
        Real-time prices via WebSocket · RxJS pipeline (throttle → batch → deduplicate)
      </p>
    </div>
  );
}
