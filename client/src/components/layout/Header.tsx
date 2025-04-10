import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { user, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  
  // This forces a proper rerender with new translations
  const handleToggleLanguage = () => {
    console.log("Toggling language from:", language);
    toggleLanguage();
    
    // Force rerender by causing the browser to reload
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <div className="text-primary text-2xl font-bold cursor-pointer">
                <span>{t('appName')}</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button 
              className="text-neutral-600 hover:text-primary transition flex items-center gap-2"
              onClick={handleToggleLanguage}
              aria-label={t('switchLanguage')}
            >
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
              <i className="fas fa-globe"></i>
            </button>
            
            <button className="text-neutral-600 hover:text-primary transition">
              <i className="fas fa-bell"></i>
            </button>
            
            {user ? (
              <div className="relative flex items-center gap-2">
                <span className="hidden md:inline">{user.fullName}</span>
                <div className="relative group">
                  <Button variant="ghost" className="p-0 h-10 w-10 rounded-full overflow-hidden">
                    <img 
                      className="h-full w-full object-cover" 
                      src={user.profileImage || "https://via.placeholder.com/32"} 
                      alt={t('userAvatar')} 
                    />
                  </Button>
                  <div className="absolute right-0 rtl:left-0 rtl:right-auto top-full mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <Link href="/profile">
                        <div className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 cursor-pointer">
                          {t('profile')}
                        </div>
                      </Link>
                      <Link href="/appointments">
                        <div className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 cursor-pointer">
                          {t('appointments')}
                        </div>
                      </Link>
                      <Link href="/favorites">
                        <div className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 cursor-pointer">
                          {t('favorites')}
                        </div>
                      </Link>
                      <button 
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-100"
                      >
                        {t('logout')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/auth">
                <div className="flex items-center text-neutral-600 hover:text-primary transition cursor-pointer">
                  <span className="mr-2 rtl:ml-2 rtl:mr-0">{t('login')}</span>
                  <i className="fas fa-user"></i>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
