import { useQuery } from "@tanstack/react-query";
import { t } from "@/lib/i18n";
import { Promotion } from "@shared/schema";
import { useLanguage } from "@/contexts/LanguageContext";

const PromotionsSection = () => {
  const { language } = useLanguage();
  
  const { data: promotions, isLoading } = useQuery<Promotion[]>({
    queryKey: ['/api/promotions/active'],
  });
  
  if (isLoading) {
    return (
      <section className="mb-10" aria-labelledby="special-offers-loading">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
          <h2 id="special-offers-loading" className="text-xl font-bold">{t('specialOffers')}</h2>
          <button 
            className="text-primary hover:text-primary-dark dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
            aria-label={t('viewAllPromotions')}
            disabled
          >
            {t('viewAll')}
          </button>
        </div>
        
        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6" 
          aria-busy="true"
          aria-label={t('loadingPromotions')}
        >
          {[...Array(2)].map((_, index) => (
            <div 
              key={index} 
              className="bg-neutral-200 dark:bg-neutral-700 rounded-xl overflow-hidden shadow-md h-48 animate-pulse"
              role="presentation"
            />
          ))}
        </div>
      </section>
    );
  }
  
  if (!promotions || promotions.length === 0) {
    return null;
  }
  
  return (
    <section className="mb-10" aria-labelledby="special-offers-title">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <h2 id="special-offers-title" className="text-xl font-bold">{t('specialOffers')}</h2>
        <button 
          className="text-primary hover:text-primary-dark dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
          aria-label={t('viewAllPromotions')}
        >
          {t('viewAll')}
        </button>
      </div>
      
      <div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        role="list"
        aria-label={t('promotionsList')}
      >
        {promotions.slice(0, 2).map((promotion: Promotion) => {
          const isEven = promotion.id % 2 === 0;
          const gradientClass = isEven 
            ? 'from-secondary to-secondary-dark dark:from-secondary-600 dark:to-secondary-800' 
            : 'from-accent to-accent-dark dark:from-accent-600 dark:to-accent-800';
          const title = language === 'en' ? promotion.titleEn : promotion.titleAr;
          const description = language === 'en' ? promotion.descriptionEn : promotion.descriptionAr;
          
          return (
            <article 
              key={promotion.id} 
              className={`bg-gradient-to-r ${gradientClass} text-white rounded-xl overflow-hidden shadow-md flex flex-col md:flex-row`}
              role="listitem"
            >
              <div className="md:w-2/5 p-6 flex flex-col justify-center">
                <span className="text-sm uppercase tracking-wider mb-2 text-white/90">
                  {isEven ? t('limitedTime') : t('weekendSpecial')}
                </span>
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="mb-4 text-white/90">{description}</p>
                <button 
                  className={`
                    bg-white font-medium py-2 px-4 rounded-lg inline-block w-max 
                    ${isEven ? 'text-secondary hover:text-secondary-dark' : 'text-accent hover:text-accent-dark'} 
                    hover:bg-neutral-50 active:bg-neutral-100 transition-colors
                  `}
                  aria-label={t('bookNowFor', { title })}
                >
                  {t('bookNow')}
                </button>
              </div>
              <div className="md:w-3/5">
                <img 
                  src={promotion.image} 
                  alt={title}
                  className="w-full h-48 md:h-full object-cover"
                  loading="lazy"
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default PromotionsSection;
