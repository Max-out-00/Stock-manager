import React, { useState } from 'react';

import Navbar from '../../components/common/Navbar';
import PriceChart from '../../components/charts/PriceChart';
import VolumeChart from '../../components/charts/VolumeChart';

const Dashboard = () => {
  
  const [stock, setStock] = useState("");
  const [money, setMoney] = useState("");
  const [share, setShare] = useState("");

  const [portfolio, setPortfolio] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!stock || !money || !share) {
      alert("Please fill all fields");
      return;
    }

    setPortfolio(data => ({ ...data, [stock]: { money, share } }));       // {stock: { money, share } } this is how the portfolio will look like after adding a stock
    
    setStock("");
    setMoney("");
    setShare("");
  };

  return (
    <>
      <Navbar />

      <form className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4" onSubmit={handleSubmit}>
        <fieldset className="fieldset">
          <label className="label">Stock</label>
          <input 
            type="text" 
            name="stock"
            className="input validator" 
            placeholder="Which Stock" 
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required 
          />
          <p className="validator-hint hidden">Required</p>
        </fieldset>

        <label className="fieldset">
          <span className="label">Money</span>
          <input 
            type="number" 
            name="money"
            className="input validator" 
            placeholder="Money Invested" 
            value={money}
            onChange={(e) => setMoney(e.target.value)}
            required 
          />
          <span className="validator-hint hidden">Required</span>
        </label>

        <label className="fieldset">
          <span className="label">Share</span>
          <input 
            type="number" 
            name="share"
            className="input validator" 
            placeholder="How Many Shares" 
            value={share}
            onChange={(e) => setShare(e.target.value)}
            required 
          />
          <span className="validator-hint hidden">Required</span>
        </label>

        <button className="btn btn-neutral mt-4" type="submit">ADD</button>
        <button className="btn btn-ghost mt-1" type="reset">CLEAR</button>
      </form>

      <div className="chart">

        <PriceChart/>
        <VolumeChart/>

      </div>


    </>

  );
};

export default Dashboard;
