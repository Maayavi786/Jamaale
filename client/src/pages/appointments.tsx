import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { t } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import { Booking, Salon, Service } from "@shared/schema";

// Tab types for filtering appointments
type AppointmentTab = 'upcoming' | 'past' | 'cancelled';

const Appointments = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AppointmentTab>('upcoming');
  
  // Fetch user's bookings
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['/api/users', user?.id, 'bookings'],
    enabled: !!user,
  });
  
  // Additional queries to get salon and service details for each booking
  const { data: salons } = useQuery({
    queryKey: ['/api/salons'],
    enabled: !!bookings,
  });
  
  // Filter bookings based on active tab
  const filteredBookings = bookings?.filter((booking: Booking) => {
    const bookingDate = new Date(booking.date);
    const now = new Date();
    
    if (activeTab === 'upcoming') {
      return bookingDate >= now && booking.status !== 'cancelled';
    } else if (activeTab === 'past') {
      return bookingDate < now && booking.status !== 'cancelled';
    } else {
      return booking.status === 'cancelled';
    }
  });
  
  // Get salon and service details for a booking
  const getSalonDetails = (salonId: number) => {
    return salons?.find((salon: Salon) => salon.id === salonId);
  };
  
  // Format date and time
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };
  
  // Handle booking status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };
  
  return (
    <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">{t('myAppointments')}</h1>
        
        <div className="flex border-b border-neutral-300 mb-6">
          <button 
            className={`px-4 py-2 ${activeTab === 'upcoming' ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary transition'} font-medium`}
            onClick={() => setActiveTab('upcoming')}
          >
            {t('upcoming')}
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'past' ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary transition'} font-medium`}
            onClick={() => setActiveTab('past')}
          >
            {t('past')}
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'cancelled' ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary transition'} font-medium`}
            onClick={() => setActiveTab('cancelled')}
          >
            {t('cancelled')}
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : !user ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mb-4 text-neutral-500">
              <i className="fas fa-user-clock text-5xl"></i>
            </div>
            <h3 className="text-lg font-medium mb-2">{t('loginToViewAppointments')}</h3>
            <p className="text-neutral-600 mb-4">{t('loginToViewAppointmentsDesc')}</p>
            <button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition">
              {t('login')}
            </button>
          </div>
        ) : filteredBookings?.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mb-4 text-neutral-500">
              <i className="fas fa-calendar-times text-5xl"></i>
            </div>
            <h3 className="text-lg font-medium mb-2">{t('noAppointmentsFound')}</h3>
            <p className="text-neutral-600 mb-4">
              {activeTab === 'upcoming' 
                ? t('noUpcomingAppointments') 
                : activeTab === 'past' 
                  ? t('noPastAppointments') 
                  : t('noCancelledAppointments')}
            </p>
            <Link href="/">
              <a className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition">
                {t('bookAppointment')}
              </a>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings?.map((booking: Booking) => {
              const salon = getSalonDetails(booking.salonId);
              const { date, time } = formatDateTime(booking.date);
              
              return (
                <div key={booking.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-3 md:mb-0">
                      <div className="flex items-center">
                        <h3 className="font-bold text-lg">{salon?.name}</h3>
                        <span className={`ml-2 rtl:mr-2 rtl:ml-0 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {t(booking.status)}
                        </span>
                      </div>
                      
                      <p className="text-neutral-600">
                        <i className="far fa-calendar-alt mr-1 rtl:ml-1 rtl:mr-0"></i> {date} • {time}
                      </p>
                      
                      <p className="text-neutral-600 mt-1">
                        <i className="far fa-clipboard mr-1 rtl:ml-1 rtl:mr-0"></i> Service ID: {booking.serviceId}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <p className="font-bold text-primary mb-2">{booking.totalPrice} SAR</p>
                      
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        {activeTab === 'upcoming' && (
                          <>
                            <button className="px-3 py-1 text-sm border border-primary text-primary rounded hover:bg-primary hover:text-white transition">
                              {t('reschedule')}
                            </button>
                            <button className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition">
                              {t('cancel')}
                            </button>
                          </>
                        )}
                        
                        {activeTab === 'past' && booking.status === 'completed' && (
                          <button className="px-3 py-1 text-sm border border-primary text-primary rounded hover:bg-primary hover:text-white transition">
                            {t('leaveReview')}
                          </button>
                        )}
                        
                        <button className="px-3 py-1 text-sm border border-neutral-500 text-neutral-500 rounded hover:bg-neutral-500 hover:text-white transition">
                          {t('viewDetails')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default Appointments;
