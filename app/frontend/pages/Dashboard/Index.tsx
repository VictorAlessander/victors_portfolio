import Header from "@/components/ui/Header";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface Asset {
  symbol: string;
  value: number;
  percentage: number;
  quantity: number;
  cost: number;
  profit_loss: number;
  profit_loss_percentage: number;
}

interface RecentOperation {
  id: number;
  op_type: string;
  symbol: string;
  quantity: number;
  cost: number;
  currency: string;
  date: string;
}

interface PortfolioData {
  total_invested: number;
  total_market_value: number;
  total_profit_loss: number;
  total_profit_loss_percentage: number;
  number_of_assets: number;
  number_of_operations: number;
  allocation_by_symbol: Asset[];
  allocation_by_sector: Array<{ name: string; value: number; percentage: number }>;
  allocation_by_category: Array<{ name: string; value: number; percentage: number }>;
  recent_operations: RecentOperation[];
  top_performers: Asset[];
  portfolio_distribution: Array<{ name: string; value: number }>;
}

interface DashboardProps {
  portfolio: PortfolioData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function Dashboard({ portfolio }: DashboardProps) {
  const profitLossColor = portfolio.total_profit_loss >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <>
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Portfolio Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Invested</h3>
            <p className="text-2xl font-bold mt-2">{formatCurrency(portfolio.total_invested)}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Market Value</h3>
            <p className="text-2xl font-bold mt-2">{formatCurrency(portfolio.total_market_value)}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Profit/Loss</h3>
            <p className={`text-2xl font-bold mt-2 ${profitLossColor}`}>
              {formatCurrency(portfolio.total_profit_loss)}
            </p>
            <p className={`text-sm mt-1 ${profitLossColor}`}>
              {portfolio.total_profit_loss_percentage >= 0 ? '+' : ''}
              {portfolio.total_profit_loss_percentage}%
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Assets</h3>
            <p className="text-2xl font-bold mt-2">{portfolio.number_of_assets}</p>
            <p className="text-sm text-gray-500 mt-1">{portfolio.number_of_operations} operations</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Portfolio Distribution Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Portfolio Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolio.portfolio_distribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name} (${((entry.value / portfolio.total_market_value) * 100).toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {portfolio.portfolio_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                {/*<Legend />*/}
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Assets Bar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Top Assets by Value</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={portfolio.allocation_by_symbol.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="symbol" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Allocation */}
        {portfolio.allocation_by_sector.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Sector Allocation</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={portfolio.allocation_by_sector}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => `${formatCurrency(value)} (${((value as number / portfolio.total_market_value) * 100).toFixed(1)}%)`} />
                <Bar dataKey="value" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Detailed Assets Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Asset Allocation</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Market Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">P&L</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">P&L %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Allocation</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {portfolio.allocation_by_symbol.map((asset) => (
                  <tr key={asset.symbol}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{asset.symbol}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{asset.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(asset.cost)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(asset.value)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${asset.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(asset.profit_loss)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${asset.profit_loss_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {asset.profit_loss_percentage >= 0 ? '+' : ''}{asset.profit_loss_percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{asset.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Operations */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Operations</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {portfolio.recent_operations.map((op) => (
                  <tr key={op.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{op.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded ${op.op_type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {op.op_type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{op.symbol}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{op.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(op.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
