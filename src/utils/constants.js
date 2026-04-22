// Application constants

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const STOCK_SYMBOLS = [
  'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'
];

export const STOCK_LIST = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'META', name: 'Meta Platforms, Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'NFLX', name: 'Netflix, Inc.' },
  { symbol: 'ADBE', name: 'Adobe Inc.' },
];

export const TIMEFRAMES = [
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '6M', value: '6m' },
  { label: '1Y', value: '1y' }
];
