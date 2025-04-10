import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, { message: t("usernameMinLength") }),
  password: z.string().min(6, { message: t("passwordMinLength") }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, { message: t("usernameMinLength") }),
  fullName: z.string().min(2, { message: t("fullNameMinLength") }),
  email: z.string().email({ message: t("invalidEmail") }),
  phoneNumber: z.string().min(10, { message: t("phoneNumberMinLength") }),
  password: z.string().min(6, { message: t("passwordMinLength") }),
  confirmPassword: z.string().min(6, { message: t("passwordMinLength") }),
}).refine((data) => data.password === data.confirmPassword, {
  message: t("passwordMismatch"),
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthPage = () => {
  const [, setLocation] = useLocation();
  const { user, isLoading, login, register } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Redirect if user is already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login form submission
  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.username, values.password);
      toast({
        title: t("loginSuccess"),
        description: t("loginSuccessMessage"),
      });
      setLocation("/");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: t("loginFailed"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  };

  // Handle registration form submission
  const onRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      // Omit confirmPassword from the registration data
      const { confirmPassword, ...registrationData } = values;
      
      await register(registrationData);
      toast({
        title: t("registrationSuccess"),
        description: t("registrationSuccessMessage"),
      });
      setLocation("/");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: t("registrationFailed"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Authentication Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-primary">
              {t('appName')}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === "login" ? t("loginDescription") : t("registerDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t("login")}</TabsTrigger>
                <TabsTrigger value="register">{t("register")}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("username")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("usernameLabel")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("password")}</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder={t("passwordLabel")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? t("loggingIn") : t("login")}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("username")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("usernameLabel")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("fullName")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("fullNameLabel")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("email")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("emailLabel")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("phoneNumber")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("phoneNumberLabel")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("password")}</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder={t("passwordLabel")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("confirmPassword")}</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder={t("confirmPasswordLabel")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? t("registering") : t("register")}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-neutral-600">
              {activeTab === "login" 
                ? t("noAccountYet") 
                : t("alreadyHaveAccount")}
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Hero Section */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center text-white p-12">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold mb-6">{t("appName")}</h1>
          <p className="text-xl mb-8">{t("appDescription")}</p>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-white bg-opacity-20 p-2 rounded-full mr-4 rtl:ml-4 rtl:mr-0">
                <i className="fas fa-search text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{t("discoverSalons")}</h3>
                <p>{t("discoverSalonsDesc")}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white bg-opacity-20 p-2 rounded-full mr-4 rtl:ml-4 rtl:mr-0">
                <i className="fas fa-calendar-check text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{t("easyBooking")}</h3>
                <p>{t("easyBookingDesc")}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white bg-opacity-20 p-2 rounded-full mr-4 rtl:ml-4 rtl:mr-0">
                <i className="fas fa-star text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{t("userReviews")}</h3>
                <p>{t("userReviewsDesc")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;