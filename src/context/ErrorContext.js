import React, { createContext, useContext, useState, useEffect } from 'react';
import { setErrorContextCallback } from './ErrorContextManager';

const ErrorContext = createContext();

export function ErrorProvider({ children }) {
  const [error, setError] = useState(null);

  const setBackendError = (message, status) => {
    setError({ message, status });
  };

  const clearError = () => {
    setError(null);
  };

  // Share setError with ErrorContextManager
  useEffect(() => {
    setErrorContextCallback(setError);
    return () => setErrorContextCallback(null);
  }, []);

  return (
    <ErrorContext.Provider value={{ error, setBackendError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
}

export const useError = () => useContext(ErrorContext);