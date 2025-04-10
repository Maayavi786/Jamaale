import React from 'react';
import { Badge } from "@/components/ui/badge";
import { useLanguage } from '@/contexts/LanguageContext';

interface SkillBadgeProps {
  name: string;
  nameAr?: string;
  level: number; // 1-5 scale
  color?: "primary" | "secondary" | "default";
  className?: string;
}

const SkillBadge = ({ 
  name, 
  nameAr, 
  level, 
  color = "default", 
  className 
}: SkillBadgeProps) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const displayName = isArabic && nameAr ? nameAr : name;
  
  // Calculate how many stars to show based on level
  const stars = '★'.repeat(level) + '☆'.repeat(5 - level);
  
  // Determine badge variant based on level and color
  const getVariant = () => {
    if (color === "primary") return "default";
    if (color === "secondary") return "secondary";
    
    // Default color with level-based intensity
    if (level >= 4) return "default";
    if (level >= 2) return "outline";
    return "secondary";
  };
  
  // Determine size class based on level
  const getSizeClass = () => {
    if (level >= 4) return "text-xs";
    return "text-xs";
  };

  return (
    <Badge 
      variant={getVariant()}
      className={`${getSizeClass()} ${className}`}
      title={`${displayName} (${level}/5)`}
    >
      {displayName}
      {level >= 4 && <span className="ml-1 rtl:mr-1 rtl:ml-0 text-amber-500">★</span>}
    </Badge>
  );
};

export default SkillBadge;