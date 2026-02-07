import React , {useState,useEffect} from 'react';

import Navbar from '../../components/common/Navbar';
const Dashboard = () => {
  
  const[Stock , setStock] = useState("");
  const[Money , setMoney] = useState("");
  const[Share , setShare] = useState("");

  const[portfolio , Setportfolio] = useState([]);

  const handleSubmit = ()=>{
    
  }

  return (
    <>
      <Navbar />

      <form className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <fieldset className="fieldset">
          <label className="label">Stock</label>
          <input type="email" className="input validator" placeholder="Which Stock" required />
          <p className="validator-hint hidden">Required</p>
        </fieldset>

        <label className="fieldset">
          <span className="label">Money</span>
          <input type="password" className="input validator" placeholder="Money Invested" required />
          <span className="validator-hint hidden">Required</span>
        </label>

        <label className="fieldset">
          <span className="label">Share</span>
          <input type="password" className="input validator" placeholder="How Many Shares" required />
          <span className="validator-hint hidden">Required</span>
        </label>

        <button className="btn btn-neutral mt-4" type="submit">ADD</button>
        <button className="btn btn-ghost mt-1" type="reset">CLEAR</button>
      </form>
    
    
    </>

  );
};

export default Dashboard;
