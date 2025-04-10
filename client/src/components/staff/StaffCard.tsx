import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Staff } from "@shared/schema";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Clock, Award, Star, Users } from "lucide-react";
import SkillBadge from "./SkillBadge";

interface StaffCardProps {
  staff: Staff;
  onBook?: (staffId: number) => void;
  expanded?: boolean;
  className?: string;
}

const StaffCard = ({ staff, onBook, expanded = false, className }: StaffCardProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const { language } = useLanguage();
  
  const {
    id,
    fullName,
    fullNameAr,
    role,
    roleAr,
    bio,
    bioAr,
    image,
    isAvailable,
    rating,
    skills,
    experienceYears,
    salonId
  } = staff;
  
  const displayName = language === "ar" && fullNameAr ? fullNameAr : fullName;
  const displayRole = language === "ar" && roleAr ? roleAr : role;
  const displayBio = language === "ar" && bioAr ? bioAr : bio;
  
  // Parse skills from string if needed
  const skillsArray = typeof skills === 'string' ? JSON.parse(skills) : skills;
  
  return (
    <Card className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-lg' : 'shadow-sm hover:shadow-md'} ${className}`}>
      <CardHeader className="relative p-4 pb-0">
        {isAvailable && (
          <Badge variant="default" className="absolute top-3 right-3 rtl:left-3 rtl:right-auto">
            {t("available")}
          </Badge>
        )}
        
        <div className="flex items-center">
          <Avatar className="h-16 w-16 mr-4 rtl:ml-4 rtl:mr-0 border-2 border-primary">
            <AvatarImage src={image} alt={displayName} />
            <AvatarFallback>{displayName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          
          <div>
            <CardTitle className="text-xl mb-1">{displayName}</CardTitle>
            <CardDescription className="text-sm flex items-center">
              {displayRole}
              {rating > 0 && (
                <span className="flex items-center ml-2 rtl:mr-2 rtl:ml-0 text-amber-500">
                  <Star className="h-3.5 w-3.5 mr-0.5 rtl:ml-0.5 rtl:mr-0" fill="currentColor" />
                  <span>{rating.toFixed(1)}</span>
                </span>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-1 mb-3">
          {skillsArray && skillsArray.map((skill: any, index: number) => (
            <SkillBadge
              key={index}
              name={skill.name}
              nameAr={skill.nameAr}
              level={skill.level}
              color={index % 3 === 0 ? "primary" : index % 3 === 1 ? "secondary" : "accent"}
            />
          ))}
        </div>
        
        <div className="flex flex-wrap text-sm text-gray-600 mb-2">
          <div className="flex items-center mr-4 rtl:ml-4 rtl:mr-0">
            <Award className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-primary" />
            <span>{t("yearsExperience", { years: experienceYears })}</span>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-3 text-sm">
            <p>{displayBio}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 pt-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1"
        >
          {isExpanded ? t("showLess") : t("showMore")}
        </Button>
        
        {onBook && (
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => onBook(id)}
            className="flex-1"
          >
            {t("bookNow")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StaffCard;