import { useState, useEffect, useRef } from 'react';
import { cryptoWSService } from '../services/websocketService';
import type { Subscription } from 'rxjs';
import type { PriceUpdate } from '../types';

export function usePriceStream() {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    cryptoWSService.connect();
    setConnectionStatus('connecting');

    subscriptionRef.current = cryptoWSService.priceUpdates$.subscribe({
      next: (updates: PriceUpdate[]) => {
        setConnectionStatus('connected');
        setPrices(prev => {
          const next = { ...prev };
          for (const update of updates) {
            next[update.symbol] = update.price;
          }
          return next;
        });
      },
      error: () => setConnectionStatus('disconnected'),
    });

    return () => {
      subscriptionRef.current?.unsubscribe();
      cryptoWSService.disconnect();
    };
  }, []);

  return { prices, connectionStatus };
}
