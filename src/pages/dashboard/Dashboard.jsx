import React, { useState, useContext } from 'react';
import Navbar from '../../components/common/Navbar';
import PriceChart from '../../components/charts/PriceChart';
import VolumeChart from '../../components/charts/VolumeChart';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {

  const url = "http://localhost:5000/dashboard";

  const [stock, setStock] = useState("");
  const [money, setMoney] = useState("");
  const [share, setShare] = useState("");

  // grab logged-in user from context so we can associate the entry
  const { user } = useContext(AuthContext);


  //-==-==-==-=-==-=-=-=-=-=-=-=-=-=-===-=-=- Handling stockes=----------------------------------------
  
  async function handleSubmit(e) {
    e.preventDefault();

    if (!stock || !money || !share) {
      alert("Please fill all fields");
      return;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        stock,
        money,
        share,
        userId: user?._id
      })
    });

    const data = await response.json();

    if (data.success) {
      alert("Add successful");

      // clear fields
      setStock("");
      setMoney("");
      setShare("");
    } else {
      alert(data.message);
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen ">

        <form
          className="flex flex-row items-end gap-4 bg-white border border-base-300 rounded-box p-6 shadow-md w-around m-2.5 justify-center"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <label className="label">Stock</label>
            <input
              type="text"
              className="input bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Which Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="label">Money</label>
            <input
              type="number"
              className="input bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Money Invested"
              value={money}
              onChange={(e) => setMoney(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="label">Share</label>
            <input
              type="number"
              className="input bg-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="How Many Shares"
              value={share}
              onChange={(e) => setShare(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-neutral h-10" type="submit">
            ADD
          </button>
        </form>

        <div className="chart mt-10 w-full max-w-5xl">
          <PriceChart />
          <VolumeChart />
        </div>

      </div>
    </>
  );
};

export default Dashboard;