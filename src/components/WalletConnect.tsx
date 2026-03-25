import type { WalletState } from '../types';

interface Props {
  wallet: WalletState;
  loading: boolean;
  error: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletConnect({ wallet, loading, error, onConnect, onDisconnect }: Props) {
  if (wallet.connected && wallet.address) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-white">{formatAddress(wallet.address)}</p>
          <p className="text-xs text-gray-400">{parseFloat(wallet.balance ?? '0').toFixed(4)} ETH</p>
        </div>
        <button
          onClick={onDisconnect}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {error && (
        <p className="text-xs text-red-400 max-w-xs truncate" title={error}>{error}</p>
      )}
      <button
        onClick={onConnect}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            Connecting...
          </>
        ) : (
          <>
            <span>🦊</span>
            Connect Wallet
          </>
        )}
      </button>
    </div>
  );
}
