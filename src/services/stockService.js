const API_KEY = import.meta.env.VITE_STOCK_API_KEY;
export async function getStockInfo(symbol) {
  if (!API_KEY) {
    return { success: false, message: 'Missing stock API key. Set VITE_STOCK_API_KEY in .env.' };
  }

  const url = `https://financialmodelingprep.com/stable/quote?symbol=${symbol}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const quote = Array.isArray(result) && result.length > 0 ? result[0] : null;

    if (!quote) {
      return { success: false, message: 'No stock data found for that symbol.' };
    }

    return {
      success: true,
      data: {
        symbol: quote.symbol,
        name: quote.name || quote.symbol,
        price: quote.price ?? quote.close ?? 0,
        change: quote.change ?? 0,
        changePercentage: quote.changesPercentage ?? 0,
        exchange: quote.exchangeShortName || quote.exchange || 'N/A',
      },
    };
  } catch (error) {
    console.error('Fetch error:', error.message);
    return { success: false, message: error.message || 'Unable to fetch stock details.' };
  }
}
