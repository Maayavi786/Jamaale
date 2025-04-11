import * as React from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";

interface LanguageToggleProps {
  className?: string;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = "" }) => {
  const { language, direction, toggleLanguage } = useLanguage();
  
  const handleToggleLanguage = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      console.log('LanguageToggle: Button clicked');
      console.log('LanguageToggle: Current language before toggle:', language);
      console.log('LanguageToggle: Current direction before toggle:', direction);
      
      // Update localStorage directly as a backup
      const newLang = language === 'en' ? 'ar' : 'en';
      localStorage.setItem('appLanguage', newLang);
      
      // Update document attributes directly as a backup
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      
      // Call the context's toggle function
      toggleLanguage();
      
      console.log('LanguageToggle: Toggle completed');
      console.log('LanguageToggle: New language:', newLang);
      console.log('LanguageToggle: New direction:', document.documentElement.dir);
    } catch (error) {
      console.error('LanguageToggle: Error during language toggle:', error);
      // Attempt recovery
      const currentLang = localStorage.getItem('appLanguage') || 'en';
      document.documentElement.lang = currentLang;
      document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [language, direction, toggleLanguage]);
  
  React.useEffect(() => {
    console.log('LanguageToggle: Component mounted');
    console.log('LanguageToggle: Current language:', language);
    console.log('LanguageToggle: Current direction:', direction);
    console.log('LanguageToggle: Document dir:', document.documentElement.dir);
    console.log('LanguageToggle: Document lang:', document.documentElement.lang);
    console.log('LanguageToggle: LocalStorage appLanguage:', localStorage.getItem('appLanguage'));
    
    // Ensure document attributes are in sync
    if (document.documentElement.lang !== language) {
      console.log('LanguageToggle: Fixing document lang attribute');
      document.documentElement.lang = language;
    }
    if (document.documentElement.dir !== direction) {
      console.log('LanguageToggle: Fixing document dir attribute');
      document.documentElement.dir = direction;
    }
    
    return () => {
      console.log('LanguageToggle: Component unmounted');
    };
  }, [language, direction]);
  
  return (
    <div className="fixed bottom-6 right-6 rtl:left-6 rtl:right-auto z-10">
      <button 
        className={`bg-white shadow-lg rounded-full p-3 flex items-center hover:bg-neutral-100 transition ${className}`}
        onClick={handleToggleLanguage}
        aria-label={t('switchLanguage')}
      >
        <i className="fas fa-globe text-neutral-600 mr-2 rtl:ml-2 rtl:mr-0"></i>
        <span className="text-neutral-600 font-medium">
          {language === 'en' ? 'EN | عربي' : 'عربي | EN'}
        </span>
      </button>
    </div>
  );
};

export default LanguageToggle;
