import React, { createContext } from 'react';

export const StockContext = createContext();

export const StockProvider = ({ children }) => {
  return (
    <StockContext.Provider value={{}}>
      {children}
    </StockContext.Provider>
  );
};
