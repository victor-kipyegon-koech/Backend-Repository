import { Router } from "express";

import { adminRoleAuth } from "../middleware/bearAuth";
import {
  createBooking,
  deleteBooking,
  getBookingById,
  getBookings,
  updateBooking,
} from "./booking.controller";

export const bookingRouter = Router();

// get all bookings
bookingRouter.get("/bookings", getBookings);

// geta booking by  id
bookingRouter.get("/bookings/:id", getBookingById);

// Create  booking  
bookingRouter.post("/bookings", createBooking);

//update a booking 
bookingRouter.put("/bookings/:id", updateBooking);

// delete a booking 
bookingRouter.delete("/bookings/:id", deleteBooking);
