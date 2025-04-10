import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { t } from "@/lib/i18n";
import { Salon } from "@shared/schema";
import SalonDetailModal from "./SalonDetailModal";

interface SalonCardProps {
  salon: Salon;
}

const SalonCard = ({ salon }: SalonCardProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const { data: isFavorite } = useQuery({
    queryKey: ['/api/favorites/check', { userId: user?.id, salonId: salon.id }],
    enabled: !!user,
  });
  
  const addFavoriteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/favorites', {
        userId: user?.id,
        salonId: salon.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites/check'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'favorites'] });
    }
  });
  
  const removeFavoriteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', '/api/favorites', {
        userId: user?.id,
        salonId: salon.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites/check'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'favorites'] });
    }
  });
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) return;
    
    if (isFavorite?.isFavorite) {
      removeFavoriteMutation.mutate();
    } else {
      addFavoriteMutation.mutate();
    }
  };
  
  return (
    <>
      <div className="salon-card rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition duration-300 cursor-pointer" onClick={() => setShowDetailModal(true)}>
        <div className="relative">
          <img 
            src={salon.images[0]} 
            alt={salon.name} 
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3 rtl:left-3 rtl:right-auto">
            {salon.isLadiesOnly && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                <i className="fas fa-female mr-1 rtl:ml-1 rtl:mr-0"></i> 
                {t('ladiesOnly')}
              </span>
            )}
            
            {salon.isMensOnly && (
              <span className="bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                <i className="fas fa-male mr-1 rtl:ml-1 rtl:mr-0"></i> 
                {t('mensOnly')}
              </span>
            )}
            
            {salon.hasPrivateRooms && !salon.isLadiesOnly && !salon.isMensOnly && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                <i className="fas fa-user-shield mr-1 rtl:ml-1 rtl:mr-0"></i> 
                {t('privateRooms')}
              </span>
            )}
          </div>
          <button 
            className="absolute top-3 left-3 rtl:right-3 rtl:left-auto text-white bg-black bg-opacity-30 rounded-full p-2 hover:bg-opacity-50 transition"
            onClick={toggleFavorite}
          >
            <i className={`${isFavorite?.isFavorite ? 'fas' : 'far'} fa-heart`}></i>
          </button>
        </div>
        <div className="p-4">
          <div className="flex justify-between mb-2">
            <h3 className="font-bold text-lg">{salon.name}</h3>
            <div className="flex items-center">
              <i className="fas fa-star text-accent"></i>
              <span className="ml-1 rtl:mr-1 rtl:ml-0 font-medium">{salon.rating.toFixed(1)}</span>
              <span className="text-neutral-500 text-sm ml-1 rtl:mr-1 rtl:ml-0">({salon.reviewCount})</span>
            </div>
          </div>
          <p className="text-neutral-600 text-sm mb-3">
            <i className="fas fa-map-marker-alt mr-1 rtl:ml-1 rtl:mr-0"></i> 
            {salon.address}, {salon.city}
            {salon.latitude && salon.longitude && (
              <span> • {t('kmAway', { distance: '3.2' })}</span>
            )}
          </p>
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded-full">Haircut</span>
            <span className="bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded-full">Hair Color</span>
            <span className="bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded-full">Makeup</span>
          </div>
          <div className="flex items-center justify-between border-t border-neutral-200 pt-3 mt-2">
            <div>
              <p className="text-neutral-500 text-xs">{t('startingFrom')}</p>
              <p className="font-bold text-primary">150 SAR</p>
            </div>
            <button 
              className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetailModal(true);
              }}
            >
              {t('bookNow')}
            </button>
          </div>
        </div>
      </div>
      
      {showDetailModal && (
        <SalonDetailModal 
          salon={salon} 
          isOpen={showDetailModal} 
          onClose={() => setShowDetailModal(false)} 
        />
      )}
    </>
  );
};

export default SalonCard;
