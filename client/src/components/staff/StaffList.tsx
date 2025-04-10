import React, { useState } from 'react';
import { Staff } from '@shared/schema';
import { useLanguage } from '@/contexts/LanguageContext';
import StaffCard from './StaffCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';

interface StaffListProps {
  staff: Staff[];
  onSelectStaff?: (staffId: number) => void;
  title?: string;
  compact?: boolean;
  className?: string;
}

const StaffList = ({ 
  staff, 
  onSelectStaff, 
  title = '',
  compact = false,
  className = ''
}: StaffListProps) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Extract unique skill categories from all staff members
  const allCategories = staff.reduce((categories, staffMember) => {
    if (staffMember.skills && Array.isArray(staffMember.skills)) {
      staffMember.skills.forEach(skill => {
        if (skill.category && !categories.includes(skill.category)) {
          categories.push(skill.category);
        }
      });
    }
    return categories;
  }, [] as string[]);
  
  // Filter staff based on search query and selected category
  const filteredStaff = staff.filter(staffMember => {
    const nameMatch = staffMember.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                     (staffMember.fullNameAr && staffMember.fullNameAr.includes(searchQuery));
    const roleMatch = staffMember.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     (staffMember.roleAr && staffMember.roleAr.includes(searchQuery));
    
    const matchesSearch = nameMatch || roleMatch;
    
    if (!selectedCategory) return matchesSearch;
    
    // Check if staff has skills in the selected category
    const hasSkillInCategory = staffMember.skills && Array.isArray(staffMember.skills) &&
      staffMember.skills.some(skill => skill.category === selectedCategory);
    
    return matchesSearch && hasSkillInCategory;
  });
  
  return (
    <div className={className}>
      {title && (
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
      )}
      
      <div className="mb-5 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={isArabic ? "ابحث عن اسم أو دور..." : "Search by name or role..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {allCategories.length > 0 && (
            <Button 
              variant="outline"
              size="icon"
              className="flex-shrink-0"
              title={isArabic ? "تصفية حسب التخصص" : "Filter by specialty"}
            >
              <Filter className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {allCategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              {isArabic ? "الكل" : "All"}
            </Badge>
            
            {allCategories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer capitalize"
                onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      {filteredStaff.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {isArabic 
            ? "لا يوجد موظفين مطابقين لبحثك" 
            : "No staff members match your search"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStaff.map(staffMember => (
            <StaffCard
              key={staffMember.id}
              staff={staffMember}
              expanded={!compact}
              onBook={onSelectStaff}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffList;