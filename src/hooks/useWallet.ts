import { useState, useCallback } from 'react';
import { walletService } from '../services/walletService';
import type { WalletState } from '../types';

const initialState: WalletState = {
  connected: false,
  address: null,
  chainId: null,
  balance: null,
};

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const state = await walletService.connect();
      setWallet(state);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    const state = await walletService.disconnect();
    setWallet(state);
  }, []);

  return { wallet, loading, error, connect, disconnect };
}
