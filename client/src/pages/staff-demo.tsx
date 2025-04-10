import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Staff } from '@shared/schema';
import { StaffList } from '@/components/staff';
import { Button } from '@/components/ui/button';
import { getQueryFn } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const StaffDemo = () => {
  const { toast } = useToast();
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  
  // Fetch staff for Elegant Beauty Lounge (salonId = 1)
  const { data: staffData, isLoading, error } = useQuery<Staff[]>({
    queryKey: ['/api/salons/1/staff'],
    queryFn: getQueryFn({ on401: 'throw' })
  });
  
  const handleBookAppointment = (staffId: number) => {
    setSelectedStaffId(staffId);
    
    toast({
      title: 'Staff Member Selected',
      description: `You selected staff member with ID: ${staffId}`,
      duration: 3000,
    });
  };
  
  if (isLoading) {
    return (
      <div className="container my-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-center">
          <div className="text-lg font-medium mb-2">Loading staff profiles...</div>
          <div className="text-sm text-muted-foreground">Please wait</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container my-8">
        <div className="bg-destructive/10 p-6 rounded-lg text-center">
          <h2 className="text-lg font-medium mb-2">Error Loading Staff</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container my-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Our Skilled Staff</h1>
        <p className="text-muted-foreground">
          Meet our team of talented beauty professionals at Elegant Beauty Lounge
        </p>
      </div>
      
      {staffData && staffData.length > 0 ? (
        <StaffList 
          staff={staffData}
          onSelectStaff={handleBookAppointment}
          title="Beauty Experts"
        />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No staff members available at this time
        </div>
      )}
    </div>
  );
};

export default StaffDemo;