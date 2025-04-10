import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Appointments from "@/pages/appointments";
import Favorites from "@/pages/favorites";
import Profile from "@/pages/profile";
import Header from "@/components/layout/Header";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import LanguageToggle from "@/components/layout/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

function App() {
  const [location] = useLocation();
  const { language, direction } = useLanguage();
  
  useEffect(() => {
    // Set HTML lang and dir attributes
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    
    // Set page title
    document.title = language === 'en' ? 'SalonBookKSA | Salon Booking System' : 'صالون بوك KSA | نظام حجز الصالونات';
  }, [language, direction]);
  
  return (
    <div className={direction === 'rtl' ? 'rtl' : 'ltr'}>
      <Header />
      
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/appointments" component={Appointments} />
        <Route path="/favorites" component={Favorites} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
      
      <LanguageToggle />
      <MobileBottomNav />
      <Toaster />
    </div>
  );
}

export default App;
