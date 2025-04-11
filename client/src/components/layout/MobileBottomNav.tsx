import { Link, useLocation } from "wouter";
import { t } from "@/lib/i18n";
import { Search, Calendar, Heart, User } from "lucide-react";

const MobileBottomNav = () => {
  const [location] = useLocation();
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background shadow-lg border-t border-neutral-200 dark:border-neutral-800 z-50 safe-bottom">
      <div className="flex justify-around px-2 py-1">
        <Link 
          href="/" 
          className={`
            relative py-2 px-4 flex flex-col items-center rounded-xl min-w-[64px]
            ${location === '/' 
              ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' 
              : 'text-neutral-500 hover:text-primary-600 active:bg-neutral-100 dark:hover:text-primary-400 dark:active:bg-neutral-800 transition-colors'
            }
          `}
        >
          <Search className="w-5 h-5" strokeWidth={2.5} />
          <span className="text-xs font-medium mt-1">{t('discover')}</span>
          {location === '/' && (
            <span className="absolute -bottom-1 left-1/2 w-1 h-1 rounded-full bg-primary-600 transform -translate-x-1/2" />
          )}
        </Link>
        
        <Link 
          href="/appointments" 
          className={`
            relative py-2 px-4 flex flex-col items-center rounded-xl min-w-[64px]
            ${location === '/appointments' 
              ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' 
              : 'text-neutral-500 hover:text-primary-600 active:bg-neutral-100 dark:hover:text-primary-400 dark:active:bg-neutral-800 transition-colors'
            }
          `}
        >
          <Calendar className="w-5 h-5" strokeWidth={2.5} />
          <span className="text-xs font-medium mt-1">{t('appointments')}</span>
          {location === '/appointments' && (
            <span className="absolute -bottom-1 left-1/2 w-1 h-1 rounded-full bg-primary-600 transform -translate-x-1/2" />
          )}
        </Link>
        
        <Link 
          href="/favorites" 
          className={`
            relative py-2 px-4 flex flex-col items-center rounded-xl min-w-[64px]
            ${location === '/favorites' 
              ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' 
              : 'text-neutral-500 hover:text-primary-600 active:bg-neutral-100 dark:hover:text-primary-400 dark:active:bg-neutral-800 transition-colors'
            }
          `}
        >
          <Heart className="w-5 h-5" strokeWidth={2.5} />
          <span className="text-xs font-medium mt-1">{t('favorites')}</span>
          {location === '/favorites' && (
            <span className="absolute -bottom-1 left-1/2 w-1 h-1 rounded-full bg-primary-600 transform -translate-x-1/2" />
          )}
        </Link>
        
        <Link 
          href="/profile" 
          className={`
            relative py-2 px-4 flex flex-col items-center rounded-xl min-w-[64px]
            ${location === '/profile' 
              ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' 
              : 'text-neutral-500 hover:text-primary-600 active:bg-neutral-100 dark:hover:text-primary-400 dark:active:bg-neutral-800 transition-colors'
            }
          `}
        >
          <User className="w-5 h-5" strokeWidth={2.5} />
          <span className="text-xs font-medium mt-1">{t('profile')}</span>
          {location === '/profile' && (
            <span className="absolute -bottom-1 left-1/2 w-1 h-1 rounded-full bg-primary-600 transform -translate-x-1/2" />
          )}
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav;
