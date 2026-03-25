import { usePortfolio } from '../hooks/usePortfolio';

interface Props {
  prices: Record<string, number>;
}

export function Portfolio({ prices }: Props) {
  const { items, portfolioValue, pnl, pnlPercent } = usePortfolio(prices);

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-6">My Portfolio</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/30">
          <p className="text-xs text-gray-400 mb-1">Total Value</p>
          <p className="text-xl font-bold text-white">
            ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/30">
          <p className="text-xs text-gray-400 mb-1">Total P&L</p>
          <p className={`text-xl font-bold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {pnl >= 0 ? '+' : ''}${pnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/30">
          <p className="text-xs text-gray-400 mb-1">P&L %</p>
          <p className={`text-xl font-bold ${pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-700">
              <th className="pb-3 pr-4">Asset</th>
              <th className="pb-3 pr-4 text-right">Holdings</th>
              <th className="pb-3 pr-4 text-right">Avg Buy</th>
              <th className="pb-3 pr-4 text-right">Current Price</th>
              <th className="pb-3 text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const currentPrice = prices[item.symbol] ?? item.avgBuyPrice;
              const value = item.amount * currentPrice;
              const itemPnl = (currentPrice - item.avgBuyPrice) / item.avgBuyPrice * 100;
              return (
                <tr key={item.assetId} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                  <td className="py-3 pr-4">
                    <div>
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      <p className="text-xs text-gray-400 uppercase">{item.symbol}</p>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-right text-sm text-white">{item.amount}</td>
                  <td className="py-3 pr-4 text-right text-sm text-gray-400">
                    ${item.avgBuyPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <div>
                      <p className="text-sm text-white">
                        ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className={`text-xs ${itemPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {itemPnl >= 0 ? '+' : ''}{itemPnl.toFixed(2)}%
                      </p>
                    </div>
                  </td>
                  <td className="py-3 text-right text-sm font-medium text-white">
                    ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
