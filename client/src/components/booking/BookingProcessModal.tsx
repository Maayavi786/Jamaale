import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { t } from "@/lib/i18n";
import { Service, Salon, Staff } from "@shared/schema";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import TimeSlotSelector from "./TimeSlotSelector";

interface BookingProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  salon: Salon;
  initialService?: Service;
}

type BookingStep = 1 | 2 | 3 | 4;

const BookingProcessModal = ({ 
  isOpen, 
  onClose, 
  salon, 
  initialService 
}: BookingProcessModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(initialService || null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('mada');
  const [usePoints, setUsePoints] = useState<boolean>(false);
  
  // Search filter for services
  const [serviceSearch, setServiceSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Get services from the API
  const { data: services } = useQuery({
    queryKey: ['/api/salons', salon.id, 'services'],
  });
  
  // Get staff from the API
  const { data: staffMembers } = useQuery({
    queryKey: ['/api/salons', salon.id, 'staff'],
  });
  
  // Filter services based on search and category
  const filteredServices = services?.filter((service: Service) => {
    const matchesSearch = service.nameEn.toLowerCase().includes(serviceSearch.toLowerCase()) || 
                          service.nameAr.toLowerCase().includes(serviceSearch.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || service.categoryId.toString() === categoryFilter;
    
    return matchesSearch && matchesCategory && service.isActive;
  });
  
  // Calculate the total price
  const calculateTotal = () => {
    if (!selectedService) return 0;
    
    let total = selectedService.price;
    
    // Apply loyalty points discount if using points
    if (usePoints && user) {
      const pointsDiscount = Math.min(user.loyaltyPoints, total);
      total -= pointsDiscount;
    }
    
    return total;
  };
  
  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async () => {
      if (!user || !selectedService || !selectedTime) {
        throw new Error("Missing required booking information");
      }
      
      const bookingData = {
        userId: user.id,
        salonId: salon.id,
        serviceId: selectedService.id,
        staffId: selectedStaff?.id || null,
        date: new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime}`),
        totalPrice: calculateTotal(),
        paymentMethod: paymentMethod,
        loyaltyPointsUsed: usePoints && user ? Math.min(user.loyaltyPoints, selectedService.price) : 0,
        status: "pending",
        paymentStatus: "unpaid"
      };
      
      return await apiRequest('POST', '/api/bookings', bookingData);
    },
    onSuccess: () => {
      toast({
        title: t('bookingSuccess'),
        description: t('bookingSuccessMessage'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'bookings'] });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: t('bookingError'),
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Effect to set initial service
  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
    }
  }, [initialService]);
  
  // Effect to handle body overflow
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const handleStepForward = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep => currentStep + 1 as BookingStep);
    } else {
      // Submit booking
      createBookingMutation.mutate();
    }
  };
  
  const handleStepBackward = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep => currentStep - 1 as BookingStep);
    } else {
      onClose();
    }
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="p-6" id="step1">
            <h3 className="text-lg font-bold mb-4">{t('selectService')}</h3>
            
            <div className="mb-4">
              <input 
                type="text" 
                placeholder={t('searchServices')}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
              />
            </div>
            
            <div className="flex border-b border-neutral-200 mb-4 overflow-x-auto pb-2">
              <button 
                className={`px-4 py-2 ${categoryFilter === 'all' ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary transition'} font-medium whitespace-nowrap`}
                onClick={() => setCategoryFilter('all')}
              >
                {t('allServices')}
              </button>
              <button 
                className={`px-4 py-2 ${categoryFilter === '1' ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary transition'} font-medium whitespace-nowrap`}
                onClick={() => setCategoryFilter('1')}
              >
                {t('hair')}
              </button>
              <button 
                className={`px-4 py-2 ${categoryFilter === '5' ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary transition'} font-medium whitespace-nowrap`}
                onClick={() => setCategoryFilter('5')}
              >
                {t('makeup')}
              </button>
              <button 
                className={`px-4 py-2 ${categoryFilter === '3' ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary transition'} font-medium whitespace-nowrap`}
                onClick={() => setCategoryFilter('3')}
              >
                {t('nails')}
              </button>
              <button 
                className={`px-4 py-2 ${categoryFilter === '2' ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary transition'} font-medium whitespace-nowrap`}
                onClick={() => setCategoryFilter('2')}
              >
                {t('spa')}
              </button>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto mb-6">
              {filteredServices?.map((service: Service) => (
                <div 
                  key={service.id} 
                  className={`flex justify-between items-center p-3 border ${selectedService?.id === service.id ? 'border-primary' : 'border-neutral-200'} rounded-lg hover:border-primary transition cursor-pointer`}
                  onClick={() => setSelectedService(service)}
                >
                  <div>
                    <h4 className="font-medium">{service.nameEn}</h4>
                    <div className="flex items-center">
                      <span className="text-neutral-500 text-sm mr-3 rtl:ml-3 rtl:mr-0">{t('minutes', { count: service.durationMinutes })}</span>
                      {service.isPopular && (
                        <span className="bg-primary-light text-primary-dark text-xs px-2 py-0.5 rounded-full">{t('mostPopular')}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{service.price} SAR</p>
                  </div>
                </div>
              ))}
              
              {filteredServices?.length === 0 && (
                <div className="text-center py-8 text-neutral-500">
                  {t('noServicesFound')}
                </div>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-6" id="step2">
            <h3 className="text-lg font-bold mb-4">{t('selectDateTime')}</h3>
            <TimeSlotSelector 
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              selectedTime={selectedTime}
              onTimeChange={setSelectedTime}
            />
          </div>
        );
      case 3:
        return (
          <div className="p-6" id="step3">
            <h3 className="text-lg font-bold mb-4">{t('selectStaff')}</h3>
            
            <p className="text-neutral-500 mb-4">{t('selectStaffDescription')}</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div 
                className={`p-4 border ${!selectedStaff ? 'border-primary' : 'border-neutral-200'} rounded-lg text-center cursor-pointer hover:border-primary transition`}
                onClick={() => setSelectedStaff(null)}
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-neutral-200 flex items-center justify-center mb-2">
                  <i className="fas fa-user-check text-2xl text-neutral-500"></i>
                </div>
                <p className="font-medium">{t('anyAvailableStaff')}</p>
              </div>
              
              {staffMembers?.map((staff: Staff) => (
                <div 
                  key={staff.id} 
                  className={`p-4 border ${selectedStaff?.id === staff.id ? 'border-primary' : 'border-neutral-200'} rounded-lg text-center cursor-pointer hover:border-primary transition`}
                  onClick={() => setSelectedStaff(staff)}
                >
                  <img 
                    src={staff.image || "https://via.placeholder.com/64"} 
                    alt={staff.name} 
                    className="w-16 h-16 mx-auto rounded-full object-cover mb-2" 
                  />
                  <p className="font-medium">{staff.name}</p>
                  <p className="text-sm text-neutral-500">{staff.role}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="p-6" id="step4">
            <h3 className="text-lg font-bold mb-4">{t('paymentDetails')}</h3>
            
            <div className="border border-neutral-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-2">{t('bookingSummary')}</h4>
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span>{t('service')}</span>
                <span className="font-medium">{selectedService?.nameEn}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span>{t('date')}</span>
                <span className="font-medium">
                  {selectedDate.toLocaleDateString()} {selectedTime}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span>{t('staff')}</span>
                <span className="font-medium">
                  {selectedStaff?.name || t('anyAvailableStaff')}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span>{t('price')}</span>
                <span className="font-medium">{selectedService?.price} SAR</span>
              </div>
              
              {user?.loyaltyPoints && user.loyaltyPoints > 0 && (
                <div className="mt-4">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="form-checkbox h-5 w-5 text-primary"
                      checked={usePoints}
                      onChange={() => setUsePoints(!usePoints)}
                    />
                    <span className="ml-2 rtl:mr-2 rtl:ml-0">
                      {t('useLoyaltyPoints', { points: user.loyaltyPoints })}
                    </span>
                  </label>
                  {usePoints && (
                    <div className="flex justify-between py-2 border-b border-neutral-100">
                      <span>{t('loyaltyDiscount')}</span>
                      <span className="font-medium text-primary">
                        -{Math.min(user.loyaltyPoints, selectedService?.price || 0)} SAR
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                <span className="font-bold">{t('total')}</span>
                <span className="font-bold text-primary">{calculateTotal()} SAR</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-3">{t('paymentMethod')}</h4>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-neutral-200 rounded-lg cursor-pointer hover:border-primary transition">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="mada"
                    checked={paymentMethod === 'mada'}
                    onChange={() => setPaymentMethod('mada')}
                    className="form-radio h-5 w-5 text-primary"
                  />
                  <span className="ml-2 rtl:mr-2 rtl:ml-0 flex items-center">
                    <i className="far fa-credit-card mr-2 rtl:ml-2 rtl:mr-0"></i>
                    Mada
                  </span>
                </label>
                
                <label className="flex items-center p-3 border border-neutral-200 rounded-lg cursor-pointer hover:border-primary transition">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="apple"
                    checked={paymentMethod === 'apple'}
                    onChange={() => setPaymentMethod('apple')}
                    className="form-radio h-5 w-5 text-primary"
                  />
                  <span className="ml-2 rtl:mr-2 rtl:ml-0 flex items-center">
                    <i className="fab fa-apple mr-2 rtl:ml-2 rtl:mr-0"></i>
                    Apple Pay
                  </span>
                </label>
                
                <label className="flex items-center p-3 border border-neutral-200 rounded-lg cursor-pointer hover:border-primary transition">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="form-radio h-5 w-5 text-primary"
                  />
                  <span className="ml-2 rtl:mr-2 rtl:ml-0 flex items-center">
                    <i className="fas fa-credit-card mr-2 rtl:ml-2 rtl:mr-0"></i>
                    {t('creditCard')}
                  </span>
                </label>
                
                <label className="flex items-center p-3 border border-neutral-200 rounded-lg cursor-pointer hover:border-primary transition">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="form-radio h-5 w-5 text-primary"
                  />
                  <span className="ml-2 rtl:mr-2 rtl:ml-0 flex items-center">
                    <i className="fas fa-money-bill-wave mr-2 rtl:ml-2 rtl:mr-0"></i>
                    {t('cashOnArrival')}
                  </span>
                </label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!selectedService;
      case 2:
        return !!selectedTime;
      case 3:
        return true; // Any staff is valid (including null for any available)
      case 4:
        return true; // We always have a payment method selected
      default:
        return false;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <div className="flex justify-between items-center p-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold">{t('bookAppointment')}</h2>
          <button 
            className="text-neutral-500 hover:text-neutral-700 transition"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* Booking progress */}
        <div className="px-6 py-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-neutral-300 text-neutral-600'} flex items-center justify-center font-medium`}>1</div>
              <span className={`text-xs font-medium mt-1 ${currentStep >= 1 ? 'text-primary' : 'text-neutral-500'}`}>{t('service')}</span>
            </div>
            <div className="h-1 flex-1 bg-neutral-200 mx-2">
              <div className={`h-full bg-primary ${currentStep >= 2 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-neutral-300 text-neutral-600'} flex items-center justify-center font-medium`}>2</div>
              <span className={`text-xs font-medium mt-1 ${currentStep >= 2 ? 'text-primary' : 'text-neutral-500'}`}>{t('dateTime')}</span>
            </div>
            <div className="h-1 flex-1 bg-neutral-200 mx-2">
              <div className={`h-full bg-primary ${currentStep >= 3 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-neutral-300 text-neutral-600'} flex items-center justify-center font-medium`}>3</div>
              <span className={`text-xs font-medium mt-1 ${currentStep >= 3 ? 'text-primary' : 'text-neutral-500'}`}>{t('staff')}</span>
            </div>
            <div className="h-1 flex-1 bg-neutral-200 mx-2">
              <div className={`h-full bg-primary ${currentStep >= 4 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full ${currentStep >= 4 ? 'bg-primary text-white' : 'bg-neutral-300 text-neutral-600'} flex items-center justify-center font-medium`}>4</div>
              <span className={`text-xs font-medium mt-1 ${currentStep >= 4 ? 'text-primary' : 'text-neutral-500'}`}>{t('payment')}</span>
            </div>
          </div>
        </div>
        
        {renderStep()}
        
        <div className="border-t border-neutral-200 p-4 flex justify-between">
          <button 
            className="text-neutral-600 hover:text-neutral-800 font-medium py-2 px-4 rounded-lg transition"
            onClick={handleStepBackward}
          >
            {currentStep === 1 ? t('cancel') : t('back')}
          </button>
          <button 
            className={`bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition ${!isStepValid() || createBookingMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleStepForward}
            disabled={!isStepValid() || createBookingMutation.isPending}
          >
            {createBookingMutation.isPending ? (
              <span className="flex items-center">
                <i className="fas fa-spinner fa-spin mr-2 rtl:ml-2 rtl:mr-0"></i>
                {t('processing')}
              </span>
            ) : (
              currentStep === 4 ? t('confirmBooking') : t('continue')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingProcessModal;
