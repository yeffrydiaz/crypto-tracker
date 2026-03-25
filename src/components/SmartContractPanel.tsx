import { useState } from 'react';
import { walletService } from '../services/walletService';
import type { WalletState } from '../types';

interface Props {
  wallet: WalletState;
}

interface TokenInfo {
  address: string;
  balance: string;
  symbol: string;
  name: string;
}

// Popular ERC-20 token addresses on Ethereum mainnet
const POPULAR_TOKENS = [
  { name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC' },
  { name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT' },
  { name: 'Chainlink', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', symbol: 'LINK' },
  { name: 'Uniswap', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', symbol: 'UNI' },
];

export function SmartContractPanel({ wallet }: Props) {
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkBalance = async () => {
    if (!wallet.connected || !wallet.address) {
      setError('Please connect your wallet first');
      return;
    }
    if (!tokenAddress.trim()) {
      setError('Please enter a token contract address');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const info = await walletService.getTokenBalance(tokenAddress.trim(), wallet.address);
      setTokenInfo({ address: tokenAddress.trim(), ...info });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch token balance');
      setTokenInfo(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-2">Smart Contract Interaction</h2>
      <p className="text-sm text-gray-400 mb-6">Query ERC-20 token balances via Ethers.js smart contract calls</p>

      {!wallet.connected && (
        <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 mb-4">
          <p className="text-yellow-400 text-sm">⚠️ Connect your wallet to interact with smart contracts</p>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">Quick Select Token</label>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TOKENS.map(token => (
            <button
              key={token.address}
              onClick={() => setTokenAddress(token.address)}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-xs text-gray-300 rounded-lg transition-colors border border-gray-600"
            >
              {token.symbol}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={tokenAddress}
          onChange={e => setTokenAddress(e.target.value)}
          placeholder="ERC-20 contract address (0x...)"
          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          onClick={checkBalance}
          disabled={loading || !wallet.connected}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
        >
          {loading ? 'Querying...' : 'Check Balance'}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {tokenInfo && (
        <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-400">Token Name</p>
              <p className="text-sm font-medium text-white">{tokenInfo.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Symbol</p>
              <p className="text-sm font-medium text-white">{tokenInfo.symbol}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-400">Your Balance</p>
              <p className="text-lg font-bold text-green-400">{parseFloat(tokenInfo.balance).toFixed(6)} {tokenInfo.symbol}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
