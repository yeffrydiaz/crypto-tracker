import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePortfolio } from '../usePortfolio';

describe('usePortfolio', () => {
  it('calculates portfolio value using current prices', () => {
    const prices = { bitcoin: 50000, ethereum: 3000, solana: 100 };
    const { result } = renderHook(() => usePortfolio(prices));

    // Default portfolio: 0.5 BTC + 5 ETH + 20 SOL
    // 0.5 * 50000 + 5 * 3000 + 20 * 100 = 25000 + 15000 + 2000 = 42000
    expect(result.current.portfolioValue).toBe(42000);
  });

  it('calculates positive P&L when prices increase', () => {
    const prices = { bitcoin: 50000, ethereum: 3000, solana: 100 };
    const { result } = renderHook(() => usePortfolio(prices));
    // Cost: 0.5*42000 + 5*2200 + 20*95 = 21000 + 11000 + 1900 = 33900
    // Value: 42000
    expect(result.current.pnl).toBeGreaterThan(0);
  });

  it('adds asset to portfolio', () => {
    const prices = {};
    const { result } = renderHook(() => usePortfolio(prices));
    const initialCount = result.current.items.length;

    act(() => {
      result.current.addAsset({
        assetId: 'chainlink',
        symbol: 'chainlink',
        name: 'Chainlink',
        amount: 100,
        avgBuyPrice: 15,
      });
    });

    expect(result.current.items.length).toBe(initialCount + 1);
  });

  it('removes asset from portfolio', () => {
    const prices = {};
    const { result } = renderHook(() => usePortfolio(prices));
    const initialCount = result.current.items.length;

    act(() => {
      result.current.removeAsset('bitcoin');
    });

    expect(result.current.items.length).toBe(initialCount - 1);
    expect(result.current.items.find(i => i.assetId === 'bitcoin')).toBeUndefined();
  });

  it('uses avgBuyPrice when price data not available', () => {
    const prices = {}; // No price data
    const { result } = renderHook(() => usePortfolio(prices));
    // Value should equal cost when using avgBuyPrice
    expect(result.current.portfolioValue).toBe(result.current.totalCost);
    expect(result.current.pnl).toBe(0);
  });
});
