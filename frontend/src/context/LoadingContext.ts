import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the structure of the loading context
type LoadingContextType = {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
};

// Create the context with a default value
const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setLoading: () => {},
});

// Provider component to wrap around the app
export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook for accessing the loading context
export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }

  return context;
};
