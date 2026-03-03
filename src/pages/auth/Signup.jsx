import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function signup(e) {
    e.preventDefault();  

    const url = "http://localhost:5000/register"; // backend register route

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();

    if (data.success) {
      alert("Signup successful");
      navigate("/dashboard");  
    } else {
      alert(data.message);
    }
  }

  return (
    <form onSubmit={signup}>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Signup</legend>

        <label>Email</label>
        <input
          type="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <label>Password</label>
        <input
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button type="submit" className="btn btn-neutral mt-4">
          Signup
        </button>
      </fieldset>
    </form>
  );
};

export default Signup;