import { useLanguage } from "@/contexts/LanguageContext";
import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { direction } = useLanguage();
  
  return (
    <div 
      className="min-h-screen bg-neutral-50"
      dir={direction}
    >
      <div className="saudi-pattern">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <MobileBottomNav />
      </div>
      <Toaster />
    </div>
  );
};

export default Layout; 