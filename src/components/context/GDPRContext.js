import React from 'react';

export const GDPRContext = React.createContext(null);

export default function GDPRProvider({ children }) {
  const [showGDPR, setShowGDPR] = React.useState(false);

  const store = [showGDPR, setShowGDPR];

  return <GDPRContext.Provider value={store}>{children}</GDPRContext.Provider>;
};
