// Technical indicators (RSI, Moving Average, etc.)

export const calculateRSI = (prices, period = 14) => {
  if (prices.length < period + 1) return null;

  const gains = [];
  const losses = [];

  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }

  let avgGain = gains.slice(0, period).reduce((sum, gain) => sum + gain, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((sum, loss) => sum + loss, 0) / period;

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
  }

  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

export const calculateSMA = (prices, period = 20) => {
  if (prices.length < period) return null;

  const sma = [];
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  return sma;
};

export const calculateEMA = (prices, period = 20) => {
  if (prices.length < period) return null;

  const ema = [];
  const multiplier = 2 / (period + 1);

  // First EMA is SMA
  const sma = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  ema.push(sma);

  for (let i = period; i < prices.length; i++) {
    const currentEMA = (prices[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1];
    ema.push(currentEMA);
  }

  return ema;
};

export const calculateBollingerBands = (prices, period = 20, stdDev = 2) => {
  if (prices.length < period) return null;

  const sma = calculateSMA(prices, period);
  const bands = [];

  for (let i = period - 1; i < prices.length; i++) {
    const slice = prices.slice(i - period + 1, i + 1);
    const mean = sma[i - period + 1];
    const variance = slice.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / period;
    const std = Math.sqrt(variance);

    bands.push({
      upper: mean + (stdDev * std),
      middle: mean,
      lower: mean - (stdDev * std)
    });
  }

  return bands;
};

export const calculateMACD = (prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
  if (prices.length < slowPeriod) return null;

  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);

  if (!fastEMA || !slowEMA) return null;

  const macdLine = [];
  for (let i = 0; i < slowEMA.length; i++) {
    macdLine.push(fastEMA[i + (slowPeriod - fastPeriod)] - slowEMA[i]);
  }

  const signalLine = calculateEMA(macdLine, signalPeriod);
  const histogram = [];

  if (signalLine) {
    for (let i = 0; i < signalLine.length; i++) {
      histogram.push(macdLine[i + (signalPeriod - 1)] - signalLine[i]);
    }
  }

  return {
    macd: macdLine,
    signal: signalLine,
    histogram: histogram
  };
};

// Moving Average alias for backward compatibility
export const calculateMovingAverage = calculateSMA;
