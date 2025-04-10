import { useQuery } from "@tanstack/react-query";
import { t } from "@/lib/i18n";
import { Promotion } from "@shared/schema";
import { useLanguage } from "@/contexts/LanguageContext";

const PromotionsSection = () => {
  const { language } = useLanguage();
  
  const { data: promotions, isLoading } = useQuery({
    queryKey: ['/api/promotions/active'],
  });
  
  if (isLoading) {
    return (
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{t('specialOffers')}</h2>
          <button className="text-primary hover:text-primary-dark font-medium">
            {t('viewAll')}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="bg-neutral-200 rounded-xl overflow-hidden shadow-md h-48 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!promotions || promotions.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t('specialOffers')}</h2>
        <button className="text-primary hover:text-primary-dark font-medium">
          {t('viewAll')}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promotions.slice(0, 2).map((promotion: Promotion) => (
          <div 
            key={promotion.id} 
            className={`bg-gradient-to-r ${promotion.id % 2 === 0 ? 'from-secondary to-secondary-dark' : 'from-accent to-accent-dark'} text-white rounded-xl overflow-hidden shadow-md flex flex-col md:flex-row`}
          >
            <div className="md:w-2/5 p-6 flex flex-col justify-center">
              <span className="text-sm uppercase tracking-wider mb-2">{promotion.id % 2 === 0 ? t('limitedTime') : t('weekendSpecial')}</span>
              <h3 className="text-xl font-bold mb-2">{language === 'en' ? promotion.titleEn : promotion.titleAr}</h3>
              <p className="mb-4">{language === 'en' ? promotion.descriptionEn : promotion.descriptionAr}</p>
              <button className={`bg-white ${promotion.id % 2 === 0 ? 'text-secondary' : 'text-accent-dark'} font-medium py-2 px-4 rounded-lg inline-block w-max hover:bg-opacity-90 transition`}>
                {t('bookNow')}
              </button>
            </div>
            <div className="md:w-3/5">
              <img 
                src={promotion.image} 
                alt={language === 'en' ? promotion.titleEn : promotion.titleAr} 
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotionsSection;
