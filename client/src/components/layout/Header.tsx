import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Bell, Globe, User, Search, Calendar, Heart } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <header 
      className="bg-white shadow-sm sticky top-0 z-50 saudi-fade-in" 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      lang={language}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/">
              <div className="text-primary-600 text-2xl font-bold cursor-pointer hover:text-primary-700 transition-colors duration-300">
                <span className={language === 'ar' ? 'font-arabic' : ''}>{t('appName')}</span>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/">
                <span className={`text-neutral-600 hover:text-primary-600 transition-colors duration-300 cursor-pointer ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('home')}
                </span>
              </Link>
              <Link href="/staff-demo">
                <span className={`text-neutral-600 hover:text-primary-600 transition-colors duration-300 cursor-pointer ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('staff')}
                </span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              className="text-neutral-600 hover:text-primary-600 transition-colors duration-300 flex items-center gap-2"
              onClick={toggleLanguage}
              aria-label={t('switchLanguage')}
            >
              <span className={`font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                {language === 'en' ? 'العربية' : 'English'}
              </span>
              <Globe className="w-5 h-5" />
            </button>
            
            <button className="text-neutral-600 hover:text-primary-600 transition-colors duration-300 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 rtl:left-0 rtl:right-auto w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {user ? (
              <div className="relative flex items-center gap-2">
                <span className={`hidden md:inline text-neutral-700 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {user.fullName}
                </span>
                <div className="relative group">
                  <Button variant="ghost" className="p-0 h-10 w-10 rounded-full overflow-hidden hover:bg-neutral-100 transition-colors duration-300">
                    <img 
                      className="h-full w-full object-cover" 
                      src={user.profileImage || "https://via.placeholder.com/32"} 
                      alt={t('userAvatar')} 
                    />
                  </Button>
                  <div className="absolute right-0 rtl:left-0 rtl:right-auto top-full mt-2 w-48 bg-white shadow-lg rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 saudi-slide-up">
                    <div className="py-1">
                      <Link href="/profile">
                        <div className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 cursor-pointer transition-colors duration-300">
                          <User className="w-4 h-4" />
                          <span className={`flex-1 ${language === 'ar' ? 'font-arabic' : ''}`}>{t('profile')}</span>
                        </div>
                      </Link>
                      <Link href="/appointments">
                        <div className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 cursor-pointer transition-colors duration-300">
                          <Calendar className="w-4 h-4" />
                          <span className={`flex-1 ${language === 'ar' ? 'font-arabic' : ''}`}>{t('appointments')}</span>
                        </div>
                      </Link>
                      <Link href="/favorites">
                        <div className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 cursor-pointer transition-colors duration-300">
                          <Heart className="w-4 h-4" />
                          <span className={`flex-1 ${language === 'ar' ? 'font-arabic' : ''}`}>{t('favorites')}</span>
                        </div>
                      </Link>
                      <button 
                        onClick={logout}
                        className="flex items-center gap-2 w-full text-left rtl:text-right px-4 py-2 text-sm text-red-600 hover:bg-neutral-100 transition-colors duration-300"
                      >
                        <span className={`flex-1 ${language === 'ar' ? 'font-arabic' : ''}`}>{t('logout')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/auth">
                <div className="flex items-center text-neutral-600 hover:text-primary-600 transition-colors duration-300 cursor-pointer">
                  <span className={`mr-2 rtl:ml-2 rtl:mr-0 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t('login')}
                  </span>
                  <User className="w-5 h-5" />
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
