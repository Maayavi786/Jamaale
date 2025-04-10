import { t } from "@/lib/i18n";

export interface Filter {
  id: string;
  label: string;
  isActive: boolean;
}

interface FilterChipsProps {
  filters: Filter[];
  onToggleFilter: (filterId: string) => void;
  onClearAll: () => void;
}

const FilterChips = ({ filters, onToggleFilter, onClearAll }: FilterChipsProps) => {
  const activeFilters = filters.filter(filter => filter.isActive);
  
  if (activeFilters.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {activeFilters.map(filter => (
        <button 
          key={filter.id}
          className={`${filter.id === 'ladiesOnly' ? 'bg-primary-light text-primary-dark' : 'bg-neutral-200 text-neutral-700'} px-3 py-1 rounded-full text-sm font-medium flex items-center`}
          onClick={() => onToggleFilter(filter.id)}
        >
          <span>{filter.label}</span>
          <i className="fas fa-times-circle ml-2 rtl:mr-2 rtl:ml-0"></i>
        </button>
      ))}
      
      {activeFilters.length > 0 && (
        <button 
          className="text-primary hover:underline text-sm font-medium"
          onClick={onClearAll}
        >
          {t('clearAll')}
        </button>
      )}
    </div>
  );
};

export default FilterChips;
