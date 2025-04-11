import { useState, useRef, useEffect } from "react";
import { t } from "@/lib/i18n";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterClick: () => void;
  onMapClick: () => void;
}

const SearchBar = ({ onSearch, onFilterClick, onMapClick }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && e.metaKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <motion.div 
      className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg dark:shadow-none border border-neutral-200/50 dark:border-neutral-700"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSearch} className="p-3">
        <div className="relative">
          <div 
            className={`
              relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors duration-200
              ${isFocused ? 'bg-neutral-50 dark:bg-neutral-700/50' : 'bg-transparent'}
            `}
          >
            <Search 
              className={`w-5 h-5 transition-colors duration-200 ${isFocused ? 'text-primary-600' : 'text-neutral-400'}`}
              strokeWidth={2.5}
            />
            
            <input 
              ref={inputRef}
              type="text" 
              placeholder={t('searchPlaceholder')}
              className="
                flex-1 bg-transparent border-none outline-none placeholder-neutral-400
                text-neutral-900 dark:text-neutral-100
                focus:ring-0 focus:outline-none
              "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              aria-label={t('searchPlaceholder')}
            />
            
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors"
                aria-label={t('clearSearch')}
              >
                <svg className="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
            
            {!searchQuery && (
              <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-700 rounded">
                <span className="text-[8px]">⌘</span>
                <span>/</span>
              </kbd>
            )}
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default SearchBar;
