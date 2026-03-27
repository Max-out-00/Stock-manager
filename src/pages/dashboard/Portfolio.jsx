import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../../components/common/Navbar';
import { AuthContext } from '../../context/AuthContext';

const Portfolio = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user?._id) {
      return;

    }

    fetch(`/api/userData/${user._id}`) // Use the backend API endpoint
      .then(response => response.json())
      .then(data => {
        setUserData(data);
        setLoading(false);
      });
  }, [user?._id]);

  if (loading) {
    return <p>Loading data...</p>;
  }
  return (
    <div>
      <Navbar />
      {/*------------------------------------------ List of stocks buyed ------------------------------------------------------------*/}
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead className='text-black'>
            <tr>
              <th>S.No.</th>
              <th>Stock</th>
              <th>Money</th>
              <th>Shares</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((item, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{item.stock}</td>
                <td>{item.money}</td>
                <td>{item.share}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/*---------------------------------------------------------------------------------------------------------------------------*/}
    </div>
  );
};

export default Portfolio;
