import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";

const Header = () => {
  const { user } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-primary text-2xl font-bold">
              <span>{t('appName')}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button className="text-neutral-600 hover:text-primary transition">
              <i className="fas fa-bell"></i>
            </button>
            <div className="relative">
              <button 
                className="flex items-center text-neutral-600 hover:text-primary transition"
                onClick={toggleLanguage}
              >
                <span className="mr-2 rtl:ml-2 rtl:mr-0">{language === 'en' ? 'English' : 'العربية'}</span>
                <i className="fas fa-globe"></i>
              </button>
            </div>
            <div className="relative">
              {user ? (
                <button className="flex items-center text-neutral-600 hover:text-primary transition">
                  <span className="mr-2 rtl:ml-2 rtl:mr-0">{user.fullName}</span>
                  <img 
                    className="h-8 w-8 rounded-full" 
                    src={user.profileImage || "https://via.placeholder.com/32"} 
                    alt={t('userAvatar')} 
                  />
                </button>
              ) : (
                <button className="flex items-center text-neutral-600 hover:text-primary transition">
                  <span className="mr-2 rtl:ml-2 rtl:mr-0">{t('login')}</span>
                  <i className="fas fa-user"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
