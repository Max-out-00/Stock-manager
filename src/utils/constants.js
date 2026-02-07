// Application constants

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const STOCK_SYMBOLS = [
  'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'
];

export const TIMEFRAMES = [
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '6M', value: '6m' },
  { label: '1Y', value: '1y' }
];
