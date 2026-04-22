// Prediction service API calls
import { getStockInfo } from './stockService';
import {
  calculateRSI,
  calculateSMA,
  calculateEMA,
  calculateBollingerBands,
  calculateMACD
} from '../utils/indicators';

export const predictionService = {
  async getStockHistory(symbol, timeframe = '1m') {
    try {
      // For MVP, we'll use a simplified approach
      // In production, you'd want to use a proper historical data API
      const currentData = await getStockInfo(symbol);

      if (!currentData.success) {
        return { success: false, message: currentData.message };
      }

      // Generate mock historical data based on current price
      // This is a simplified approach for MVP
      const basePrice = currentData.data.price;
      const historicalPrices = this.generateMockHistoricalData(basePrice, timeframe);

      return {
        success: true,
        data: {
          symbol: currentData.data.symbol,
          name: currentData.data.name,
          currentPrice: basePrice,
          historicalPrices,
          change: currentData.data.change,
          changePercentage: currentData.data.changePercentage
        }
      };
    } catch (error) {
      return { success: false, message: 'Unable to fetch historical data' };
    }
  },

  // Generate mock historical data for MVP (replace with real API in production)
  generateMockHistoricalData(basePrice, timeframe) {
    const periods = this.getPeriodsForTimeframe(timeframe);
    const prices = [];
    let currentPrice = basePrice;

    for (let i = 0; i < periods; i++) {
      // Add some random volatility
      const change = (Math.random() - 0.5) * 0.1; // -5% to +5% change
      currentPrice = currentPrice * (1 + change);
      prices.push(parseFloat(currentPrice.toFixed(2)));
    }

    return prices;
  },

  // Get number of periods based on timeframe
  getPeriodsForTimeframe(timeframe) {
    const periodMap = {
      '1d': 24,    // hourly data for 1 day
      '1w': 7,     // daily data for 1 week
      '1m': 30,    // daily data for 1 month
      '3m': 90,    // daily data for 3 months
      '6m': 180,   // daily data for 6 months
      '1y': 365    // daily data for 1 year
    };
    return periodMap[timeframe] || 30;
  },

  // Analyze stock and provide prediction
  async analyzeStock(symbol, timeframe = '1m') {
    try {
      const historyData = await this.getStockHistory(symbol, timeframe);

      if (!historyData.success) {
        return historyData;
      }

      const { historicalPrices, currentPrice } = historyData.data;

      // Calculate technical indicators
      const rsi = calculateRSI(historicalPrices);
      const sma20 = calculateSMA(historicalPrices, 20);
      const sma50 = calculateSMA(historicalPrices, 50);
      const bb = calculateBollingerBands(historicalPrices);
      const macd = calculateMACD(historicalPrices);

      // Generate trading signals
      const signals = this.generateSignals({
        prices: historicalPrices,
        currentPrice,
        rsi,
        sma20,
        sma50,
        bb,
        macd
      });

      // Generate recommendation
      const recommendation = this.generateRecommendation(signals, currentPrice);

      return {
        success: true,
        data: {
          ...historyData.data,
          indicators: {
            rsi: rsi ? rsi.toFixed(2) : null,
            sma20: sma20 ? sma20[sma20.length - 1]?.toFixed(2) : null,
            sma50: sma50 ? sma50[sma50.length - 1]?.toFixed(2) : null,
            bollingerBands: bb ? {
              upper: bb[bb.length - 1].upper.toFixed(2),
              middle: bb[bb.length - 1].middle.toFixed(2),
              lower: bb[bb.length - 1].lower.toFixed(2)
            } : null,
            macd: macd ? {
              macd: macd.macd[macd.macd.length - 1]?.toFixed(4),
              signal: macd.signal ? macd.signal[macd.signal.length - 1]?.toFixed(4) : null,
              histogram: macd.histogram ? macd.histogram[macd.histogram.length - 1]?.toFixed(4) : null
            } : null
          },
          signals,
          recommendation,
          analysis: this.generateAnalysisText(signals, recommendation)
        }
      };
    } catch (err) {
      return { success: false, message: 'Analysis failed: ' + err.message };
    }
  },

  // Generate trading signals based on indicators
  generateSignals({ currentPrice, rsi, sma20, sma50, bb, macd }) {
    const signals = {
      rsi: { signal: 'neutral', strength: 0 },
      movingAverage: { signal: 'neutral', strength: 0 },
      bollingerBands: { signal: 'neutral', strength: 0 },
      macd: { signal: 'neutral', strength: 0 },
      overall: { signal: 'hold', confidence: 0 }
    };

    // RSI signals
    if (rsi !== null) {
      if (rsi > 70) {
        signals.rsi = { signal: 'overbought', strength: 1 };
      } else if (rsi < 30) {
        signals.rsi = { signal: 'oversold', strength: 1 };
      } else if (rsi > 60) {
        signals.rsi = { signal: 'sell', strength: 0.5 };
      } else if (rsi < 40) {
        signals.rsi = { signal: 'buy', strength: 0.5 };
      }
    }

    // Moving Average signals
    if (sma20 && sma50 && sma20.length > 0 && sma50.length > 0) {
      const sma20_latest = sma20[sma20.length - 1];
      const sma50_latest = sma50[sma50.length - 1];

      if (sma20_latest > sma50_latest) {
        signals.movingAverage = { signal: 'bullish', strength: 0.7 };
      } else {
        signals.movingAverage = { signal: 'bearish', strength: 0.7 };
      }
    }

    // Bollinger Bands signals
    if (bb && bb.length > 0) {
      const bb_latest = bb[bb.length - 1];
      const position = (currentPrice - bb_latest.lower) / (bb_latest.upper - bb_latest.lower);

      if (position > 0.8) {
        signals.bollingerBands = { signal: 'overbought', strength: 0.6 };
      } else if (position < 0.2) {
        signals.bollingerBands = { signal: 'oversold', strength: 0.6 };
      }
    }

    // MACD signals
    if (macd && macd.histogram && macd.histogram.length > 0) {
      const histogram = macd.histogram[macd.histogram.length - 1];
      if (histogram > 0) {
        signals.macd = { signal: 'bullish', strength: 0.8 };
      } else {
        signals.macd = { signal: 'bearish', strength: 0.8 };
      }
    }

    return signals;
  },

  // Generate overall recommendation
  generateRecommendation(signals, currentPrice) {
    let buySignals = 0;
    let sellSignals = 0;
    let totalStrength = 0;

    // Count signals and calculate confidence
    Object.values(signals).forEach(signal => {
      if (signal.signal === 'buy' || signal.signal === 'bullish' || signal.signal === 'oversold') {
        buySignals++;
        totalStrength += signal.strength || 0;
      } else if (signal.signal === 'sell' || signal.signal === 'bearish' || signal.signal === 'overbought') {
        sellSignals++;
        totalStrength += signal.strength || 0;
      }
    });

    const confidence = Math.min(totalStrength / 4, 1); // Max 100% confidence

    let recommendation = 'HOLD';
    let action = 'hold';
    let reasoning = [];

    if (buySignals > sellSignals) {
      recommendation = 'BUY';
      action = 'buy';
      reasoning.push('More indicators suggest upward momentum');
    } else if (sellSignals > buySignals) {
      recommendation = 'SELL';
      action = 'sell';
      reasoning.push('More indicators suggest downward pressure');
    } else {
      reasoning.push('Mixed signals from technical indicators');
    }

    return {
      recommendation,
      action,
      confidence: Math.round(confidence * 100),
      reasoning,
      targetPrice: this.calculateTargetPrice(currentPrice, action, confidence)
    };
  },

  // Calculate target price based on recommendation
  calculateTargetPrice(currentPrice, action, confidence) {
    const volatility = 0.05; // 5% base volatility
    const adjustment = volatility * (confidence / 100);

    if (action === 'buy') {
      return {
        stopLoss: currentPrice * (1 - adjustment * 0.5),
        target: currentPrice * (1 + adjustment * 2)
      };
    } else if (action === 'sell') {
      return {
        stopLoss: currentPrice * (1 + adjustment * 0.5),
        target: currentPrice * (1 - adjustment * 2)
      };
    }

    return {
      stopLoss: currentPrice * (1 - volatility * 0.3),
      target: currentPrice * (1 + volatility * 0.3)
    };
  },

  // Generate human-readable analysis text
  generateAnalysisText(signals, recommendation) {
    const { rsi, movingAverage, bollingerBands, macd } = signals;

    let analysis = `Technical Analysis for ${recommendation.recommendation}:\n\n`;

    analysis += `RSI (${rsi.signal}): ${rsi.signal === 'overbought' ? 'Stock may be overvalued' : rsi.signal === 'oversold' ? 'Stock may be undervalued' : 'Neutral'}\n`;
    analysis += `Moving Averages (${movingAverage.signal}): ${movingAverage.signal === 'bullish' ? 'Upward trend' : 'Downward trend'}\n`;
    analysis += `Bollinger Bands (${bollingerBands.signal}): ${bollingerBands.signal === 'overbought' ? 'Near upper resistance' : bollingerBands.signal === 'oversold' ? 'Near lower support' : 'Within normal range'}\n`;
    analysis += `MACD (${macd.signal}): ${macd.signal === 'bullish' ? 'Positive momentum' : 'Negative momentum'}\n\n`;

    analysis += `Recommendation: ${recommendation.recommendation} with ${recommendation.confidence}% confidence\n`;
    if (recommendation.targetPrice) {
      analysis += `Target Price: $${recommendation.targetPrice.target.toFixed(2)}\n`;
      analysis += `Stop Loss: $${recommendation.targetPrice.stopLoss.toFixed(2)}\n`;
    }

    return analysis;
  }
};
