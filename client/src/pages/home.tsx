import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Calendar, Heart, User, MapPin, Filter as FilterIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "@/lib/i18n";

import SearchBar from "@/components/home/SearchBar";
import FilterChips, { Filter } from "@/components/home/FilterChips";
import CategorySelector from "@/components/home/CategorySelector";
import FeaturedSalons from "@/components/home/FeaturedSalons";
import PromotionsSection from "@/components/home/PromotionsSection";

// Tab navigation for the home page
const TabNavigation = () => {
  const [, params] = window.location.hash.split('#');
  
  return (
    <nav className="mb-6 bg-background sticky top-0 z-10 border-b border-neutral-200 dark:border-neutral-800" aria-label={t('mainNavigation')}>
      <div className="flex overflow-x-auto hide-scrollbar" role="tablist">
        <button 
          role="tab"
          aria-selected="true"
          aria-controls="discover-panel"
          className="px-4 py-3 text-primary border-b-2 border-primary font-medium flex items-center min-w-max"
        >
          <Search className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" aria-hidden="true" />
          <span>{t('discover')}</span>
        </button>
        <a 
          href="/appointments" 
          role="tab"
          aria-selected="false"
          aria-controls="appointments-panel"
          className="px-4 py-3 text-neutral-600 hover:text-primary transition-colors font-medium flex items-center min-w-max"
        >
          <Calendar className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" aria-hidden="true" />
          <span>{t('appointments')}</span>
        </a>
        <a 
          href="/favorites" 
          role="tab"
          aria-selected="false"
          aria-controls="favorites-panel"
          className="px-4 py-3 text-neutral-600 hover:text-primary transition-colors font-medium flex items-center min-w-max"
        >
          <Heart className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" aria-hidden="true" />
          <span>{t('favorites')}</span>
        </a>
        <a 
          href="/profile" 
          role="tab"
          aria-selected="false"
          aria-controls="profile-panel"
          className="px-4 py-3 text-neutral-600 hover:text-primary transition-colors font-medium flex items-center min-w-max"
        >
          <User className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" aria-hidden="true" />
          <span>{t('profile')}</span>
        </a>
      </div>
    </nav>
  );
};

const Home = () => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<Filter[]>([
    { id: 'ladiesOnly', label: t('ladiesOnly'), isActive: false },
    { id: 'haircut', label: t('haircut'), isActive: false },
    { id: 'riyadh', label: t('riyadh'), isActive: false },
    { id: 'fourStars', label: t('fourStarsPlus'), isActive: false }
  ]);
  
  // Handle search query
  const handleSearch = (query: string) => {
    try {
      setSearchQuery(query.trim());
      // In a real app, this would trigger an API call or filter the results
    } catch (error) {
      console.error('Error handling search:', error);
      // Here you would handle the error appropriately
    }
  };
  
  // Toggle filter
  const handleToggleFilter = (filterId: string) => {
    try {
      if (!filterId) return;
      
      setFilters(prevFilters => 
        prevFilters.map(filter => 
          filter.id === filterId 
            ? { ...filter, isActive: !filter.isActive } 
            : filter
        )
      );
    } catch (error) {
      console.error('Error toggling filter:', error);
    }
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    try {
      setFilters(prevFilters => 
        prevFilters.map(filter => ({ ...filter, isActive: false }))
      );
    } catch (error) {
      console.error('Error clearing filters:', error);
    }
  };
  
  // Handle category selection
  const handleSelectCategory = (categoryId: number) => {
    try {
      setSelectedCategoryId(prevId => 
        categoryId === prevId ? undefined : categoryId
      );
    } catch (error) {
      console.error('Error selecting category:', error);
    }
  };
  
  return (
    <main 
      className="min-h-screen bg-neutral-50 dark:bg-neutral-900"
      role="main"
      aria-label={t('mainContent')}
    >
      <TabNavigation />
      
      <div className="container mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SearchBar 
            onSearch={handleSearch}
            onFilterClick={() => setShowFilterModal(true)}
            onMapClick={() => setShowMapView(true)}
          />
          
          <div 
            className="mt-4 flex gap-2 overflow-x-auto hide-scrollbar pb-2" 
            role="toolbar" 
            aria-label={t('searchFilters')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const target = e.target as HTMLElement;
                if (target.tagName === 'BUTTON') {
                  target.click();
                }
              }
            }}
          >
            <button 
              onClick={() => setShowFilterModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:border-primary/50 transition-colors"
              aria-label={t('openFilters')}
              aria-expanded={showFilterModal}
              aria-haspopup="dialog"
            >
              <FilterIcon className="w-4 h-4" aria-hidden="true" />
              {t('filters')}
            </button>
            
            <button 
              onClick={() => setShowMapView(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:border-primary/50 transition-colors"
              aria-label={t('openMap')}
              aria-expanded={showMapView}
              aria-haspopup="dialog"
            >
              <MapPin className="w-4 h-4" aria-hidden="true" />
              {t('map')}
            </button>
          </div>
        </motion.div>
        
        <AnimatePresence>
          {filters.some(f => f.isActive) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              <FilterChips 
                filters={filters}
                onToggleFilter={handleToggleFilter}
                onClearAll={handleClearFilters}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <CategorySelector 
            onSelectCategory={handleSelectCategory}
            selectedCategoryId={selectedCategoryId}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <FeaturedSalons />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <PromotionsSection />
        </motion.div>
      </div>
    </main>
  );
};

export default Home;
