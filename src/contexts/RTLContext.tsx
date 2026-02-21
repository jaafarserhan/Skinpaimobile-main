import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface RTLContextType {
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
  toggleLanguage: () => void;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
}

const RTLContext = createContext<RTLContextType>({
  isRTL: false,
  direction: 'ltr',
  toggleLanguage: () => {},
  currentLanguage: 'en',
  setLanguage: () => {}
});

export const useRTL = () => useContext(RTLContext);

interface RTLProviderProps {
  children: React.ReactNode;
}

export function RTLProvider({ children }: RTLProviderProps) {
  const { i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(i18n.language === 'ar');

  useEffect(() => {
    const rtl = i18n.language === 'ar';
    setIsRTL(rtl);
    
    // Update document direction and lang attribute
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    
    // Add/remove RTL class for Tailwind
    if (rtl) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <RTLContext.Provider value={{
      isRTL,
      direction: isRTL ? 'rtl' : 'ltr',
      toggleLanguage,
      currentLanguage: i18n.language,
      setLanguage
    }}>
      {children}
    </RTLContext.Provider>
  );
}
