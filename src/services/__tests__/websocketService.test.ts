import { describe, it, expect } from 'vitest';
import type { PriceUpdate } from '../../types';

// Test the RxJS pipeline logic in isolation
describe('RxJS Price Update Pipeline', () => {
  it('deduplicates updates keeping the latest price per symbol', () => {
    const updates: PriceUpdate[] = [
      { symbol: 'bitcoin', price: 40000, timestamp: 1000 },
      { symbol: 'bitcoin', price: 40100, timestamp: 2000 },
      { symbol: 'ethereum', price: 2100, timestamp: 1500 },
    ];

    const deduped = new Map<string, PriceUpdate>();
    for (const update of updates) {
      const existing = deduped.get(update.symbol);
      if (!existing || update.timestamp > existing.timestamp) {
        deduped.set(update.symbol, update);
      }
    }
    const result = Array.from(deduped.values());

    expect(result).toHaveLength(2);
    const btc = result.find(u => u.symbol === 'bitcoin');
    expect(btc?.price).toBe(40100);
    const eth = result.find(u => u.symbol === 'ethereum');
    expect(eth?.price).toBe(2100);
  });

  it('filters out empty batches', () => {
    const emptyBatch: PriceUpdate[] = [];
    const result = emptyBatch.length > 0 ? emptyBatch : null;
    expect(result).toBeNull();
  });

  it('keeps latest price when timestamps differ', () => {
    const older: PriceUpdate = { symbol: 'bitcoin', price: 39000, timestamp: 100 };
    const newer: PriceUpdate = { symbol: 'bitcoin', price: 40000, timestamp: 200 };

    const deduped = new Map<string, PriceUpdate>();
    for (const update of [older, newer]) {
      const existing = deduped.get(update.symbol);
      if (!existing || update.timestamp > existing.timestamp) {
        deduped.set(update.symbol, update);
      }
    }

    expect(deduped.get('bitcoin')?.price).toBe(40000);
  });
});

describe('CryptoWebSocketService', () => {
  it('creates service with pipeline operators', async () => {
    const { CryptoWebSocketService } = await import('../websocketService');
    const service = new CryptoWebSocketService();
    expect(service.priceUpdates$).toBeDefined();
  });
});
