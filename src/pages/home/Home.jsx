import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold">Welcome to Stock Manager</h1>
      <p className="mt-4">
        Please <Link to="/login" className="link">login</Link> or{' '}
        <Link to="/signup" className="link">sign up</Link> to continue.
      </p>
    </div>
  );
};

export default Home;
