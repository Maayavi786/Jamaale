import * as React from 'react';
import { t, setLanguage, getCurrentLanguage } from "@/lib/i18n";

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  toggleLanguage: () => void;
}

const defaultContext: LanguageContextType = {
  language: 'en',
  direction: 'ltr',
  toggleLanguage: () => {},
};

const LanguageContext = React.createContext<LanguageContextType>(defaultContext);

export const useLanguage = () => {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLang] = React.useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem("appLanguage");
      console.log('LanguageProvider: Initial savedLang:', savedLang);
      const initialLang = (savedLang === 'en' || savedLang === 'ar') ? savedLang : 'en';
      console.log('LanguageProvider: Using initialLang:', initialLang);
      return initialLang;
    } catch (error) {
      console.error('LanguageProvider: Error reading from localStorage:', error);
      return 'en';
    }
  });
  
  const direction = React.useMemo<Direction>(() => {
    const dir = language === "ar" ? "rtl" : "ltr";
    console.log('LanguageProvider: Direction updated:', dir, 'for language:', language);
    return dir;
  }, [language]);
  
  const toggleLanguage = React.useCallback(() => {
    console.log('LanguageProvider: toggleLanguage called');
    setLang(prevLang => {
      const newLang = prevLang === "en" ? "ar" : "en";
      console.log('LanguageProvider: Updating language from', prevLang, 'to', newLang);
      try {
        localStorage.setItem("appLanguage", newLang);
        document.documentElement.lang = newLang;
        document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
        setLanguage(newLang);
      } catch (error) {
        console.error('LanguageProvider: Error during language toggle:', error);
      }
      return newLang;
    });
  }, []);
  
  React.useEffect(() => {
    console.log('LanguageProvider: Language changed effect:', language);
    try {
      setLanguage(language);
      localStorage.setItem("appLanguage", language);
      document.documentElement.lang = language;
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    } catch (error) {
      console.error('LanguageProvider: Error in language effect:', error);
    }
  }, [language]);
  
  React.useEffect(() => {
    const handleLanguageChange = () => {
      const currentLang = getCurrentLanguage();
      if (currentLang !== language && (currentLang === 'en' || currentLang === 'ar')) {
        setLang(currentLang);
      }
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, [language]);
  
  const value = React.useMemo(() => ({
    language,
    direction,
    toggleLanguage
  }), [language, direction, toggleLanguage]);
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
