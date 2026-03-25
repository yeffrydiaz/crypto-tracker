import { ethers } from 'ethers';
import type { WalletState } from '../types';

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
];

export class WalletService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;

  async connect(): Promise<WalletState> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed. Please install MetaMask to connect your wallet.');
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await this.provider.send('eth_requestAccounts', []);
    this.signer = await this.provider.getSigner();

    const network = await this.provider.getNetwork();
    const balance = await this.provider.getBalance(accounts[0]);

    return {
      connected: true,
      address: accounts[0],
      chainId: Number(network.chainId),
      balance: ethers.formatEther(balance),
    };
  }

  async disconnect(): Promise<WalletState> {
    this.provider = null;
    this.signer = null;
    return {
      connected: false,
      address: null,
      chainId: null,
      balance: null,
    };
  }

  async getTokenBalance(tokenAddress: string, walletAddress: string): Promise<{ balance: string; symbol: string; name: string }> {
    if (!this.provider) throw new Error('Wallet not connected');
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
    const [rawBalance, decimals, symbol, name] = await Promise.all([
      contract.balanceOf(walletAddress) as Promise<bigint>,
      contract.decimals() as Promise<number>,
      contract.symbol() as Promise<string>,
      contract.name() as Promise<string>,
    ]);
    return {
      balance: ethers.formatUnits(rawBalance, decimals),
      symbol,
      name,
    };
  }

  getProvider(): ethers.BrowserProvider | null {
    return this.provider;
  }

  getSigner(): ethers.Signer | null {
    return this.signer;
  }
}

export const walletService = new WalletService();
