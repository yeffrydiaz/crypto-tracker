# Crypto Portfolio Tracker

A decentralized application (dApp) for tracking cryptocurrency portfolios, monitoring real-time market trends, and executing smart contracts.

## Features

- **Real-time Prices** — Live WebSocket feed from CoinCap for BTC, ETH, SOL, ADA, DOT, LINK
- **RxJS Data Pipeline** — `throttle(100ms) → buffer(500ms) → deduplicate` to prevent browser memory leaks
- **Portfolio Tracker** — Track holdings with P&L calculation using live or fallback prices
- **Wallet Integration** — MetaMask connect/disconnect via Ethers.js
- **Smart Contract Panel** — Query ERC-20 token balances on Ethereum mainnet
- **Dark UI** — Tailwind CSS dark-themed responsive layout

## Tech Stack

- React 19 + TypeScript + Vite
- Ethers.js v6 — wallet connection & smart contract calls
- RxJS — reactive WebSocket price stream
- Tailwind CSS v4 — utility-first styling
- Vitest + Testing Library — unit tests

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | TypeScript check + production build |
| `npm test` | Run Vitest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run preview` | Preview production build |
