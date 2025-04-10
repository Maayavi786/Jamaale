import { useState } from "react";
import { t } from "@/lib/i18n";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterClick: () => void;
  onMapClick: () => void;
}

const SearchBar = ({ onSearch, onFilterClick, onMapClick }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row md:items-center">
        <div className="flex-1 mb-3 md:mb-0 md:mr-3 rtl:md:ml-3 rtl:md:mr-0">
          <div className="relative">
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-2 rtl:left-2 rtl:right-auto top-1/2 transform -translate-y-1/2 text-neutral-500"
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
        <div className="flex">
          <button 
            type="button" 
            className="flex items-center text-neutral-600 border border-neutral-300 px-4 py-2 rounded-lg mr-2 rtl:ml-2 rtl:mr-0 hover:bg-neutral-100 transition"
            onClick={onFilterClick}
          >
            <i className="fas fa-filter mr-2 rtl:ml-2 rtl:mr-0"></i>
            <span>{t('filters')}</span>
          </button>
          <button 
            type="button" 
            className="flex items-center text-neutral-600 border border-neutral-300 px-4 py-2 rounded-lg hover:bg-neutral-100 transition"
            onClick={onMapClick}
          >
            <i className="fas fa-map-marker-alt mr-2 rtl:ml-2 rtl:mr-0"></i>
            <span>{t('map')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
