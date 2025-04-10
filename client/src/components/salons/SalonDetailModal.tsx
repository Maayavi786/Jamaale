import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import { Salon, Service, Staff } from "@shared/schema";
import BookingProcessModal from "../booking/BookingProcessModal";

interface SalonDetailModalProps {
  salon: Salon;
  isOpen: boolean;
  onClose: () => void;
}

const SalonDetailModal = ({ salon, isOpen, onClose }: SalonDetailModalProps) => {
  const { language } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  const { data: services } = useQuery({
    queryKey: ['/api/salons', salon.id, 'services'],
  });
  
  const { data: staff } = useQuery({
    queryKey: ['/api/salons', salon.id, 'staff'],
  });
  
  const { data: reviews } = useQuery({
    queryKey: ['/api/salons', salon.id, 'reviews'],
  });
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? salon.images.length - 1 : prev - 1
    );
  };
  
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === salon.images.length - 1 ? 0 : prev + 1
    );
  };
  
  const handleServiceBook = (service: Service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };
  
  const filteredServices = services?.filter((service: Service) => {
    if (selectedServiceCategory === 'all') return true;
    return service.categoryId.toString() === selectedServiceCategory;
  });
  
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={onClose}>
        <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 rtl:left-4 rtl:right-auto z-10 bg-white rounded-full p-2 shadow-md hover:bg-neutral-100 transition"
              onClick={onClose}
            >
              <i className="fas fa-times"></i>
            </button>
            
            {/* Salon images slider */}
            <div className="relative h-64 md:h-80">
              <img 
                src={salon.images[currentImageIndex]} 
                alt={salon.name} 
                className="w-full h-full object-cover"
              />
              {salon.images.length > 1 && (
                <div className="absolute bottom-4 right-4 rtl:left-4 rtl:right-auto flex space-x-2 rtl:space-x-reverse">
                  <button 
                    className="bg-white rounded-full p-2 shadow-md hover:bg-neutral-100 transition"
                    onClick={handlePrevImage}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button 
                    className="bg-white rounded-full p-2 shadow-md hover:bg-neutral-100 transition"
                    onClick={handleNextImage}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
              <div className="absolute top-4 left-4 rtl:right-4 rtl:left-auto">
                {salon.isLadiesOnly && (
                  <span className="bg-primary text-white text-sm font-bold px-3 py-1 rounded-full flex items-center">
                    <i className="fas fa-female mr-2 rtl:ml-2 rtl:mr-0"></i> 
                    {t('ladiesOnly')}
                  </span>
                )}
                
                {salon.isMensOnly && (
                  <span className="bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full flex items-center">
                    <i className="fas fa-male mr-2 rtl:ml-2 rtl:mr-0"></i> 
                    {t('mensOnly')}
                  </span>
                )}
              </div>
            </div>
            
            {/* Salon info */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{salon.name}</h2>
                  <p className="text-neutral-600 flex items-center">
                    <i className="fas fa-map-marker-alt mr-2 rtl:ml-2 rtl:mr-0"></i> 
                    {salon.address}, {salon.city}
                    {salon.latitude && salon.longitude && (
                      <span> • {t('kmAway', { distance: '3.2' })}</span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center mb-1">
                    <i className="fas fa-star text-accent mr-1 rtl:ml-1 rtl:mr-0"></i>
                    <span className="font-medium">{salon.rating.toFixed(1)}</span>
                    <span className="text-neutral-500 text-sm ml-1 rtl:mr-1 rtl:ml-0">
                      ({salon.reviewCount} {t('reviews')})
                    </span>
                  </div>
                  <button className="text-primary hover:text-primary-dark font-medium text-sm">
                    {t('seeAllReviews')}
                  </button>
                </div>
              </div>
              
              <div className="border-t border-b border-neutral-200 py-4 my-4">
                <p className="text-neutral-700 mb-4">{salon.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-neutral-100 text-neutral-700 text-sm px-3 py-1 rounded-full flex items-center">
                    <i className="fas fa-clock mr-2 rtl:ml-2 rtl:mr-0"></i> 
                    {t('openHours', { 
                      open: salon.openingHours.monday.open, 
                      close: salon.openingHours.monday.close 
                    })}
                  </span>
                  <span className="bg-neutral-100 text-neutral-700 text-sm px-3 py-1 rounded-full flex items-center">
                    <i className="fas fa-phone-alt mr-2 rtl:ml-2 rtl:mr-0"></i> 
                    {salon.phoneNumber}
                  </span>
                  {salon.hasPrivateRooms && (
                    <span className="bg-primary-light text-primary-dark text-sm px-3 py-1 rounded-full flex items-center">
                      <i className="fas fa-user-shield mr-2 rtl:ml-2 rtl:mr-0"></i> 
                      {t('privateRoomsAvailable')}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Services section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4">{t('services')}</h3>
                
                {/* Service categories */}
                <div className="flex border-b border-neutral-200 mb-4 overflow-x-auto pb-2">
                  <button 
                    className={`px-4 py-2 ${selectedServiceCategory === 'all' ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary transition'} font-medium whitespace-nowrap`}
                    onClick={() => setSelectedServiceCategory('all')}
                  >
                    {t('allServices')}
                  </button>
                  
                  {/* Dynamic category tabs would be here based on available services */}
                </div>
                
                {/* Service list */}
                <div className="space-y-4">
                  {filteredServices?.map((service: Service) => (
                    <div 
                      key={service.id} 
                      className="flex justify-between items-center p-3 rounded-lg hover:bg-neutral-100 transition cursor-pointer"
                    >
                      <div>
                        <h4 className="font-medium">
                          {language === 'en' ? service.nameEn : service.nameAr}
                        </h4>
                        <p className="text-neutral-500 text-sm">
                          {t('minutes', { count: service.durationMinutes })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{service.price} SAR</p>
                        <button 
                          className="text-primary hover:text-primary-dark text-sm"
                          onClick={() => handleServiceBook(service)}
                        >
                          {t('bookNow')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Staff section */}
              {staff && staff.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-4">{t('ourStaff')}</h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {staff.map((person: Staff) => (
                      <div key={person.id} className="flex flex-col items-center">
                        <img 
                          src={person.image || "https://via.placeholder.com/64"} 
                          alt={person.name} 
                          className="w-16 h-16 rounded-full object-cover mb-2" 
                        />
                        <p className="font-medium text-sm">{person.name}</p>
                        <p className="text-neutral-500 text-xs">{person.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showBookingModal && selectedService && (
        <BookingProcessModal 
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          salon={salon}
          initialService={selectedService}
        />
      )}
    </>
  );
};

export default SalonDetailModal;
