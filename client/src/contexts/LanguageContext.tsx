import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { t, setLanguage } from "@/lib/i18n";

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
  // Initialize language from localStorage or default to English
  const [language, setLang] = useState<string>(() => {
    const savedLanguage = localStorage.getItem("language");
    return savedLanguage || "en";
  });
  
  // Determine text direction based on language
  const direction = language === "ar" ? "rtl" : "ltr";
  
  // Toggle between English and Arabic
  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ar" : "en";
    setLang(newLanguage);
    localStorage.setItem("language", newLanguage);
    setLanguage(newLanguage);
  };
  
  // Set initial language
  useEffect(() => {
    setLanguage(language);
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [language, direction]);
  
  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
