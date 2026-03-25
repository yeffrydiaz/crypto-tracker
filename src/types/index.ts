export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  holdings?: number;
}

export interface PortfolioItem {
  assetId: string;
  symbol: string;
  name: string;
  amount: number;
  avgBuyPrice: number;
}

export interface PriceUpdate {
  symbol: string;
  price: number;
  timestamp: number;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string | null;
}
