import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Staff } from '@shared/schema';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Clock, MessageCircle, Star, Users } from 'lucide-react';
import SkillBadge from './SkillBadge';
import StaffProfileModal from './StaffProfileModal';

interface StaffCardProps {
  staff: Staff;
  onBook?: (staffId: number) => void;
  expanded?: boolean;
  className?: string;
}

const StaffCard = ({ staff, onBook, expanded = false, className }: StaffCardProps) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [showProfile, setShowProfile] = useState(false);
  
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
    skills
  } = staff;
  
  // Display values based on language
  const displayName = isArabic && fullNameAr ? fullNameAr : fullName;
  const displayRole = isArabic && roleAr ? roleAr : role;
  const displayBio = isArabic && bioAr ? bioAr : bio;
  
  // Truncate bio for card view
  const truncatedBio = displayBio && displayBio.length > 100 
    ? `${displayBio.substring(0, 97)}...` 
    : displayBio;
  
  // Get top skills (4 for expanded card, 2 for compact card)
  const topSkills = skills && Array.isArray(skills) ? skills.slice(0, expanded ? 4 : 2) : [];

  return (
    <>
      <Card className={`overflow-hidden ${className} hover:shadow-md transition-shadow duration-300`}>
        <div className={`grid ${expanded ? 'md:grid-cols-3' : 'md:grid-cols-5'} gap-4`}>
          <div className={`${expanded ? 'md:col-span-1' : 'md:col-span-2'} flex flex-col items-center p-4`}>
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3">
              {image ? (
                <img 
                  src={image} 
                  alt={displayName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center text-primary text-2xl">
                  {displayName.charAt(0)}
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-medium text-center">{displayName}</h3>
            <p className="text-muted-foreground text-center text-sm mb-2">{displayRole}</p>
            
            <div className="flex items-center justify-center mt-1 mb-3">
              <Star className="w-4 h-4 text-amber-500 mr-1" />
              <span className="text-sm font-medium">{Number(rating).toFixed(1)}</span>
            </div>
            
            {expanded && (
              <div className="grid grid-cols-2 gap-2 w-full mt-2">
                <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-md">
                  <Clock className="w-4 h-4 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">{experienceYears} {isArabic ? 'سنوات' : 'yrs'}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-md">
                  <Users className="w-4 h-4 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">{clients}+ {isArabic ? 'عميل' : 'clients'}</span>
                </div>
              </div>
            )}
            
            {!expanded && (
              <Button 
                variant="link" 
                size="sm"
                onClick={() => setShowProfile(true)}
                className="mt-1 p-0 h-auto text-xs"
              >
                {isArabic ? 'عرض الملف الكامل' : 'View Full Profile'}
              </Button>
            )}
          </div>
          
          <div className={`${expanded ? 'md:col-span-2' : 'md:col-span-3'} p-4`}>
            {expanded && truncatedBio && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-1">{isArabic ? 'نبذة' : 'About'}</h4>
                <p className="text-sm text-muted-foreground">{truncatedBio}</p>
              </div>
            )}
            
            {topSkills.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">{isArabic ? 'المهارات' : 'Skills'}</h4>
                <div className="flex flex-wrap gap-2">
                  {topSkills.map((skill: any, index: number) => (
                    <SkillBadge 
                      key={`${skill.name}-${index}`}
                      name={skill.name} 
                      nameAr={skill.nameAr}
                      level={skill.level} 
                      color={skill.level >= 4 ? "primary" : "default"}
                    />
                  ))}
                  
                  {skills && Array.isArray(skills) && skills.length > topSkills.length && (
                    <Badge variant="outline" className="text-xs">
                      +{skills.length - topSkills.length} {isArabic ? 'أكثر' : 'more'}
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mt-auto">
              {onBook && (
                <Button 
                  onClick={() => onBook(id)} 
                  size="sm" 
                  className="flex-1"
                >
                  {isArabic ? 'حجز موعد' : 'Book Appointment'}
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setShowProfile(true)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {isArabic ? 'عرض الملف' : 'View Profile'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      {showProfile && (
        <StaffProfileModal 
          staff={staff}
          onClose={() => setShowProfile(false)}
          onBook={onBook}
        />
      )}
    </>
  );
};

export default StaffCard;