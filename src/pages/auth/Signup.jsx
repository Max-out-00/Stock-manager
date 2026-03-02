import { METHODS } from 'http';
import { url } from 'inspector';
import React from 'react';

const Signup = () => {

  async function signup(e){
    const url = "http://localhost:8080/signin"
    const data = await fetch(url ,{
      method : "POST",
      headers :{
        "Content-Type": "application/json"
      },
      body: JSON.stringify{
        email,
        password
      }

    })
  }
  
  return (
    <form onSubmit={signup}>

      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Signup</legend>

        <label className="label">Email</label>
        <input type="email"
          className="input"
          name='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email" />

        <label className="label">Password</label>
        <input  type="password" 
                name='password'
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
        className="input" placeholder="Password" />

        <button type='submit' className="btn btn-neutral mt-4">Signup</button>
      </fieldset>
    </form>
  );
};

export default Signup;
