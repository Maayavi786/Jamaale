import { useState } from "react";
import { t } from "@/lib/i18n";

interface TimeSlotSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  selectedTime: string | null;
  onTimeChange: (time: string) => void;
}

const TimeSlotSelector = ({ 
  selectedDate, 
  onDateChange, 
  selectedTime, 
  onTimeChange 
}: TimeSlotSelectorProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Generate calendar days for the current month view
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();
    
    // Total days in the month
    const daysInMonth = lastDay.getDate();
    
    // Array to store all calendar days
    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(new Date(year, month, day));
    }
    
    return calendarDays;
  };
  
  // Generate time slots for the selected date
  const generateTimeSlots = () => {
    // This would typically come from an API that checks availability
    // For now, we'll generate some demo slots
    const timeSlots = [];
    const currentDate = new Date();
    const isToday = selectedDate.toDateString() === currentDate.toDateString();
    const currentHour = currentDate.getHours();
    
    // Standard business hours
    for (let hour = 9; hour <= 20; hour++) {
      // Skip past hours if selected date is today
      if (isToday && hour <= currentHour) continue;
      
      // Morning slot
      timeSlots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        available: Math.random() > 0.3 // 70% chance of being available
      });
      
      // Afternoon slot
      if (hour < 20) {
        timeSlots.push({
          time: `${hour.toString().padStart(2, '0')}:30`,
          available: Math.random() > 0.3
        });
      }
    }
    
    return timeSlots;
  };
  
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const isDateSelectable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if date is in the past
    return date >= today;
  };
  
  const handleDateClick = (date: Date | null) => {
    if (date && isDateSelectable(date)) {
      onDateChange(date);
      // Reset time selection when date changes
      onTimeChange('');
    }
  };
  
  const handleTimeClick = (time: string, available: boolean) => {
    if (available) {
      onTimeChange(time);
    }
  };
  
  const calendarDays = generateCalendarDays();
  const timeSlots = generateTimeSlots();
  
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString(t('language') === 'ar' ? 'ar-SA' : 'en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  const getDayName = (day: number) => {
    const days = t('language') === 'ar' 
      ? ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return days[day];
  };
  
  return (
    <div>
      {/* Calendar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <button 
            className="p-2 rounded-lg hover:bg-neutral-100 transition"
            onClick={goToPreviousMonth}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <h4 className="font-medium">{formatMonthYear(currentMonth)}</h4>
          <button 
            className="p-2 rounded-lg hover:bg-neutral-100 transition"
            onClick={goToNextMonth}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-2 text-center mb-2">
          {[0, 1, 2, 3, 4, 5, 6].map(day => (
            <div key={`day-${day}`} className="text-sm font-medium text-neutral-500">
              {getDayName(day)}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2 text-center">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="p-2"></div>;
            }
            
            const isSelected = day.toDateString() === selectedDate.toDateString();
            const isSelectable = isDateSelectable(day);
            
            return (
              <div 
                key={`day-${day.getDate()}`} 
                className={`p-2 ${
                  isSelected 
                    ? 'bg-primary text-white rounded-full' 
                    : isSelectable 
                      ? 'rounded-full hover:bg-neutral-100 transition cursor-pointer' 
                      : 'text-neutral-300 cursor-not-allowed'
                }`}
                onClick={() => handleDateClick(day)}
              >
                {day.getDate()}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Time slots */}
      <h4 className="font-medium mb-3">
        {t('availableTimeSlots', { date: selectedDate.toLocaleDateString() })}
      </h4>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6">
        {timeSlots.map((slot, index) => (
          <div 
            key={`slot-${index}`} 
            className={`time-slot p-2 text-center rounded-lg ${
              !slot.available 
                ? 'unavailable' 
                : selectedTime === slot.time 
                  ? 'selected' 
                  : 'available cursor-pointer hover:bg-primary-dark hover:text-white transition'
            }`}
            onClick={() => handleTimeClick(slot.time, slot.available)}
          >
            {slot.time}
          </div>
        ))}
        
        {timeSlots.length === 0 && (
          <div className="col-span-4 text-center py-4 text-neutral-500">
            {t('noAvailableTimeSlots')}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSlotSelector;
