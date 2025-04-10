import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { t, setLanguage, getCurrentLanguage } from "@/lib/i18n";

interface LanguageContextType {
  language: string;
  direction: string;
  toggleLanguage: () => void;
}

// Initialize with default values
const defaultContext: LanguageContextType = {
  language: "en",
  direction: "ltr",
  toggleLanguage: () => {},
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>(defaultContext);

// Custom hook for accessing the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

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
