import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { t } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Profile tabs
type ProfileTab = 'info' | 'security' | 'preferences' | 'loyalty';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    preferredLanguage: user?.preferredLanguage || 'en',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error(t('notLoggedIn'));
      
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        preferredLanguage: formData.preferredLanguage,
      };
      
      const response = await apiRequest('PATCH', `/api/users/${user.id}`, updateData);
      return response.json();
    },
    onSuccess: (data) => {
      updateUser(data);
      setIsEditing(false);
      toast({
        title: t('profileUpdated'),
        description: t('profileUpdatedDesc'),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('updateError'),
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error(t('notLoggedIn'));
      
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error(t('passwordMismatch'));
      }
      
      const updateData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };
      
      const response = await apiRequest('PATCH', `/api/users/${user.id}/password`, updateData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('passwordChanged'),
        description: t('passwordChangedDesc'),
      });
      
      // Reset password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('passwordChangeError'),
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate();
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    changePasswordMutation.mutate();
  };
  
  const renderProfileTab = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div>
            <form onSubmit={handleUpdateProfile}>
              <div className="mb-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fullName")}</FormLabel>
                      <FormControl>
                        <Input id="profile-fullName" placeholder={t("fullNameLabel")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mb-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("email")}</FormLabel>
                      <FormControl>
                        <Input id="profile-email" placeholder={t("emailLabel")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mb-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("phoneNumber")}</FormLabel>
                      <FormControl>
                        <Input id="profile-phoneNumber" placeholder={t("phoneNumberLabel")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {isEditing ? (
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <button 
                    type="submit"
                    className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? t('saving') : t('saveChanges')}
                  </button>
                  <button 
                    type="button"
                    className="border border-neutral-300 text-neutral-700 font-medium py-2 px-4 rounded-lg transition hover:bg-neutral-100"
                    onClick={() => setIsEditing(false)}
                  >
                    {t('cancel')}
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition"
                  onClick={() => setIsEditing(true)}
                >
                  {t('editProfile')}
                </button>
              )}
            </form>
          </div>
        );
      case 'security':
        return (
          <div>
            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("currentPassword")}</FormLabel>
                      <FormControl>
                        <Input id="profile-currentPassword" type="password" placeholder={t("currentPasswordLabel")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mb-4">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("newPassword")}</FormLabel>
                      <FormControl>
                        <Input id="profile-newPassword" type="password" placeholder={t("newPasswordLabel")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mb-4">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("confirmNewPassword")}</FormLabel>
                      <FormControl>
                        <Input id="profile-confirmNewPassword" type="password" placeholder={t("confirmNewPasswordLabel")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <button 
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition"
                disabled={changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending ? t('changing') : t('changePassword')}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-neutral-200">
              <h3 className="text-lg font-bold mb-4 text-red-600">{t('dangerZone')}</h3>
              <button 
                className="bg-red-100 text-red-600 hover:bg-red-200 font-medium py-2 px-4 rounded-lg transition"
                onClick={logout}
              >
                {t('logout')}
              </button>
            </div>
          </div>
        );
      case 'preferences':
        return (
          <div>
            <div className="mb-4">
              <label className="block text-neutral-700 font-medium mb-2">
                {t('language')}
              </label>
              <select 
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-primary" />
                <span className="ml-2 rtl:mr-2 rtl:ml-0">{t('emailNotifications')}</span>
              </label>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-primary" />
                <span className="ml-2 rtl:mr-2 rtl:ml-0">{t('smsNotifications')}</span>
              </label>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-primary" />
                <span className="ml-2 rtl:mr-2 rtl:ml-0">{t('marketingEmails')}</span>
              </label>
            </div>
            
            <button 
              type="button"
              className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition"
              onClick={() => {
                toast({
                  title: t('preferencesSaved'),
                  description: t('preferencesSavedDesc'),
                });
              }}
            >
              {t('savePreferences')}
            </button>
          </div>
        );
      case 'loyalty':
        return (
          <div>
            <div className="bg-primary-light text-primary-dark p-6 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{t('loyaltyPoints')}</h3>
                <span className="text-3xl font-bold">{user?.loyaltyPoints || 0}</span>
              </div>
              <p className="text-sm">{t('loyaltyPointsDesc')}</p>
            </div>
            
            <h3 className="text-lg font-bold mb-4">{t('howToEarnPoints')}</h3>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-primary mt-1 mr-2 rtl:ml-2 rtl:mr-0"></i>
                <span>{t('earnPointsBooking')}</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-primary mt-1 mr-2 rtl:ml-2 rtl:mr-0"></i>
                <span>{t('earnPointsReview')}</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-primary mt-1 mr-2 rtl:ml-2 rtl:mr-0"></i>
                <span>{t('earnPointsReferral')}</span>
              </li>
            </ul>
            
            <h3 className="text-lg font-bold mb-4">{t('redeemPoints')}</h3>
            <p className="mb-4">{t('redeemPointsDesc')}</p>
            
            <a 
              href="/appointments" 
              className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition inline-block"
            >
              {t('bookAppointment')}
            </a>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
      {!user ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="mb-4 text-neutral-500">
            <i className="fas fa-user-circle text-5xl"></i>
          </div>
          <h3 className="text-lg font-medium mb-2">{t('loginToViewProfile')}</h3>
          <p className="text-neutral-600 mb-4">{t('loginToViewProfileDesc')}</p>
          <button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition">
            {t('login')}
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
            <div className="mb-4 md:mb-0 md:mr-6 rtl:md:ml-6 rtl:md:mr-0">
              <div className="relative">
                <img 
                  src={user.profileImage || "https://via.placeholder.com/100"} 
                  alt={user.fullName} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" 
                />
                <button className="absolute bottom-0 right-0 bg-primary hover:bg-primary-dark text-white p-2 rounded-full shadow-md transition">
                  <i className="fas fa-camera text-sm"></i>
                </button>
              </div>
            </div>
            <div className="text-center md:text-left rtl:md:text-right">
              <h1 className="text-2xl font-bold mb-1">{user.fullName}</h1>
              <p className="text-neutral-500 mb-2">{user.email}</p>
              <div className="flex items-center justify-center md:justify-start rtl:md:justify-end">
                <span className="bg-primary-light text-primary-dark text-sm px-3 py-1 rounded-full">
                  {user.loyaltyPoints} {t('points')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md">
            <div className="flex overflow-x-auto border-b border-neutral-200">
              <button 
                className={`px-4 py-3 ${activeTab === 'info' ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary transition'} font-medium whitespace-nowrap`}
                onClick={() => setActiveTab('info')}
              >
                <i className="far fa-user mr-2 rtl:ml-2 rtl:mr-0"></i>
                {t('personalInfo')}
              </button>
              <button 
                className={`px-4 py-3 ${activeTab === 'security' ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary transition'} font-medium whitespace-nowrap`}
                onClick={() => setActiveTab('security')}
              >
                <i className="fas fa-lock mr-2 rtl:ml-2 rtl:mr-0"></i>
                {t('security')}
              </button>
              <button 
                className={`px-4 py-3 ${activeTab === 'preferences' ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary transition'} font-medium whitespace-nowrap`}
                onClick={() => setActiveTab('preferences')}
              >
                <i className="fas fa-cog mr-2 rtl:ml-2 rtl:mr-0"></i>
                {t('preferences')}
              </button>
              <button 
                className={`px-4 py-3 ${activeTab === 'loyalty' ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary transition'} font-medium whitespace-nowrap`}
                onClick={() => setActiveTab('loyalty')}
              >
                <i className="fas fa-award mr-2 rtl:ml-2 rtl:mr-0"></i>
                {t('loyaltyProgram')}
              </button>
            </div>
            
            <div className="p-6">
              {renderProfileTab()}
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Profile;
