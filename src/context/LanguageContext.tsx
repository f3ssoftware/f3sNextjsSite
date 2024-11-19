"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';

interface LanguageContextProps {
  language: string;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en', //default
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en'); 

  useEffect(() => {

    const userLanguage = navigator.language || 'en';
    setLanguage(userLanguage);
  }, []);

  return (
    <LanguageContext.Provider value={{ language }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
