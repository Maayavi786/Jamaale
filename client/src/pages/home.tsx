import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
    <div className="mb-8">
      <div className="flex border-b border-neutral-300">
        <button className="px-4 py-2 text-primary border-b-2 border-primary font-medium">
          <i className="fas fa-search mr-2 rtl:ml-2 rtl:mr-0"></i>
          <span>{t('discover')}</span>
        </button>
        <a href="/appointments" className="px-4 py-2 text-neutral-600 hover:text-primary transition font-medium">
          <i className="fas fa-calendar-alt mr-2 rtl:ml-2 rtl:mr-0"></i>
          <span>{t('appointments')}</span>
        </a>
        <a href="/favorites" className="px-4 py-2 text-neutral-600 hover:text-primary transition font-medium">
          <i className="fas fa-heart mr-2 rtl:ml-2 rtl:mr-0"></i>
          <span>{t('favorites')}</span>
        </a>
        <a href="/profile" className="px-4 py-2 text-neutral-600 hover:text-primary transition font-medium">
          <i className="fas fa-user mr-2 rtl:ml-2 rtl:mr-0"></i>
          <span>{t('profile')}</span>
        </a>
      </div>
    </div>
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
    setSearchQuery(query);
    // In a real app, this would trigger an API call or filter the results
  };
  
  // Toggle filter
  const handleToggleFilter = (filterId: string) => {
    setFilters(filters.map(filter => 
      filter.id === filterId 
        ? { ...filter, isActive: !filter.isActive } 
        : filter
    ));
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setFilters(filters.map(filter => ({ ...filter, isActive: false })));
  };
  
  // Handle category selection
  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategoryId(categoryId === selectedCategoryId ? undefined : categoryId);
  };
  
  return (
    <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
      <TabNavigation />
      
      <SearchBar 
        onSearch={handleSearch}
        onFilterClick={() => setShowFilterModal(true)}
        onMapClick={() => setShowMapView(true)}
      />
      
      <FilterChips 
        filters={filters}
        onToggleFilter={handleToggleFilter}
        onClearAll={handleClearFilters}
      />
      
      <CategorySelector 
        onSelectCategory={handleSelectCategory}
        selectedCategoryId={selectedCategoryId}
      />
      
      <FeaturedSalons />
      
      <PromotionsSection />
    </main>
  );
};

export default Home;
