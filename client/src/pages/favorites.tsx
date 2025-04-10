import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { t } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import SalonCard from "@/components/salons/SalonCard";
import { Salon } from "@shared/schema";

const Favorites = () => {
  const { user } = useAuth();
  
  // Fetch user's favorite salons
  const { data: favoriteSalons, isLoading } = useQuery({
    queryKey: ['/api/users', user?.id, 'favorites'],
    enabled: !!user,
  });
  
  return (
    <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">{t('myFavorites')}</h1>
        
        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : !user ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mb-4 text-neutral-500">
              <i className="far fa-heart text-5xl"></i>
            </div>
            <h3 className="text-lg font-medium mb-2">{t('loginToViewFavorites')}</h3>
            <p className="text-neutral-600 mb-4">{t('loginToViewFavoritesDesc')}</p>
            <button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition">
              {t('login')}
            </button>
          </div>
        ) : !favoriteSalons || favoriteSalons.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mb-4 text-neutral-500">
              <i className="far fa-heart text-5xl"></i>
            </div>
            <h3 className="text-lg font-medium mb-2">{t('noFavoritesYet')}</h3>
            <p className="text-neutral-600 mb-4">{t('noFavoritesYetDesc')}</p>
            <a href="/" className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition">
              {t('exploreSalons')}
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteSalons.map((salon: Salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Favorites;
