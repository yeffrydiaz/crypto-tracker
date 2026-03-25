import { useState, useCallback, useMemo } from 'react';
import type { PortfolioItem } from '../types';

const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  { assetId: 'bitcoin', symbol: 'bitcoin', name: 'Bitcoin', amount: 0.5, avgBuyPrice: 42000 },
  { assetId: 'ethereum', symbol: 'ethereum', name: 'Ethereum', amount: 5, avgBuyPrice: 2200 },
  { assetId: 'solana', symbol: 'solana', name: 'Solana', amount: 20, avgBuyPrice: 95 },
];

export function usePortfolio(prices: Record<string, number>) {
  const [items, setItems] = useState<PortfolioItem[]>(DEFAULT_PORTFOLIO);

  const portfolioValue = useMemo(() => {
    return items.reduce((total, item) => {
      const price = prices[item.symbol] ?? item.avgBuyPrice;
      return total + item.amount * price;
    }, 0);
  }, [items, prices]);

  const totalCost = useMemo(() => {
    return items.reduce((total, item) => total + item.amount * item.avgBuyPrice, 0);
  }, [items]);

  const pnl = portfolioValue - totalCost;
  const pnlPercent = totalCost > 0 ? (pnl / totalCost) * 100 : 0;

  const addAsset = useCallback((item: PortfolioItem) => {
    setItems(prev => {
      const existing = prev.findIndex(p => p.symbol === item.symbol);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = item;
        return updated;
      }
      return [...prev, item];
    });
  }, []);

  const removeAsset = useCallback((assetId: string) => {
    setItems(prev => prev.filter(p => p.assetId !== assetId));
  }, []);

  return { items, portfolioValue, totalCost, pnl, pnlPercent, addAsset, removeAsset };
}
