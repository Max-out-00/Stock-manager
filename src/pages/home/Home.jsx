import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to <span className="text-blue-600">Stock Manager</span>
        </h1>
        <p className="mt-4 text-gray-600">
          Track your investments, manage your portfolio,
          and grow your wealth smarter.
        </p>
        <div className="mt-8 flex flex-col gap-4 rounded-r-4xl">
          <Link
            to="/login"
            className="btn btn-primary w-full btn-circle"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="btn btn-outline btn-primary w-full btn-circle"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
