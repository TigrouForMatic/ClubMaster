import React, { createContext, useContext, useState, useEffect } from 'react';

const MobileContext = createContext();

export const MobileProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <MobileContext.Provider value={isMobile}>
      {children}
    </MobileContext.Provider>
  );
};

export const useMobile = () => useContext(MobileContext);