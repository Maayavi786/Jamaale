import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { t } from "@/lib/i18n";
import SalonCard from "../salons/SalonCard";
import { Salon } from "@shared/schema";

type TabType = 'featured' | 'nearby' | 'topRated';

const FeaturedSalons = () => {
  const [activeTab, setActiveTab] = useState<TabType>('featured');
  
  const { data: featuredSalons, isLoading: isLoadingFeatured } = useQuery<Salon[]>({
    queryKey: ['/api/salons/featured'],
    enabled: activeTab === 'featured',
  });
  
  const { data: nearbySalons, isLoading: isLoadingNearby } = useQuery<Salon[]>({
    queryKey: ['/api/salons/near', { lat: 24.7136, lng: 46.6753 }],
    enabled: activeTab === 'nearby',
  });
  
  const { data: topRatedSalons, isLoading: isLoadingTopRated } = useQuery<Salon[]>({
    queryKey: ['/api/salons/top-rated'],
    enabled: activeTab === 'topRated',
  });
  
  const salons = activeTab === 'featured' 
    ? featuredSalons 
    : activeTab === 'nearby' 
      ? nearbySalons 
      : topRatedSalons;
  
  const isLoading = activeTab === 'featured' 
    ? isLoadingFeatured 
    : activeTab === 'nearby' 
      ? isLoadingNearby 
      : isLoadingTopRated;
  
  return (
    <section className="mb-10" aria-labelledby="featured-salons-title">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <h2 id="featured-salons-title" className="text-xl font-bold">{t('featuredSalons')}</h2>
        <div className="flex border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-800 shadow-sm" role="tablist" aria-label={t('salonCategories')}>
          <button 
            role="tab"
            aria-selected={activeTab === 'featured'}
            aria-controls="featured-panel"
            className={`
              px-4 py-2 font-medium transition-colors relative
              ${activeTab === 'featured' 
                ? 'bg-primary text-white dark:bg-primary-600' 
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
              }
            `}
            onClick={() => setActiveTab('featured')}
          >
            {t('featured')}
            {activeTab === 'featured' && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-white dark:bg-primary-300" />
            )}
          </button>
          <button 
            role="tab"
            aria-selected={activeTab === 'nearby'}
            aria-controls="nearby-panel"
            className={`
              px-4 py-2 font-medium transition-colors relative
              ${activeTab === 'nearby' 
                ? 'bg-primary text-white dark:bg-primary-600' 
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
              }
            `}
            onClick={() => setActiveTab('nearby')}
          >
            {t('nearMe')}
            {activeTab === 'nearby' && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-white dark:bg-primary-300" />
            )}
          </button>
          <button 
            role="tab"
            aria-selected={activeTab === 'topRated'}
            aria-controls="top-rated-panel"
            className={`
              px-4 py-2 font-medium transition-colors relative
              ${activeTab === 'topRated' 
                ? 'bg-primary text-white dark:bg-primary-600' 
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
              }
            `}
            onClick={() => setActiveTab('topRated')}
          >
            {t('topRated')}
            {activeTab === 'topRated' && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-white dark:bg-primary-300" />
            )}
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          aria-busy="true"
          aria-label={t('loadingSalons')}
        >
          {[...Array(3)].map((_, index) => (
            <div 
              key={index} 
              className="rounded-xl overflow-hidden bg-white dark:bg-neutral-800 shadow-md border border-neutral-200/50 dark:border-neutral-700"
              role="presentation"
            >
              <div className="animate-pulse">
                <div className="h-48 bg-neutral-200 dark:bg-neutral-700"></div>
                <div className="p-4">
                  <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded mb-3 w-2/3"></div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <div className="h-6 w-16 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                    <div className="h-6 w-20 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                    <div className="h-6 w-14 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                  </div>
                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 mt-2 flex justify-between">
                    <div className="w-1/3">
                      <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded mb-1"></div>
                      <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
                    </div>
                    <div className="h-10 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div 
            role="tabpanel"
            id={`${activeTab}-panel`}
            aria-label={t(`${activeTab}Salons`)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {salons?.slice(0, 3).map((salon: Salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
          
          {(salons?.length ?? 0) > 3 && (
            <div className="text-center mt-6">
              <button 
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
                aria-label={t('viewMoreSalons')}
              >
                <span>{t('viewAllSalons')}</span>
                <i className="fas fa-chevron-right ml-2 rtl:mr-2 rtl:ml-0 rtl:rotate-180" aria-hidden="true"></i>
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default FeaturedSalons;
