import {
  users, User, InsertUser,
  salons, Salon, InsertSalon,
  categories, Category, InsertCategory,
  staff, Staff, InsertStaff,
  services, Service, InsertService,
  bookings, Booking, InsertBooking,
  reviews, Review, InsertReview,
  promotions, Promotion, InsertPromotion,
  favorites, Favorite, InsertFavorite
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Salon methods
  getSalon(id: number): Promise<Salon | undefined>;
  getAllSalons(): Promise<Salon[]>;
  getFeaturedSalons(limit?: number): Promise<Salon[]>;
  getNearSalons(lat: number, lng: number, limit?: number): Promise<Salon[]>;
  getTopRatedSalons(limit?: number): Promise<Salon[]>;
  searchSalons(query: string): Promise<Salon[]>;
  filterSalons(filters: Partial<Salon>): Promise<Salon[]>;
  createSalon(salon: InsertSalon): Promise<Salon>;
  updateSalon(id: number, salon: Partial<Salon>): Promise<Salon | undefined>;
  
  // Category methods
  getCategory(id: number): Promise<Category | undefined>;
  getAllCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Staff methods
  getStaff(id: number): Promise<Staff | undefined>;
  getStaffBySalon(salonId: number): Promise<Staff[]>;
  createStaff(staff: InsertStaff): Promise<Staff>;
  
  // Service methods
  getService(id: number): Promise<Service | undefined>;
  getServicesBySalon(salonId: number): Promise<Service[]>;
  getServicesByCategory(categoryId: number): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  
  // Booking methods
  getBooking(id: number): Promise<Booking | undefined>;
  getUserBookings(userId: number): Promise<Booking[]>;
  getSalonBookings(salonId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  
  // Review methods
  getReview(id: number): Promise<Review | undefined>;
  getSalonReviews(salonId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Promotion methods
  getPromotion(id: number): Promise<Promotion | undefined>;
  getActivePromotions(): Promise<Promotion[]>;
  getSalonPromotions(salonId: number): Promise<Promotion[]>;
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;
  
  // Favorite methods
  getUserFavorites(userId: number): Promise<Salon[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, salonId: number): Promise<boolean>;
  isFavorite(userId: number, salonId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private salonsMap: Map<number, Salon>;
  private categoriesMap: Map<number, Category>;
  private staffMap: Map<number, Staff>;
  private servicesMap: Map<number, Service>;
  private bookingsMap: Map<number, Booking>;
  private reviewsMap: Map<number, Review>;
  private promotionsMap: Map<number, Promotion>;
  private favoritesMap: Map<number, Favorite>;
  
  private userIdCounter: number;
  private salonIdCounter: number;
  private categoryIdCounter: number;
  private staffIdCounter: number;
  private serviceIdCounter: number;
  private bookingIdCounter: number;
  private reviewIdCounter: number;
  private promotionIdCounter: number;
  private favoriteIdCounter: number;
  
  constructor() {
    this.usersMap = new Map();
    this.salonsMap = new Map();
    this.categoriesMap = new Map();
    this.staffMap = new Map();
    this.servicesMap = new Map();
    this.bookingsMap = new Map();
    this.reviewsMap = new Map();
    this.promotionsMap = new Map();
    this.favoritesMap = new Map();
    
    this.userIdCounter = 1;
    this.salonIdCounter = 1;
    this.categoryIdCounter = 1;
    this.staffIdCounter = 1;
    this.serviceIdCounter = 1;
    this.bookingIdCounter = 1;
    this.reviewIdCounter = 1;
    this.promotionIdCounter = 1;
    this.favoriteIdCounter = 1;
    
    // Seed data
    this.seedData();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(user => user.username === username);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(user => user.email === email);
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = {
      ...userData,
      id,
      loyaltyPoints: 0,
      createdAt: new Date(),
      profileImage: userData.profileImage || null,
      preferredLanguage: userData.preferredLanguage || 'en',
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      role: userData.role || 'customer'
    };
    this.usersMap.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.usersMap.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.usersMap.set(id, updatedUser);
    return updatedUser;
  }
  
  // Salon methods
  async getSalon(id: number): Promise<Salon | undefined> {
    return this.salonsMap.get(id);
  }
  
  async getAllSalons(): Promise<Salon[]> {
    return Array.from(this.salonsMap.values()).filter(salon => salon.isActive);
  }
  
  async getFeaturedSalons(limit: number = 10): Promise<Salon[]> {
    return Array.from(this.salonsMap.values())
      .filter(salon => salon.isActive)
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  }
  
  async getNearSalons(lat: number, lng: number, limit: number = 10): Promise<Salon[]> {
    return Array.from(this.salonsMap.values())
      .filter(salon => salon.isActive && salon.latitude && salon.longitude)
      .sort((a, b) => {
        const distA = this.calculateDistance(lat, lng, a.latitude!, a.longitude!);
        const distB = this.calculateDistance(lat, lng, b.latitude!, b.longitude!);
        return distA - distB;
      })
      .slice(0, limit);
  }
  
  async getTopRatedSalons(limit: number = 10): Promise<Salon[]> {
    return Array.from(this.salonsMap.values())
      .filter(salon => salon.isActive)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }
  
  async searchSalons(query: string): Promise<Salon[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.salonsMap.values())
      .filter(salon => 
        salon.isActive && (
          salon.name.toLowerCase().includes(lowerQuery) ||
          salon.city.toLowerCase().includes(lowerQuery) ||
          salon.address.toLowerCase().includes(lowerQuery)
        )
      );
  }
  
  async filterSalons(filters: Partial<Salon>): Promise<Salon[]> {
    return Array.from(this.salonsMap.values())
      .filter(salon => {
        if (!salon.isActive) return false;
        
        for (const [key, value] of Object.entries(filters)) {
          if (salon[key as keyof Salon] !== value) return false;
        }
        
        return true;
      });
  }
  
  async createSalon(salonData: InsertSalon): Promise<Salon> {
    const id = this.salonIdCounter++;
    const salon: Salon = { 
      ...salonData, 
      id, 
      rating: 0, 
      reviewCount: 0, 
      createdAt: new Date(),
      email: salonData.email || null,
      website: salonData.website || null,
      isActive: salonData.isActive !== undefined ? salonData.isActive : true,
      hasFemaleStaff: salonData.hasFemaleStaff !== undefined ? salonData.hasFemaleStaff : false
    };
    this.salonsMap.set(id, salon);
    return salon;
  }
  
  async updateSalon(id: number, salonData: Partial<Salon>): Promise<Salon | undefined> {
    const salon = this.salonsMap.get(id);
    if (!salon) return undefined;
    
    const updatedSalon = { ...salon, ...salonData };
    this.salonsMap.set(id, updatedSalon);
    return updatedSalon;
  }
  
  // Category methods
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categoriesMap.get(id);
  }
  
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categoriesMap.values());
  }
  
  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...categoryData, id, createdAt: new Date() };
    this.categoriesMap.set(id, category);
    return category;
  }
  
  // Staff methods
  async getStaff(id: number): Promise<Staff | undefined> {
    return this.staffMap.get(id);
  }
  
  async getStaffBySalon(salonId: number): Promise<Staff[]> {
    return Array.from(this.staffMap.values())
      .filter(staffMember => staffMember.salonId === salonId && staffMember.isActive);
  }
  
  async createStaff(staffData: InsertStaff): Promise<Staff> {
    const id = this.staffIdCounter++;
    
    // Backwards compatibility for old name field
    const hasOldNameField = (staffData as any)?.name !== undefined;
    
    const staffMember: Staff = { 
      id,
      salonId: staffData.salonId,
      fullName: hasOldNameField ? (staffData as any).name : staffData.fullName,
      fullNameAr: staffData.fullNameAr || null,
      role: staffData.role,
      roleAr: staffData.roleAr || null,
      bio: staffData.bio || null,
      bioAr: staffData.bioAr || null,
      gender: staffData.gender,
      isActive: staffData.isActive !== undefined ? staffData.isActive : true,
      isAvailable: staffData.isAvailable !== undefined ? staffData.isAvailable : true,
      rating: staffData.rating || "0",
      experienceYears: staffData.experienceYears || 0,
      clients: staffData.clients || 0,
      skills: staffData.skills || null,
      image: staffData.image || null,
      createdAt: new Date()
    };
    
    this.staffMap.set(id, staffMember);
    return staffMember;
  }
  
  // Service methods
  async getService(id: number): Promise<Service | undefined> {
    return this.servicesMap.get(id);
  }
  
  async getServicesBySalon(salonId: number): Promise<Service[]> {
    return Array.from(this.servicesMap.values())
      .filter(service => service.salonId === salonId && service.isActive);
  }
  
  async getServicesByCategory(categoryId: number): Promise<Service[]> {
    return Array.from(this.servicesMap.values())
      .filter(service => service.categoryId === categoryId && service.isActive);
  }
  
  async createService(serviceData: InsertService): Promise<Service> {
    const id = this.serviceIdCounter++;
    const service: Service = { ...serviceData, id, createdAt: new Date() };
    this.servicesMap.set(id, service);
    return service;
  }
  
  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookingsMap.get(id);
  }
  
  async getUserBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookingsMap.values())
      .filter(booking => booking.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async getSalonBookings(salonId: number): Promise<Booking[]> {
    return Array.from(this.bookingsMap.values())
      .filter(booking => booking.salonId === salonId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const id = this.bookingIdCounter++;
    const booking: Booking = { 
      ...bookingData, 
      id, 
      loyaltyPointsEarned: Math.floor(bookingData.totalPrice / 10),
      createdAt: new Date() 
    };
    this.bookingsMap.set(id, booking);
    
    // Update user loyalty points
    const user = this.usersMap.get(bookingData.userId);
    if (user) {
      const updatedLoyaltyPoints = user.loyaltyPoints + booking.loyaltyPointsEarned - bookingData.loyaltyPointsUsed;
      this.usersMap.set(user.id, { ...user, loyaltyPoints: updatedLoyaltyPoints });
    }
    
    return booking;
  }
  
  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookingsMap.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, status };
    this.bookingsMap.set(id, updatedBooking);
    return updatedBooking;
  }
  
  // Review methods
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviewsMap.get(id);
  }
  
  async getSalonReviews(salonId: number): Promise<Review[]> {
    return Array.from(this.reviewsMap.values())
      .filter(review => review.salonId === salonId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async createReview(reviewData: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const review: Review = { ...reviewData, id, isVerified: true, createdAt: new Date() };
    this.reviewsMap.set(id, review);
    
    // Update salon rating
    const salon = this.salonsMap.get(reviewData.salonId);
    if (salon) {
      const salonReviews = await this.getSalonReviews(reviewData.salonId);
      const totalRating = salonReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / salonReviews.length;
      
      this.salonsMap.set(salon.id, { 
        ...salon, 
        rating: parseFloat(averageRating.toFixed(1)), 
        reviewCount: salonReviews.length 
      });
    }
    
    return review;
  }
  
  // Promotion methods
  async getPromotion(id: number): Promise<Promotion | undefined> {
    return this.promotionsMap.get(id);
  }
  
  async getActivePromotions(): Promise<Promotion[]> {
    const now = new Date();
    return Array.from(this.promotionsMap.values())
      .filter(promo => 
        promo.isActive && 
        new Date(promo.startDate) <= now && 
        new Date(promo.endDate) >= now
      );
  }
  
  async getSalonPromotions(salonId: number): Promise<Promotion[]> {
    const now = new Date();
    return Array.from(this.promotionsMap.values())
      .filter(promo => 
        promo.salonId === salonId && 
        promo.isActive && 
        new Date(promo.startDate) <= now && 
        new Date(promo.endDate) >= now
      );
  }
  
  async createPromotion(promotionData: InsertPromotion): Promise<Promotion> {
    const id = this.promotionIdCounter++;
    const promotion: Promotion = { ...promotionData, id, createdAt: new Date() };
    this.promotionsMap.set(id, promotion);
    return promotion;
  }
  
  // Favorite methods
  async getUserFavorites(userId: number): Promise<Salon[]> {
    const favorites = Array.from(this.favoritesMap.values())
      .filter(favorite => favorite.userId === userId);
    
    return favorites.map(favorite => this.salonsMap.get(favorite.salonId)!)
      .filter(salon => salon && salon.isActive);
  }
  
  async addFavorite(favoriteData: InsertFavorite): Promise<Favorite> {
    // Check if already exists
    const existing = Array.from(this.favoritesMap.values())
      .find(fav => fav.userId === favoriteData.userId && fav.salonId === favoriteData.salonId);
    
    if (existing) return existing;
    
    const id = this.favoriteIdCounter++;
    const favorite: Favorite = { ...favoriteData, id, createdAt: new Date() };
    this.favoritesMap.set(id, favorite);
    return favorite;
  }
  
  async removeFavorite(userId: number, salonId: number): Promise<boolean> {
    const favorite = Array.from(this.favoritesMap.values())
      .find(fav => fav.userId === userId && fav.salonId === salonId);
    
    if (!favorite) return false;
    
    this.favoritesMap.delete(favorite.id);
    return true;
  }
  
  async isFavorite(userId: number, salonId: number): Promise<boolean> {
    return !!Array.from(this.favoritesMap.values())
      .find(fav => fav.userId === userId && fav.salonId === salonId);
  }
  
  // Helper methods
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  }
  
  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
  
  private seedData(): void {
    // Default categories
    const categories: InsertCategory[] = [
      { nameEn: 'Haircut', nameAr: 'قص الشعر', iconClass: 'fa-cut' },
      { nameEn: 'Spa', nameAr: 'سبا', iconClass: 'fa-spa' },
      { nameEn: 'Nail Care', nameAr: 'العناية بالأظافر', iconClass: 'fa-paint-brush' },
      { nameEn: 'Hair Color', nameAr: 'صبغة شعر', iconClass: 'fa-tint' },
      { nameEn: 'Makeup', nameAr: 'مكياج', iconClass: 'fa-female' },
      { nameEn: 'Beard Trim', nameAr: 'حلاقة اللحية', iconClass: 'fa-male' }
    ];
    
    categories.forEach(category => this.createCategory(category));
    
    // Default user
    this.createUser({
      username: 'sarah',
      password: 'password123',
      email: 'sarah@example.com',
      fullName: 'Sarah Abdullah',
      phoneNumber: '+9661234567890',
      preferredLanguage: 'en',
      role: 'customer',
      isActive: true,
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80'
    });
    
    // Default salon owner
    this.createUser({
      username: 'salonowner',
      password: 'password123',
      email: 'owner@example.com',
      fullName: 'Mohammed Ali',
      phoneNumber: '+9661234567891',
      preferredLanguage: 'ar',
      role: 'salonOwner',
      isActive: true,
      profileImage: 'https://randomuser.me/api/portraits/men/75.jpg'
    });
    
    // Default salon
    this.createSalon({
      ownerId: 2,
      name: 'Elegant Beauty Lounge',
      description: 'Elegant Beauty Lounge offers premium beauty services in a luxurious and private environment. Our team of experienced professionals are dedicated to making you look and feel your best.',
      address: 'Al Olaya District',
      city: 'Riyadh',
      phoneNumber: '+966112345678',
      email: 'info@elegantbeauty.com',
      website: 'www.elegantbeauty.com',
      openingHours: {
        monday: { open: '10:00', close: '22:00' },
        tuesday: { open: '10:00', close: '22:00' },
        wednesday: { open: '10:00', close: '22:00' },
        thursday: { open: '10:00', close: '22:00' },
        friday: { open: '14:00', close: '22:00' },
        saturday: { open: '10:00', close: '22:00' },
        sunday: { open: '10:00', close: '22:00' }
      },
      images: [
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      latitude: 24.7136,
      longitude: 46.6753,
      isLadiesOnly: true,
      isMensOnly: false,
      hasPrivateRooms: true,
      hasFemaleStaff: true,
      isActive: true
    });
    
    // Second salon
    this.createSalon({
      ownerId: 2,
      name: 'Royal Spa & Wellness',
      description: 'Experience luxury and relaxation at Royal Spa & Wellness. Our professional staff are trained to provide the highest quality services in a tranquil environment.',
      address: 'Al Nakheel District',
      city: 'Riyadh',
      phoneNumber: '+966112345679',
      email: 'info@royalspa.com',
      website: 'www.royalspa.com',
      openingHours: {
        monday: { open: '09:00', close: '21:00' },
        tuesday: { open: '09:00', close: '21:00' },
        wednesday: { open: '09:00', close: '21:00' },
        thursday: { open: '09:00', close: '21:00' },
        friday: { open: '14:00', close: '21:00' },
        saturday: { open: '09:00', close: '21:00' },
        sunday: { open: '09:00', close: '21:00' }
      },
      images: [
        'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      latitude: 24.7741,
      longitude: 46.7384,
      isLadiesOnly: false,
      isMensOnly: false,
      hasPrivateRooms: true,
      hasFemaleStaff: true,
      isActive: true
    });
    
    // Third salon
    this.createSalon({
      ownerId: 2,
      name: "The Gentleman's Barber",
      description: "Exclusive barber shop for men offering premium haircuts, beard trims, and grooming services in a classic, sophisticated environment.",
      address: 'Al Malaz District',
      city: 'Riyadh',
      phoneNumber: '+966112345680',
      email: 'info@gentlemansbarber.com',
      website: 'www.gentlemansbarber.com',
      openingHours: {
        monday: { open: '08:00', close: '20:00' },
        tuesday: { open: '08:00', close: '20:00' },
        wednesday: { open: '08:00', close: '20:00' },
        thursday: { open: '08:00', close: '20:00' },
        friday: { open: '14:00', close: '20:00' },
        saturday: { open: '08:00', close: '20:00' },
        sunday: { open: '08:00', close: '20:00' }
      },
      images: [
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      latitude: 24.6748,
      longitude: 46.7302,
      isLadiesOnly: false,
      isMensOnly: true,
      hasPrivateRooms: false,
      hasFemaleStaff: false,
      isActive: true
    });
    
    // Staff
    this.createStaff({
      salonId: 1,
      fullName: 'Noura Ahmed',
      fullNameAr: 'نورة أحمد',
      role: 'Hair Stylist',
      roleAr: 'مصففة شعر',
      bio: 'With over 7 years of experience in hair styling, Noura specializes in modern cuts and styling techniques for all hair types. She is known for her attention to detail and personalized approach.',
      bioAr: 'بخبرة تزيد عن 7 سنوات في تصفيف الشعر، تتخصص نورة في القصات العصرية وتقنيات التصفيف لجميع أنواع الشعر. تشتهر باهتمامها بالتفاصيل ونهجها المخصص.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
      gender: 'female',
      isActive: true,
      isAvailable: true,
      rating: "4.8",
      experienceYears: 7,
      clients: 350,
      skills: [
        { name: "Haircuts", nameAr: "قصات الشعر", level: 5, category: "hair" },
        { name: "Styling", nameAr: "تصفيف", level: 5, category: "hair" },
        { name: "Coloring", nameAr: "تلوين", level: 4, category: "color" },
        { name: "Hair Treatments", nameAr: "علاجات الشعر", level: 4, category: "treatment" }
      ]
    });
    
    this.createStaff({
      salonId: 1,
      fullName: 'Maha Khalid',
      fullNameAr: 'مها خالد',
      role: 'Makeup Artist',
      roleAr: 'خبيرة مكياج',
      bio: "Maha is a certified makeup artist with a passion for bringing out her clients' natural beauty. She specializes in bridal makeup and special occasion looks.",
      bioAr: 'مها هي خبيرة مكياج معتمدة لديها شغف لإظهار جمال عملائها الطبيعي. تتخصص في مكياج العرائس وإطلالات المناسبات الخاصة.',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
      gender: 'female',
      isActive: true,
      isAvailable: true,
      rating: "4.9",
      experienceYears: 5,
      clients: 280,
      skills: [
        { name: "Bridal Makeup", nameAr: "مكياج عروس", level: 5, category: "makeup" },
        { name: "Formal Makeup", nameAr: "مكياج رسمي", level: 5, category: "makeup" },
        { name: "Lash Extensions", nameAr: "تمديد الرموش", level: 4, category: "makeup" },
        { name: "Contouring", nameAr: "كونتور", level: 5, category: "makeup" }
      ]
    });
    
    this.createStaff({
      salonId: 1,
      fullName: 'Layla Omar',
      fullNameAr: 'ليلى عمر',
      role: 'Nail Technician',
      roleAr: 'فنية أظافر',
      bio: 'Layla is a talented nail artist who focuses on nail health alongside stunning designs. She has mastered various techniques including gel, acrylic, and nail art.',
      bioAr: 'ليلى هي فنانة أظافر موهوبة تركز على صحة الأظافر إلى جانب التصاميم المذهلة. أتقنت تقنيات مختلفة بما في ذلك الجل والأكريليك وفن الأظافر.',
      image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
      gender: 'female',
      isActive: true,
      isAvailable: true,
      rating: "4.7",
      experienceYears: 4,
      clients: 210,
      skills: [
        { name: "Gel Nails", nameAr: "أظافر جل", level: 5, category: "nails" },
        { name: "Acrylic Nails", nameAr: "أظافر أكريليك", level: 4, category: "nails" },
        { name: "Nail Art", nameAr: "فن الأظافر", level: 5, category: "nails" },
        { name: "Manicure", nameAr: "مانيكير", level: 5, category: "nails" },
        { name: "Pedicure", nameAr: "باديكير", level: 4, category: "nails" }
      ]
    });
    
    this.createStaff({
      salonId: 1,
      fullName: 'Sara Nasser',
      fullNameAr: 'سارة ناصر',
      role: 'Esthetician',
      roleAr: 'أخصائية تجميل',
      bio: 'Sara specializes in facial treatments and skincare regimens. With her deep knowledge of skin types and conditions, she creates personalized treatments for long-lasting results.',
      bioAr: 'تتخصص سارة في علاجات الوجه وأنظمة العناية بالبشرة. بفضل معرفتها العميقة بأنواع البشرة وحالاتها، تقوم بإنشاء علاجات مخصصة لنتائج طويلة الأمد.',
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
      gender: 'female',
      isActive: true,
      isAvailable: true,
      rating: "4.6",
      experienceYears: 6,
      clients: 290,
      skills: [
        { name: "Facials", nameAr: "الفيشل", level: 5, category: "facial" },
        { name: "Chemical Peels", nameAr: "التقشير الكيميائي", level: 4, category: "facial" },
        { name: "Microdermabrasion", nameAr: "التقشير المجهري", level: 4, category: "facial" },
        { name: "Anti-aging Treatments", nameAr: "علاجات مكافحة الشيخوخة", level: 5, category: "facial" },
        { name: "Skin Consultation", nameAr: "استشارات البشرة", level: 5, category: "facial" }
      ]
    });
    
    // Services for Elegant Beauty Lounge
    this.createService({
      salonId: 1,
      categoryId: 1,
      nameEn: 'Haircut & Styling',
      nameAr: 'قص وتصفيف الشعر',
      descriptionEn: 'Professional haircut and styling by our expert stylists',
      descriptionAr: 'قص وتصفيف شعر احترافي من قبل مصففينا الخبراء',
      price: 150,
      durationMinutes: 45,
      isPopular: true,
      isActive: true
    });
    
    this.createService({
      salonId: 1,
      categoryId: 4,
      nameEn: 'Hair Color',
      nameAr: 'صبغة شعر',
      descriptionEn: 'Full hair coloring with premium products',
      descriptionAr: 'صبغة شعر كاملة باستخدام منتجات متميزة',
      price: 300,
      durationMinutes: 90,
      isPopular: false,
      isActive: true
    });
    
    this.createService({
      salonId: 1,
      categoryId: 5,
      nameEn: 'Makeup - Special Occasion',
      nameAr: 'مكياج - مناسبات خاصة',
      descriptionEn: 'Professional makeup application for special occasions',
      descriptionAr: 'مكياج احترافي للمناسبات الخاصة',
      price: 250,
      durationMinutes: 60,
      isPopular: false,
      isActive: true
    });
    
    // Services for Royal Spa
    this.createService({
      salonId: 2,
      categoryId: 2,
      nameEn: 'Full Body Massage',
      nameAr: 'مساج كامل للجسم',
      descriptionEn: 'Relaxing full body massage to relieve stress and tension',
      descriptionAr: 'مساج استرخاء كامل للجسم لتخفيف التوتر والإجهاد',
      price: 200,
      durationMinutes: 60,
      isPopular: true,
      isActive: true
    });
    
    // Services for Gentleman's Barber
    this.createService({
      salonId: 3,
      categoryId: 1,
      nameEn: "Classic Men's Haircut",
      nameAr: 'قصة شعر كلاسيكية للرجال',
      descriptionEn: 'Traditional haircut with hot towel and styling',
      descriptionAr: 'قصة شعر تقليدية مع منشفة ساخنة وتصفيف',
      price: 120,
      durationMinutes: 30,
      isPopular: true,
      isActive: true
    });
    
    this.createService({
      salonId: 3,
      categoryId: 6,
      nameEn: 'Beard Trim & Shape',
      nameAr: 'تهذيب وتشكيل اللحية',
      descriptionEn: 'Professional beard trimming and shaping',
      descriptionAr: 'تهذيب وتشكيل احترافي للحية',
      price: 80,
      durationMinutes: 20,
      isPopular: false,
      isActive: true
    });
    
    // Promotions
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1);
    
    this.createPromotion({
      salonId: 2,
      titleEn: '50% OFF',
      titleAr: 'خصم ٥٠٪',
      descriptionEn: 'First-time spa treatments at Royal Spa & Wellness',
      descriptionAr: 'علاجات السبا للمرة الأولى في رويال سبا آند ويلنس',
      discount: 50,
      discountType: 'percentage',
      image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      startDate: new Date(),
      endDate: futureDate,
      isActive: true
    });
    
    this.createPromotion({
      salonId: 1,
      titleEn: 'Buy 1 Get 1',
      titleAr: 'اشتر ١ واحصل على ١ مجانا',
      descriptionEn: 'On all hair treatments at Elegant Beauty Lounge',
      descriptionAr: 'على جميع علاجات الشعر في إليغانت بيوتي لاونج',
      discount: 100,
      discountType: 'percentage',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      startDate: new Date(),
      endDate: futureDate,
      isActive: true
    });
  }
}

export const storage = new MemStorage();
