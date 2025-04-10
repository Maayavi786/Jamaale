import express, { Router, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertUserSchema,
  insertBookingSchema,
  insertReviewSchema,
  insertFavoriteSchema
} from "@shared/schema";

const apiRouter = Router();

// User routes
apiRouter.post("/users/register", async (req: Request, res: Response) => {
  try {
    const validateUser = insertUserSchema.safeParse(req.body);
    
    if (!validateUser.success) {
      return res.status(400).json({ 
        message: "Invalid user data", 
        errors: validateUser.error.errors 
      });
    }
    
    const existingUser = await storage.getUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    const existingEmail = await storage.getUserByEmail(req.body.email);
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    
    const user = await storage.createUser(validateUser.data);
    const { password, ...userWithoutPassword } = user;
    
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

apiRouter.post("/users/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    const user = await storage.getUserByUsername(username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

apiRouter.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

// Salon routes
apiRouter.get("/salons", async (_req: Request, res: Response) => {
  try {
    const salons = await storage.getAllSalons();
    res.status(200).json(salons);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

apiRouter.get("/salons/featured", async (_req: Request, res: Response) => {
  try {
    const salons = await storage.getFeaturedSalons();
    res.status(200).json(salons);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

apiRouter.get("/salons/top-rated", async (_req: Request, res: Response) => {
  try {
    const salons = await storage.getTopRatedSalons();
    res.status(200).json(salons);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

apiRouter.get("/salons/near", async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ message: "Invalid latitude or longitude" });
    }
    
    const salons = await storage.getNearSalons(lat, lng);
    res.status(200).json(salons);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

apiRouter.get("/salons/search", async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    
    const salons = await storage.searchSalons(query);
    res.status(200).json(salons);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

apiRouter.get("/salons/filter", async (req: Request, res: Response) => {
  try {
    const filters: Record<string, any> = {};
    
    if (req.query.isLadiesOnly === 'true') filters.isLadiesOnly = true;
    if (req.query.isMensOnly === 'true') filters.isMensOnly = true;
    if (req.query.hasPrivateRooms === 'true') filters.hasPrivateRooms = true;
    if (req.query.hasFemaleStaff === 'true') filters.hasFemaleStaff = true;
    if (req.query.city) filters.city = req.query.city;
    
    const salons = await storage.filterSalons(filters);
    res.status(200).json(salons);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

apiRouter.get("/salons/:id", async (req: Request, res: Response) => {
  try {
    const salonId = parseInt(req.params.id);
    
    if (isNaN(salonId)) {
      return res.status(400).json({ message: "Invalid salon ID" });
    }
    
    const salon = await storage.getSalon(salonId);
    
    if (!salon) {
      return res.status(404).json({ message: "Salon not found" });
    }
    
    res.status(200).json(salon);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

// Category routes
apiRouter.get("/categories", async (_req: Request, res: Response) => {
  try {
    const categories = await storage.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

// Staff routes
apiRouter.get("/salons/:id/staff", async (req: Request, res: Response) => {
  try {
    const salonId = parseInt(req.params.id);
    
    if (isNaN(salonId)) {
      return res.status(400).json({ message: "Invalid salon ID" });
    }
    
    const staffMembers = await storage.getStaffBySalon(salonId);
    res.status(200).json(staffMembers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

// Get a specific staff member
apiRouter.get("/salons/:salonId/staff/:staffId", async (req: Request, res: Response) => {
  try {
    const salonId = parseInt(req.params.salonId);
    const staffId = parseInt(req.params.staffId);
    
    if (isNaN(salonId) || isNaN(staffId)) {
      return res.status(400).json({ message: "Invalid salon ID or staff ID" });
    }
    
    const staffMember = await storage.getStaff(staffId);
    
    if (!staffMember || staffMember.salonId !== salonId) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    
    res.status(200).json(staffMember);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

// Service routes
apiRouter.get("/salons/:id/services", async (req: Request, res: Response) => {
  try {
    const salonId = parseInt(req.params.id);
    
    if (isNaN(salonId)) {
      return res.status(400).json({ message: "Invalid salon ID" });
    }
    
    const services = await storage.getServicesBySalon(salonId);
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

// Booking routes
apiRouter.post("/bookings", async (req: Request, res: Response) => {
  try {
    const validateBooking = insertBookingSchema.safeParse(req.body);
    
    if (!validateBooking.success) {
      return res.status(400).json({ 
        message: "Invalid booking data", 
        errors: validateBooking.error.errors 
      });
    }
    
    const booking = await storage.createBooking(validateBooking.data);
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

apiRouter.get("/users/:id/bookings", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const bookings = await storage.getUserBookings(userId);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

apiRouter.patch("/bookings/:id/status", async (req: Request, res: Response) => {
  try {
    const bookingId = parseInt(req.params.id);
    const { status } = req.body;
    
    if (isNaN(bookingId)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }
    
    if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const booking = await storage.updateBookingStatus(bookingId, status);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

// Review routes
apiRouter.post("/reviews", async (req: Request, res: Response) => {
  try {
    const validateReview = insertReviewSchema.safeParse(req.body);
    
    if (!validateReview.success) {
      return res.status(400).json({ 
        message: "Invalid review data", 
        errors: validateReview.error.errors 
      });
    }
    
    const review = await storage.createReview(validateReview.data);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

apiRouter.get("/salons/:id/reviews", async (req: Request, res: Response) => {
  try {
    const salonId = parseInt(req.params.id);
    
    if (isNaN(salonId)) {
      return res.status(400).json({ message: "Invalid salon ID" });
    }
    
    const reviews = await storage.getSalonReviews(salonId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

// Promotion routes
apiRouter.get("/promotions/active", async (_req: Request, res: Response) => {
  try {
    const promotions = await storage.getActivePromotions();
    res.status(200).json(promotions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

apiRouter.get("/salons/:id/promotions", async (req: Request, res: Response) => {
  try {
    const salonId = parseInt(req.params.id);
    
    if (isNaN(salonId)) {
      return res.status(400).json({ message: "Invalid salon ID" });
    }
    
    const promotions = await storage.getSalonPromotions(salonId);
    res.status(200).json(promotions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

// Favorite routes
apiRouter.get("/users/:id/favorites", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const favorites = await storage.getUserFavorites(userId);
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

apiRouter.post("/favorites", async (req: Request, res: Response) => {
  try {
    const validateFavorite = insertFavoriteSchema.safeParse(req.body);
    
    if (!validateFavorite.success) {
      return res.status(400).json({ 
        message: "Invalid favorite data", 
        errors: validateFavorite.error.errors 
      });
    }
    
    const favorite = await storage.addFavorite(validateFavorite.data);
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

apiRouter.delete("/favorites", async (req: Request, res: Response) => {
  try {
    const { userId, salonId } = req.body;
    
    if (!userId || !salonId) {
      return res.status(400).json({ message: "userId and salonId are required" });
    }
    
    const result = await storage.removeFavorite(parseInt(userId), parseInt(salonId));
    
    if (!result) {
      return res.status(404).json({ message: "Favorite not found" });
    }
    
    res.status(200).json({ message: "Favorite removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

apiRouter.get("/favorites/check", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.query.userId as string);
    const salonId = parseInt(req.query.salonId as string);
    
    if (isNaN(userId) || isNaN(salonId)) {
      return res.status(400).json({ message: "Invalid userId or salonId" });
    }
    
    const isFavorite = await storage.isFavorite(userId, salonId);
    res.status(200).json({ isFavorite });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
});

export async function registerRoutes(app: express.Express): Promise<Server> {
  app.use("/api", apiRouter);
  
  const httpServer = createServer(app);
  
  return httpServer;
}
