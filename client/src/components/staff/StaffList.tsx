import React from "react";
import { useQuery } from "@tanstack/react-query";
import StaffCard from "./StaffCard";
import { Staff } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { t } from "@/lib/i18n";

interface StaffListProps {
  salonId: number;
  onBookStaff?: (staffId: number) => void;
  className?: string;
}

const StaffList = ({ salonId, onBookStaff, className }: StaffListProps) => {
  const {
    data: staffMembers,
    isLoading,
    error
  } = useQuery<Staff[]>({
    queryKey: [`/api/salons/${salonId}/staff`],
    enabled: !!salonId
  });

  // Loading state
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <StaffCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("errorLoadingStaff")}</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : t("unknownError")}
        </AlertDescription>
      </Alert>
    );
  }

  // Empty state
  if (!staffMembers || staffMembers.length === 0) {
    return (
      <Alert className="mb-4">
        <AlertTitle>{t("noStaffAvailable")}</AlertTitle>
        <AlertDescription>
          {t("noStaffAvailableDesc")}
        </AlertDescription>
      </Alert>
    );
  }

  // Render staff list
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {staffMembers.map((staffMember) => (
        <StaffCard
          key={staffMember.id}
          staff={staffMember}
          onBook={onBookStaff}
        />
      ))}
    </div>
  );
};

// Skeleton loader for staff cards
const StaffCardSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-4">
    <div className="flex items-center space-x-4 rtl:space-x-reverse">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-5 w-24" />
    </div>
    <div className="flex space-x-2 rtl:space-x-reverse">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
    </div>
  </div>
);

export default StaffList;