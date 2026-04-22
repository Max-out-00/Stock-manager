import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import { predictionService } from '../../services/predictionService';
import { STOCK_LIST, TIMEFRAMES } from '../../utils/constants';

const Predictions = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1m');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!selectedSymbol) {
      setError('Please select a stock symbol');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const result = await predictionService.analyzeStock(selectedSymbol, selectedTimeframe);

      if (result.success) {
        setAnalysis(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to analyze stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'BUY': return 'text-green-600 bg-green-100';
      case 'SELL': return 'text-red-600 bg-red-100';
      case 'HOLD': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 70) return 'text-green-600';
    if (confidence >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Stock Prediction Engine
            </h1>
            <p className="text-lg text-gray-600">
              Get AI-powered buy/sell recommendations based on technical analysis
            </p>
          </div>

          {/* Analysis Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Analyze Stock</h2>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Symbol
                </label>
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a stock...</option>
                  {STOCK_LIST.map((stock) => (
                    <option key={stock.symbol} value={stock.symbol}>
                      {stock.symbol} - {stock.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeframe
                </label>
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {TIMEFRAMES.map((tf) => (
                    <option key={tf.value} value={tf.value}>
                      {tf.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  {loading ? 'Analyzing...' : 'Analyze Stock'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-6">
              {/* Stock Overview */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {analysis.name} ({analysis.symbol})
                  </h3>
                  <div className={`px-4 py-2 rounded-full font-semibold ${getRecommendationColor(analysis.recommendation.recommendation)}`}>
                    {analysis.recommendation.recommendation}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Current Price</p>
                    <p className="text-2xl font-bold text-gray-800">${analysis.currentPrice.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Change</p>
                    <p className={`text-xl font-semibold ${analysis.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {analysis.change >= 0 ? '+' : ''}${analysis.change.toFixed(2)} ({analysis.changePercentage.toFixed(2)}%)
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Confidence</p>
                    <p className={`text-xl font-semibold ${getConfidenceColor(analysis.recommendation.confidence)}`}>
                      {analysis.recommendation.confidence}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Indicators */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Technical Indicators</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysis.indicators.rsi && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">RSI (14)</p>
                      <p className="text-lg font-semibold">{analysis.indicators.rsi}</p>
                      <p className="text-xs text-gray-500">
                        {parseFloat(analysis.indicators.rsi) > 70 ? 'Overbought' :
                         parseFloat(analysis.indicators.rsi) < 30 ? 'Oversold' : 'Neutral'}
                      </p>
                    </div>
                  )}

                  {analysis.indicators.sma20 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">SMA (20)</p>
                      <p className="text-lg font-semibold">${analysis.indicators.sma20}</p>
                    </div>
                  )}

                  {analysis.indicators.bollingerBands && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Bollinger Bands</p>
                      <p className="text-xs">Upper: ${analysis.indicators.bollingerBands.upper}</p>
                      <p className="text-xs">Middle: ${analysis.indicators.bollingerBands.middle}</p>
                      <p className="text-xs">Lower: ${analysis.indicators.bollingerBands.lower}</p>
                    </div>
                  )}

                  {analysis.indicators.macd && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">MACD</p>
                      <p className="text-xs">MACD: {analysis.indicators.macd.macd}</p>
                      <p className="text-xs">Signal: {analysis.indicators.macd.signal}</p>
                      <p className="text-xs">Hist: {analysis.indicators.macd.histogram}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Trading Signals */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Trading Signals</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(analysis.signals).map(([indicator, signal]) => (
                    indicator !== 'overall' && (
                      <div key={indicator} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium capitalize">{indicator.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className={`px-2 py-1 rounded text-sm font-semibold ${
                          signal.signal === 'buy' || signal.signal === 'bullish' || signal.signal === 'oversold'
                            ? 'bg-green-100 text-green-800'
                            : signal.signal === 'sell' || signal.signal === 'bearish' || signal.signal === 'overbought'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {signal.signal.toUpperCase()}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Recommendation & Targets */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Trading Recommendation</h3>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">Action: {analysis.recommendation.recommendation}</p>
                      <p className="text-sm text-gray-600">Confidence: {analysis.recommendation.confidence}%</p>
                    </div>
                    <div className={`px-6 py-3 rounded-full font-bold text-lg ${getRecommendationColor(analysis.recommendation.recommendation)}`}>
                      {analysis.recommendation.recommendation}
                    </div>
                  </div>

                  {analysis.recommendation.targetPrice && (
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Target Price</p>
                        <p className="text-xl font-bold text-green-600">${analysis.recommendation.targetPrice.target.toFixed(2)}</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Stop Loss</p>
                        <p className="text-xl font-bold text-red-600">${analysis.recommendation.targetPrice.stopLoss.toFixed(2)}</p>
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {analysis.analysis}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predictions;