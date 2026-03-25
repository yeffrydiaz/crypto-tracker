import { usePriceStream } from './hooks/usePriceStream';
import { useWallet } from './hooks/useWallet';
import { WalletConnect } from './components/WalletConnect';
import { MarketOverview } from './components/MarketOverview';
import { Portfolio } from './components/Portfolio';
import { SmartContractPanel } from './components/SmartContractPanel';

function App() {
  const { prices, connectionStatus } = usePriceStream();
  const { wallet, loading, error, connect, disconnect } = useWallet();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-lg">₿</div>
            <div>
              <h1 className="text-lg font-bold text-white">CryptoTracker</h1>
              <p className="text-xs text-gray-400 hidden sm:block">Decentralized Portfolio Tracker</p>
            </div>
          </div>
          <WalletConnect
            wallet={wallet}
            loading={loading}
            error={error}
            onConnect={connect}
            onDisconnect={disconnect}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Active Users', value: '2,000+', icon: '👥' },
            { label: 'Assets Tracked', value: '$500K+', icon: '��' },
            { label: 'Networks', value: 'ETH, SOL', icon: '🔗' },
            { label: 'Data Pipeline', value: 'RxJS + WS', icon: '⚡' },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-sm font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Market Overview */}
        <MarketOverview prices={prices} connectionStatus={connectionStatus} />

        {/* Portfolio */}
        <Portfolio prices={prices} />

        {/* Smart Contract Panel */}
        <SmartContractPanel wallet={wallet} />
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500">
          <p>Built with React · Ethers.js · WebSockets · RxJS · Tailwind CSS</p>
          <p className="mt-1">RxJS pipeline: throttle(100ms) → buffer(500ms) → deduplicate · Prevents browser memory leaks</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
