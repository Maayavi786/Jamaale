import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Staff } from '@shared/schema';
import { useLanguage } from '@/contexts/LanguageContext';
import { Award, Calendar, Clock, MessageCircle, Phone, Star, Users } from 'lucide-react';
import SkillBadge from './SkillBadge';

interface StaffProfileModalProps {
  staff: Staff;
  onClose: () => void;
  onBook?: (staffId: number) => void;
  isBooking?: boolean;
}

const StaffProfileModal = ({ 
  staff, 
  onClose, 
  onBook,
  isBooking = false
}: StaffProfileModalProps) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const {
    id,
    fullName,
    fullNameAr,
    role,
    roleAr,
    bio,
    bioAr,
    image,
    experienceYears,
    clients,
    rating,
    skills,
    gender
  } = staff;
  
  // Display values based on language
  const displayName = isArabic && fullNameAr ? fullNameAr : fullName;
  const displayRole = isArabic && roleAr ? roleAr : role;
  const displayBio = isArabic && bioAr ? bioAr : bio;
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background">
          <DialogHeader className="px-6 pt-6 pb-2 border-b">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden">
                  {image ? (
                    <img 
                      src={image} 
                      alt={displayName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center text-primary text-xl">
                      {displayName.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <DialogTitle className="text-xl font-semibold">{displayName}</DialogTitle>
                <DialogDescription className="text-base">{displayRole}</DialogDescription>
                
                <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 text-amber-500 mr-1" />
                  <span className="text-sm font-medium mr-4">{Number(rating).toFixed(1)}</span>
                  
                  <Clock className="w-4 h-4 text-muted-foreground mr-1" />
                  <span className="text-sm mr-4">{experienceYears} {isArabic ? 'سنوات' : 'years'}</span>
                  
                  <Users className="w-4 h-4 text-muted-foreground mr-1" />
                  <span className="text-sm">{clients}+ {isArabic ? 'عميل' : 'clients'}</span>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>
        
        <div className="px-6 py-4">
          {displayBio && (
            <div className="mb-6">
              <h3 className="text-base font-medium mb-2">{isArabic ? 'نبذة' : 'About'}</h3>
              <p className="text-sm text-muted-foreground">{displayBio}</p>
            </div>
          )}
          
          {skills && skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-base font-medium mb-2">{isArabic ? 'المهارات' : 'Skills & Expertise'}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(
                  skills.reduce((acc: Record<string, any[]>, skill: any) => {
                    const category = skill.category || 'other';
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(skill);
                    return acc;
                  }, {})
                ).map(([category, categorySkills]) => (
                  <div key={category} className="border rounded-lg p-3">
                    <h4 className="text-sm font-medium mb-2 capitalize">
                      {category === 'other' 
                        ? (isArabic ? 'مهارات أخرى' : 'Other Skills')
                        : category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill: any, index: number) => (
                        <SkillBadge 
                          key={`${skill.name}-${index}`}
                          name={skill.name} 
                          nameAr={skill.nameAr}
                          level={skill.level} 
                          color={skill.level >= 4 ? "primary" : "default"}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <div className="border rounded-lg p-3 flex flex-col items-center justify-center">
              <Award className="w-5 h-5 text-muted-foreground mb-1" />
              <span className="text-xs font-medium">{experienceYears} {isArabic ? 'سنوات خبرة' : 'Years Experience'}</span>
            </div>
            
            <div className="border rounded-lg p-3 flex flex-col items-center justify-center">
              <Users className="w-5 h-5 text-muted-foreground mb-1" />
              <span className="text-xs font-medium">{clients}+ {isArabic ? 'عميل' : 'Happy Clients'}</span>
            </div>
            
            <div className="border rounded-lg p-3 flex flex-col items-center justify-center">
              <Star className="w-5 h-5 text-amber-500 mb-1" />
              <span className="text-xs font-medium">{Number(rating).toFixed(1)} {isArabic ? 'تقييم' : 'Rating'}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="px-6 py-4 border-t gap-2">
          {onBook && !isBooking && (
            <Button 
              onClick={() => {
                onBook(id);
                onClose();
              }}
              className="w-full sm:w-auto"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {isArabic ? 'حجز موعد' : 'Book Appointment'}
            </Button>
          )}
          
          <Button 
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            {isBooking 
              ? (isArabic ? 'اختيار' : 'Select')
              : (isArabic ? 'إغلاق' : 'Close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StaffProfileModal;