import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Staff } from "@shared/schema";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Award, Star, Users } from "lucide-react";
import SkillBadge from "./SkillBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface StaffProfileModalProps {
  staffId?: number;
  salonId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBook?: (staffId: number) => void;
}

const StaffProfileModal = ({
  staffId,
  salonId,
  open,
  onOpenChange,
  onBook
}: StaffProfileModalProps) => {
  const { language } = useLanguage();
  
  // Fetch staff member data
  const {
    data: staff,
    isLoading,
    error
  } = useQuery<Staff>({
    queryKey: [`/api/salons/${salonId}/staff/${staffId}`],
    enabled: open && !!staffId && !!salonId,
  });
  
  // Handle modal content based on loading/error states
  let modalContent;
  
  if (isLoading) {
    modalContent = <StaffProfileSkeleton />;
  } else if (error || !staff) {
    modalContent = (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-2">
          {t("errorLoadingStaffProfile")}
        </p>
        <p className="text-sm text-gray-500">
          {error instanceof Error ? error.message : t("unknownError")}
        </p>
      </div>
    );
  } else {
    const displayName = language === "ar" && staff.fullNameAr ? staff.fullNameAr : staff.fullName;
    const displayRole = language === "ar" && staff.roleAr ? staff.roleAr : staff.role;
    const displayBio = language === "ar" && staff.bioAr ? staff.bioAr : staff.bio;
    
    // Parse skills from string if needed
    const skillsArray = typeof staff.skills === 'string' ? JSON.parse(staff.skills) : staff.skills;
    
    // Calculate skill category averages
    const skillCategories = calculateSkillCategories(skillsArray);
    
    modalContent = (
      <>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={staff.image} alt={displayName} />
            <AvatarFallback className="text-xl">{displayName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          
          <div className="text-center sm:text-left flex-1">
            <h3 className="text-2xl font-bold">{displayName}</h3>
            <p className="text-gray-500 mb-2 flex items-center justify-center sm:justify-start">
              {displayRole}
              {staff.rating > 0 && (
                <span className="flex items-center ml-2 rtl:mr-2 rtl:ml-0 text-amber-500">
                  <Star className="h-3.5 w-3.5 mr-0.5 rtl:ml-0.5 rtl:mr-0" fill="currentColor" />
                  <span>{staff.rating.toFixed(1)}</span>
                </span>
              )}
            </p>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <div className="flex items-center text-sm text-gray-600">
                <Award className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-primary" />
                <span>{t("yearsExperience", { years: staff.experienceYears })}</span>
              </div>
              
              {staff.clients > 0 && (
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-primary" />
                  <span>{t("clientsServed", { count: staff.clients })}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="about">{t("about")}</TabsTrigger>
            <TabsTrigger value="skills">{t("skills")}</TabsTrigger>
            <TabsTrigger value="schedule">{t("schedule")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="p-2">
            <div className="mb-4">
              <h4 className="font-medium text-lg mb-2">{t("bio")}</h4>
              <p className="text-gray-700">{displayBio}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-lg mb-2">{t("specialties")}</h4>
              <div className="flex flex-wrap gap-2">
                {skillsArray && skillsArray
                  .filter((skill: any) => skill.level >= 4)
                  .map((skill: any, index: number) => (
                    <SkillBadge
                      key={index}
                      name={skill.name}
                      nameAr={skill.nameAr}
                      level={skill.level}
                      color={index % 2 === 0 ? "primary" : "secondary"}
                    />
                  ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="skills" className="p-2">
            <div className="mb-4">
              <h4 className="font-medium text-lg mb-3">{t("skillsByCategory")}</h4>
              <div className="space-y-4">
                {Object.entries(skillCategories).map(([category, value]) => (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm text-gray-500">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-lg mb-2">{t("allSkills")}</h4>
              <div className="flex flex-wrap gap-2">
                {skillsArray && skillsArray.map((skill: any, index: number) => (
                  <SkillBadge
                    key={index}
                    name={skill.name}
                    nameAr={skill.nameAr}
                    level={skill.level}
                    color={getSkillColor(skill.category)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule" className="p-2">
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h4 className="text-lg font-medium mb-2">{t("scheduleAvailability")}</h4>
              <p className="text-gray-500">
                {t("scheduleAvailabilityDesc")}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("stylistProfile")}</DialogTitle>
          <DialogDescription>
            {t("stylistProfileDesc")}
          </DialogDescription>
        </DialogHeader>
        
        {modalContent}
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="sm:mr-2 rtl:sm:ml-2 rtl:sm:mr-0"
          >
            {t("close")}
          </Button>
          
          {staffId && onBook && (
            <Button onClick={() => onBook(staffId)}>
              {t("bookAppointment")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper to calculate skill category averages
function calculateSkillCategories(skills: any[]): Record<string, number> {
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return {
      [t("hairServices")]: 70,
      [t("colorServices")]: 65,
      [t("facialTreatments")]: 80,
    };
  }
  
  const categories: Record<string, { total: number; count: number }> = {};
  
  skills.forEach(skill => {
    const category = skill.category || t("other");
    if (!categories[category]) {
      categories[category] = { total: 0, count: 0 };
    }
    categories[category].total += skill.level * 20; // Convert level 1-5 to percentage
    categories[category].count += 1;
  });
  
  const result: Record<string, number> = {};
  
  Object.entries(categories).forEach(([category, { total, count }]) => {
    result[category] = Math.round(total / count);
  });
  
  return result;
}

// Helper to determine skill badge color based on category
function getSkillColor(category?: string): "primary" | "secondary" | "accent" | "default" {
  if (!category) return "default";
  
  switch (category.toLowerCase()) {
    case "hair":
    case "haircut":
    case "styling":
      return "primary";
    case "color":
    case "coloring":
    case "treatment":
      return "secondary";
    case "facial":
    case "makeup":
    case "spa":
      return "accent";
    default:
      return "default";
  }
}

// Skeleton loader for the staff profile modal
const StaffProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
      <Skeleton className="h-24 w-24 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-8 w-48 mx-auto sm:mx-0" />
        <Skeleton className="h-5 w-32 mx-auto sm:mx-0" />
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-28" />
        </div>
      </div>
    </div>
    
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  </div>
);

export default StaffProfileModal;