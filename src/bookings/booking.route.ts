 
 import { Router } from "express";
import {
  createBooking,
  deleteBooking,
  getBookingById,
  getBookings,
  updateBooking,
  updateBookingStatus,
} from "./booking.controller";

export const bookingRouter = Router();

// ✅ More specific route FIRST
bookingRouter.get("/bookings", getBookings);

// ✅ Then dynamic route
bookingRouter.get("/bookings/:id", getBookingById);

// ✅ Other routes
bookingRouter.post("/bookings", createBooking);
bookingRouter.put("/bookings/:id", updateBooking);
bookingRouter.patch("/bookings/:id/status", updateBookingStatus);
bookingRouter.delete("/bookings/:id", deleteBooking);

