 
import { Request, Response } from "express";
import {
  getBookingsServices,
  getBookingByIdServices,
  createBookingServices,
  updateBookingServices,
  deleteBookingServices,
  allowedStatuses,
  BookingStatus,
} from "./booking.service";

// ✅ Get all bookings with optional filters
export const getBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, status } = req.query;

    const parsedUserId =
      typeof userId === 'string' && userId.trim() !== '' && !isNaN(Number(userId))
        ? Number(userId)
        : undefined;

    const parsedStatus = status as BookingStatus | undefined;

    if (parsedStatus && !allowedStatuses.includes(parsedStatus)) {
      res.status(400).json({ error: "Invalid booking status filter" });
      return;
    }

    const allBookings = await getBookingsServices({
      userId: parsedUserId,
      status: parsedStatus,
    });

    // ✅ Return empty array if no bookings instead of 404
    res.status(200).json(allBookings || []);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch bookings" });
  }
};

// ✅ Get a single booking by ID
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

// ✅ Create a new booking
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  const { userId, eventId, quantity, totalAmount, status } = req.body;

  if (!userId || !eventId || !quantity || !totalAmount) {
    res.status(400).json({
      error: "Required fields: userId, eventId, quantity, totalAmount",
    });
    return;
  }

  if (status && !allowedStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid booking status" });
    return;
  }

  try {
    const newBooking = await createBookingServices({
      userId,
      eventId,
      quantity,
      totalAmount,
      status,
    });

    res.status(201).json(newBooking);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create booking" });
  }
};

// ✅ Update an entire booking
export const updateBooking = async (req: Request, res: Response): Promise<void> => {
  const bookingId = parseInt(req.params.id);
  if (isNaN(bookingId)) {
    res.status(400).json({ error: "Invalid booking ID" });
    return;
  }

  const { userId, eventId, quantity, totalAmount, status } = req.body;

  if (status && !allowedStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid booking status" });
    return;
  }

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

// ✅ Update booking status only
export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  const bookingId = parseInt(req.params.id);
  const { status } = req.body;

  if (isNaN(bookingId) || !status) {
    res.status(400).json({ error: "Invalid booking ID or missing status" });
    return;
  }

  if (!allowedStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid booking status" });
    return;
  }

  try {
    const message = await updateBookingServices(bookingId, { status });
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update booking status" });
  }
};

// ✅ Delete a booking
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
