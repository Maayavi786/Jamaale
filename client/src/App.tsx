import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AuthPage from "@/pages/auth-page";
import Appointments from "@/pages/appointments";
import Favorites from "@/pages/favorites";
import Profile from "@/pages/profile";
import StaffDemo from "@/pages/staff-demo";
import Header from "@/components/layout/Header";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import LanguageToggle from "@/components/layout/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect } from "react";

function App() {
  const [location] = useLocation();
  const { language, direction } = useLanguage();
  const { theme } = useTheme();
  const { user } = useAuth();
  
  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = direction;
    root.className = theme;
    
    document.title = language === 'en' ? 'SalonBookKSA | Salon Booking System' : 'صالون بوك KSA | نظام حجز الصالونات';
  }, [language, direction, theme]);
  
  const isAuthPage = location === '/auth';
  const rootClasses = [direction === 'rtl' ? 'rtl' : 'ltr', theme].filter(Boolean).join(' ');
  
  return (
    <div className={rootClasses}>
      {!isAuthPage && <Header />}
      
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/appointments" component={Appointments} />
        <Route path="/favorites" component={Favorites} />
        <Route path="/profile" component={Profile} />
        <Route path="/staff-demo" component={StaffDemo} />
        <Route component={NotFound} />
      </Switch>
      
      {!isAuthPage && <LanguageToggle />}
      {!isAuthPage && <MobileBottomNav />}
      <Toaster />
    </div>
  );
}

export default App;
