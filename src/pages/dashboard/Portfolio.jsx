import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../../components/common/Navbar';
import BuySell from './BuySell';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/constants';

const Portfolio = ({ showNavbar = true }) => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [transactionMode, setTransactionMode] = useState('buy'); 
  const { user } = useContext(AuthContext);

  const fetchPortfolioData = () => {
    if (!user?._id) {
      return;
    }

    fetch(`${API_BASE_URL}/api/userData/${user._id}`)
      .then(response => response.json())
      .then(data => {
        setUserData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPortfolioData();
  }, [user?._id]);

  const handleBuy = (item) => {
    setSelectedStock(item);
    setTransactionMode('buy');
    setModalOpen(true);
  };

  const handleSell = (item) => {
    setSelectedStock(item);
    setTransactionMode('sell');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStock(null);
  };

  const handleTransactionSuccess = () => {
    fetchPortfolioData();
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  return (
    <div>
      {showNavbar && <Navbar />}
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200 p-6">
        <div className="w-full h-full bg-white shadow-2xl rounded-2xl p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Stock Portfolio</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="bg-gray-800 text-white text-sm uppercase tracking-wider">
                  <th className="p-4 rounded-l-xl">S.No.</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Price ($)</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Total ($)</th>
                  <th className="p-4 rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((item, index) => {
                  const isObject = item.stock && typeof item.stock === 'object';
                  const symbol = isObject ? item.stock.symbol : item.stock;
                  const name = isObject ? item.stock.name : '';
                  const price = isObject ? item.stock.price : item.money;
                  const quantity = item.quantity ?? item.share ?? 0;
                  const total = item.total ?? item.money ?? (price * quantity).toFixed(2);

                  return (
                    <tr
                      key={index}
                      className="bg-white shadow-md hover:shadow-lg transition duration-200 text-center"
                    >
                      <td className="p-4 rounded-l-xl font-semibold text-gray-600">{index + 1}</td>
                      <td className="p-4 font-medium text-blue-600">
                        {symbol}
                        {name && <div className="text-sm text-gray-500">{name}</div>}
                      </td>
                      <td className="p-4 text-green-600 font-semibold">${Number(price).toFixed(2)}</td>
                      <td className="p-4 text-gray-700">{quantity}</td>
                      <td className="p-4 text-gray-700">${Number(total).toFixed(2)}</td>
                      <td className="p-4 rounded-r-xl text-gray-700 space-x-2">
                        <button 
                          onClick={() => handleBuy(item)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg transition"
                        >
                          Buy
                        </button>
                        <button 
                          onClick={() => handleSell(item)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition"
                        >
                          Sell
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {userData.length === 0 && (
            <p className="text-center text-gray-500 mt-6 text-lg">No stocks added yet</p>
          )}
        </div>
      </div>

      {/* Buy/Sell Modal */}
      {modalOpen && selectedStock && (
        <BuySell
          stock={selectedStock.stock}
          quantity={selectedStock.quantity}
          documentId={selectedStock._id}
          mode={transactionMode}
          onClose={handleCloseModal}
          onSuccess={handleTransactionSuccess}
        />
      )}
    </div>
  );
};

export default Portfolio;
