import { pgTable, text, serial, timestamp, boolean, integer, jsonb, varchar, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  profileImage: text("profile_image"),
  loyaltyPoints: integer("loyalty_points").default(0).notNull(),
  preferredLanguage: text("preferred_language").default("en").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  role: text("role").default("customer").notNull(), // customer, salonOwner, admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Salons table
export const salons = pgTable("salons", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email"),
  website: text("website"),
  openingHours: jsonb("opening_hours").notNull(),
  images: text("images").array().notNull(),
  rating: real("rating").default(0).notNull(),
  reviewCount: integer("review_count").default(0).notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  isLadiesOnly: boolean("is_ladies_only").default(false).notNull(),
  isMensOnly: boolean("is_mens_only").default(false).notNull(),
  hasPrivateRooms: boolean("has_private_rooms").default(false).notNull(),
  hasFemaleStaff: boolean("has_female_staff").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  iconClass: text("icon_class").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Staff table
export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  salonId: integer("salon_id").notNull().references(() => salons.id),
  name: text("name").notNull(),
  role: text("role").notNull(),
  image: text("image"),
  gender: text("gender").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Services table
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  salonId: integer("salon_id").notNull().references(() => salons.id),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  price: integer("price").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  isPopular: boolean("is_popular").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  salonId: integer("salon_id").notNull().references(() => salons.id),
  serviceId: integer("service_id").notNull().references(() => services.id),
  staffId: integer("staff_id").references(() => staff.id),
  date: timestamp("date").notNull(),
  status: text("status").default("pending").notNull(), // pending, confirmed, completed, cancelled
  totalPrice: integer("total_price").notNull(),
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status").default("unpaid").notNull(),
  loyaltyPointsEarned: integer("loyalty_points_earned").default(0).notNull(),
  loyaltyPointsUsed: integer("loyalty_points_used").default(0).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  userId: integer("user_id").notNull().references(() => users.id),
  salonId: integer("salon_id").notNull().references(() => salons.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  serviceRating: integer("service_rating"),
  staffRating: integer("staff_rating"),
  cleanlinessRating: integer("cleanliness_rating"),
  valueRating: integer("value_rating"),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Promotions table
export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  salonId: integer("salon_id").notNull().references(() => salons.id),
  titleEn: text("title_en").notNull(),
  titleAr: text("title_ar").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionAr: text("description_ar").notNull(),
  discount: integer("discount").notNull(),
  discountType: text("discount_type").default("percentage").notNull(), // percentage, fixed
  image: text("image").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Favorites table
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  salonId: integer("salon_id").notNull().references(() => salons.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, loyaltyPoints: true });
export const insertSalonSchema = createInsertSchema(salons).omit({ id: true, createdAt: true, rating: true, reviewCount: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true, createdAt: true });
export const insertStaffSchema = createInsertSchema(staff).omit({ id: true, createdAt: true });
export const insertServiceSchema = createInsertSchema(services).omit({ id: true, createdAt: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true, loyaltyPointsEarned: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true, isVerified: true });
export const insertPromotionSchema = createInsertSchema(promotions).omit({ id: true, createdAt: true });
export const insertFavoriteSchema = createInsertSchema(favorites).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Salon = typeof salons.$inferSelect;
export type InsertSalon = z.infer<typeof insertSalonSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Staff = typeof staff.$inferSelect;
export type InsertStaff = z.infer<typeof insertStaffSchema>;

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Promotion = typeof promotions.$inferSelect;
export type InsertPromotion = z.infer<typeof insertPromotionSchema>;

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
