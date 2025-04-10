import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();
  
  // This forces a proper rerender with new translations
  const handleToggleLanguage = () => {
    console.log("Toggling language from floating button:", language);
    toggleLanguage();
    
    // Force rerender by causing the browser to reload
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  
  return (
    <div className="fixed bottom-6 right-6 rtl:left-6 rtl:right-auto z-10">
      <button 
        className="bg-white shadow-lg rounded-full p-3 flex items-center hover:bg-neutral-100 transition"
        onClick={handleToggleLanguage}
        aria-label={t('switchLanguage') || 'Switch language'}
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
