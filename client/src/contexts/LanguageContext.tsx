import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { t, setLanguage, getCurrentLanguage } from "@/lib/i18n";

interface LanguageContextType {
  language: string;
  direction: string;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  direction: "ltr",
  toggleLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Initialize language from i18n module which reads from localStorage
  const [language, setLang] = useState<string>(getCurrentLanguage());
  
  // Determine text direction based on language
  const direction = language === "ar" ? "rtl" : "ltr";
  
  // Toggle between English and Arabic
  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ar" : "en";
    setLang(newLanguage);
    
    // Use the new improved setLanguage function that handles localStorage and DOM updates
    setLanguage(newLanguage);
    
    // Force re-render of all components that use translations
    window.dispatchEvent(new Event('languageChanged'));
  };
  
  // Set initial language
  useEffect(() => {
    setLanguage(language);
  }, []);
  
  // Listen for language change events from other components
  useEffect(() => {
    const handleStorageChange = () => {
      const currentLang = getCurrentLanguage();
      if (currentLang !== language) {
        setLang(currentLang);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('languageChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languageChanged', handleStorageChange);
    };
  }, [language]);
  
  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
