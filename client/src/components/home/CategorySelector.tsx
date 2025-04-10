import { useQuery } from "@tanstack/react-query";
import { t } from "@/lib/i18n";
import { Category } from "@shared/schema";

interface CategorySelectorProps {
  onSelectCategory: (categoryId: number) => void;
  selectedCategoryId?: number;
}

const CategorySelector = ({ onSelectCategory, selectedCategoryId }: CategorySelectorProps) => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/categories'],
  });
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{t('categories')}</h2>
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex flex-col items-center animate-pulse">
              <div className="w-16 h-16 rounded-full bg-neutral-200 mb-2"></div>
              <div className="h-4 w-16 bg-neutral-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories?.map((category: Category) => (
            <div 
              key={category.id} 
              className="flex flex-col items-center cursor-pointer"
              onClick={() => onSelectCategory(category.id)}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                selectedCategoryId === category.id 
                  ? 'bg-primary text-white' 
                  : category.id % 2 === 0 
                    ? 'bg-primary-light text-primary-dark' 
                    : 'bg-secondary-light text-secondary-dark'
              }`}>
                <i className={`fas ${category.iconClass} text-xl`}></i>
              </div>
              <span className="text-sm font-medium text-center">
                {t('language') === 'en' ? category.nameEn : category.nameAr}
              </span>
            </div>
          ))}
          
          <div 
            className="flex flex-col items-center cursor-pointer"
            onClick={() => onSelectCategory(0)}
          >
            <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center mb-2 text-neutral-600">
              <i className="fas fa-ellipsis-h text-xl"></i>
            </div>
            <span className="text-sm font-medium text-center">{t('more')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
