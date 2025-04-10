import { Link, useLocation } from "wouter";
import { t } from "@/lib/i18n";

const MobileBottomNav = () => {
  const [location] = useLocation();
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-10">
      <div className="flex justify-around">
        <Link href="/" className={`py-3 flex flex-col items-center ${location === '/' ? 'text-primary' : 'text-neutral-500 hover:text-primary transition'}`}>
          <i className="fas fa-search text-lg"></i>
          <span className="text-xs mt-1">{t('discover')}</span>
        </Link>
        <Link href="/appointments" className={`py-3 flex flex-col items-center ${location === '/appointments' ? 'text-primary' : 'text-neutral-500 hover:text-primary transition'}`}>
          <i className="fas fa-calendar-alt text-lg"></i>
          <span className="text-xs mt-1">{t('appointments')}</span>
        </Link>
        <Link href="/favorites" className={`py-3 flex flex-col items-center ${location === '/favorites' ? 'text-primary' : 'text-neutral-500 hover:text-primary transition'}`}>
          <i className="fas fa-heart text-lg"></i>
          <span className="text-xs mt-1">{t('favorites')}</span>
        </Link>
        <Link href="/profile" className={`py-3 flex flex-col items-center ${location === '/profile' ? 'text-primary' : 'text-neutral-500 hover:text-primary transition'}`}>
          <i className="fas fa-user text-lg"></i>
          <span className="text-xs mt-1">{t('profile')}</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav;
