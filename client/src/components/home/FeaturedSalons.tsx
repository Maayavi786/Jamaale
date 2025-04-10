import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { t } from "@/lib/i18n";
import SalonCard from "../salons/SalonCard";
import { Salon } from "@shared/schema";

type TabType = 'featured' | 'nearby' | 'topRated';

const FeaturedSalons = () => {
  const [activeTab, setActiveTab] = useState<TabType>('featured');
  
  const { data: featuredSalons, isLoading: isLoadingFeatured } = useQuery({
    queryKey: ['/api/salons/featured'],
    enabled: activeTab === 'featured',
  });
  
  const { data: nearbySalons, isLoading: isLoadingNearby } = useQuery({
    queryKey: ['/api/salons/near', { lat: 24.7136, lng: 46.6753 }],
    enabled: activeTab === 'nearby',
  });
  
  const { data: topRatedSalons, isLoading: isLoadingTopRated } = useQuery({
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
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t('featuredSalons')}</h2>
        <div className="flex border border-neutral-300 rounded-lg overflow-hidden">
          <button 
            className={`px-3 py-1 ${activeTab === 'featured' ? 'bg-primary text-white' : 'text-neutral-600 hover:bg-neutral-100 transition'} font-medium`}
            onClick={() => setActiveTab('featured')}
          >
            {t('featured')}
          </button>
          <button 
            className={`px-3 py-1 ${activeTab === 'nearby' ? 'bg-primary text-white' : 'text-neutral-600 hover:bg-neutral-100 transition'} font-medium`}
            onClick={() => setActiveTab('nearby')}
          >
            {t('nearMe')}
          </button>
          <button 
            className={`px-3 py-1 ${activeTab === 'topRated' ? 'bg-primary text-white' : 'text-neutral-600 hover:bg-neutral-100 transition'} font-medium`}
            onClick={() => setActiveTab('topRated')}
          >
            {t('topRated')}
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="rounded-xl overflow-hidden bg-white shadow-md">
              <div className="animate-pulse">
                <div className="h-48 bg-neutral-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded mb-3 w-2/3"></div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <div className="h-6 w-16 bg-neutral-200 rounded-full"></div>
                    <div className="h-6 w-20 bg-neutral-200 rounded-full"></div>
                    <div className="h-6 w-14 bg-neutral-200 rounded-full"></div>
                  </div>
                  <div className="border-t border-neutral-200 pt-3 mt-2 flex justify-between">
                    <div className="w-1/3">
                      <div className="h-3 bg-neutral-200 rounded mb-1"></div>
                      <div className="h-5 bg-neutral-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-10 w-24 bg-neutral-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salons?.slice(0, 3).map((salon: Salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
          
          {salons?.length > 3 && (
            <div className="text-center mt-6">
              <button className="text-primary hover:text-primary-dark font-medium flex items-center mx-auto">
                <span>{t('viewAllSalons')}</span>
                <i className="fas fa-chevron-right ml-2 rtl:mr-2 rtl:ml-0 rtl:rotate-180"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeaturedSalons;
