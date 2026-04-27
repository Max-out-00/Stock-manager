import React, { useState, useContext } from 'react';
import Navbar from '../../components/common/Navbar';
import PriceChart from '../../components/charts/PriceChart';
import VolumeChart from '../../components/charts/VolumeChart';
import { AuthContext } from '../../context/AuthContext';
import { getStockInfo, getHistoricalData } from '../../services/stockService';
import { API_BASE_URL, STOCK_LIST } from '../../utils/constants';


const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockDetails, setStockDetails] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [chartData, setChartData] = useState({ prices: [], volumes: [], labels: [] });
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);
  const totalValue = stockDetails ? (stockDetails.price * Number(quantity || '0')).toFixed(2) : '0.00';

  const { user } = useContext(AuthContext);

  const handleFetchQuote = async () => {
    const symbol = searchTerm?.trim().toUpperCase();
    if (!symbol) {
      alert('Please enter a stock symbol');
      return;
    }

    setLoadingQuote(true);
    setChartLoading(true);
    setChartError(null);
    
    try {
      const result = await getStockInfo(symbol);

      if (!result.success) {
        throw new Error(result.message || 'Unable to load stock quote');
      }
      setStockDetails(result.data);
      setQuantity('1');

      // Fetch historical data for charts
      const historicalResult = await getHistoricalData(symbol, 30);
      if (historicalResult && historicalResult.success && historicalResult.data) {
        const safeData = {
          prices: Array.isArray(historicalResult.data.prices) ? historicalResult.data.prices : [],
          volumes: Array.isArray(historicalResult.data.volumes) ? historicalResult.data.volumes : [],
          labels: Array.isArray(historicalResult.data.labels) ? historicalResult.data.labels : [],
        };
        setChartData(safeData);
      } else {
        setChartError(historicalResult?.message || 'Unable to load chart data');
        setChartData({ prices: [], volumes: [], labels: [] });
      }
    } catch (error) {
      alert(error.message);
      setStockDetails(null);
      setChartData({ prices: [], volumes: [], labels: [] });
    } finally {
      setLoadingQuote(false);
      setChartLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stockDetails || !stockDetails.symbol) {
      alert('Please search and select a stock first');
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    const price = Number(stockDetails.price) || 0;
    if (price === 0) {
      alert('Invalid stock price');
      return;
    }

    const total = Number((price * Number(quantity)).toFixed(2));
    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stock: stockDetails,
          quantity: Number(quantity),
          total,
          userId: user?._id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Stock added successfully');
        setSearchTerm('');
        setStockDetails(null);
        setQuantity('1');
      } else {
        alert(data.message || 'Failed to add stock');
      }
    } catch (error) {
      alert(error.message || 'Failed to add stock');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl bg-white border border-base-300 rounded-box p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Search and Add Stock</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col">
              <label className="label">Search symbol</label>
              <input
                list="stockSymbols"
                type="text"
                className="input bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter stock symbol e.g. AAPL"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <datalist id="stockSymbols">
                {STOCK_LIST.map((item) => (
                  <option key={item.symbol} value={item.symbol}>
                    {item.name}
                  </option>
                ))}
              </datalist>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                className="btn btn-primary w-full"
                onClick={handleFetchQuote}
                disabled={loadingQuote}
              >
                {loadingQuote ? 'Loading...' : 'Fetch Stock'}
              </button>
            </div>
          </div>

          {stockDetails && stockDetails.symbol && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold">{stockDetails?.name || stockDetails?.symbol || 'Stock'}</h3>
                <p><strong>Symbol:</strong> {stockDetails?.symbol || 'N/A'}</p>
                <p><strong>Price:</strong> ${Number(stockDetails?.price || 0).toFixed(2)}</p>
                <p><strong>Change:</strong> {Number(stockDetails?.change || 0).toFixed(2)} ({Number(stockDetails?.changePercentage || 0).toFixed(2)}%)</p>
                <p><strong>Exchange:</strong> {stockDetails?.exchange || 'N/A'}</p>
              </div>

              <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
                <div className="flex flex-col">
                  <label className="label">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    className="input bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="label">Total investment</label>
                  <input
                    type="text"
                    className="input bg-gray-100 border border-gray-300"
                    value={`$${totalValue}`}
                    readOnly
                  />
                </div>
                <button className="btn btn-success w-full" type="submit" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add to Portfolio'}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="chart mt-10 w-full max-w-5xl space-y-8">
          <PriceChart
            prices={chartData.prices}
            labels={chartData.labels}
            symbol={stockDetails?.symbol}
            loading={chartLoading}
            error={chartError}
          />
          <VolumeChart
            volumes={chartData.volumes}
            labels={chartData.labels}
            symbol={stockDetails?.symbol}
            loading={chartLoading}
            error={chartError}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;