import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/constants';

const BuySell = ({ stock, quantity, documentId, onClose, onSuccess, mode = 'buy' }) => {
  const [transactionQuantity, setTransactionQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const price = stock?.price || 0;
  const transactionTotal = (price * transactionQuantity).toFixed(2);
  const remainingQuantity = Math.max(0, quantity - transactionQuantity);

  const handleTransaction = async () => {
    if (!transactionQuantity || transactionQuantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (mode === 'sell' && transactionQuantity > quantity) {
      setError(`Cannot sell more than ${quantity} shares`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'buy' ? '/dashboard' : '/api/sellStock';
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(mode === 'buy' && {
            stock,
            quantity: transactionQuantity,
            total: transactionTotal,
            userId: user?._id,
          }),
          ...(mode === 'sell' && {
            stockId: documentId,
            quantity: transactionQuantity,
            userId: user?._id,
          }),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTransactionQuantity(1);
        onSuccess?.();
        alert(`${mode === 'buy' ? 'Bought' : 'Sold'} ${transactionQuantity} shares successfully`);
        onClose?.();
      } else {
        setError(data.message || `Failed to ${mode} stock`);
      }
    } catch (err) {
      setError(`Error during ${mode}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {mode === 'buy' ? 'Buy' : 'Sell'} Stock
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Stock Details */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Symbol</span>
            <span className="font-semibold">{stock?.symbol}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Name</span>
            <span className="text-sm">{stock?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Price</span>
            <span className="font-semibold text-green-600">${price.toFixed(2)}</span>
          </div>
          {mode === 'sell' && (
            <div className="flex justify-between mt-2 pt-2 border-t border-gray-300">
              <span className="text-sm text-gray-600">Available</span>
              <span className="font-semibold text-blue-600">{quantity} shares</span>
            </div>
          )}
        </div>

        {/* Quantity Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity to {mode === 'buy' ? 'Buy' : 'Sell'}
          </label>
          <input
            type="number"
            min="1"
            max={mode === 'sell' ? quantity : undefined}
            value={transactionQuantity}
            onChange={(e) => setTransactionQuantity(Number(e.target.value) || 1)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            {mode === 'sell' && `Max: ${quantity} shares`}
          </p>
        </div>

        {/* Transaction Summary */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Unit Price</span>
            <span className="font-semibold">${price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Quantity</span>
            <span className="font-semibold">{transactionQuantity}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-blue-300">
            <span className="text-gray-700 font-semibold">Total</span>
            <span className="font-bold text-lg text-blue-600">${transactionTotal}</span>
          </div>
          {mode === 'sell' && (
            <div className="flex justify-between mt-2">
              <span className="text-gray-700 text-sm">Remaining after sale</span>
              <span className="font-semibold text-sm">{remainingQuantity} shares</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleTransaction}
            disabled={loading}
            className={`flex-1 text-white font-semibold py-2 px-4 rounded-lg transition ${
              mode === 'buy'
                ? 'bg-green-500 hover:bg-green-600 disabled:bg-green-400'
                : 'bg-red-500 hover:bg-red-600 disabled:bg-red-400'
            }`}
          >
            {loading ? 'Processing...' : mode === 'buy' ? 'Buy' : 'Sell'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuySell;
