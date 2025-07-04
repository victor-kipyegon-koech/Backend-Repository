 import { Request, Response } from "express";
import {
  getBookingsServices,
  getBookingByIdServices,
  createBookingServices,
  updateBookingServices,
  deleteBookingServices,
} from "./booking.service";

//get bookings
export const getBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const allBookings = await getBookingsServices();
    if (!allBookings || allBookings.length === 0) {
      res.status(404).json({ message: "No bookings found" });
    } else {
      res.status(200).json(allBookings);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch bookings" });
  }
};

// get booking by ID
export const getBookingById = async (req: Request, res: Response): Promise<void> => {
  const bookingId = parseInt(req.params.id);
  if (isNaN(bookingId)) {
    res.status(400).json({ message: "Invalid booking ID" });
    return;
  }

  try {
    const booking = await getBookingByIdServices(bookingId);
    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
    } else {
      res.status(200).json(booking);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch booking" });
  }
};

// create  booking
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  const {
    userId,
    eventId,
    quantity,        
    totalAmount,
    status,          
  } = req.body;

  if (!userId || !eventId || !quantity || !totalAmount) {
    res.status(400).json({
      error: "Required fields: userId, eventId, quantity, totalAmount",
    });
    return;
  }

  try {
    const message = await createBookingServices({
      userId,
      eventId,
      quantity,
      totalAmount,
      status,
    });
    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create booking" });
  }
};

// update  booking
export const updateBooking = async (req: Request, res: Response): Promise<void> => {
  const bookingId = parseInt(req.params.id);
  if (isNaN(bookingId)) {
    res.status(400).json({ error: "Invalid booking ID" });
    return;
  }

  const {
    userId,
    eventId,
    quantity,
    totalAmount,
    status,
  } = req.body;

  try {
    const message = await updateBookingServices(bookingId, {
      userId,
      eventId,
      quantity,
      totalAmount,
      status,
    });
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update booking" });
  }
};

// delete booking
export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  const bookingId = parseInt(req.params.id);
  if (isNaN(bookingId)) {
    res.status(400).json({ error: "Invalid booking ID" });
    return;
  }

  try {
    const booking = await getBookingByIdServices(bookingId);
    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    const result = await deleteBookingServices(bookingId);
    res.status(200).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete booking" });
  }
};
