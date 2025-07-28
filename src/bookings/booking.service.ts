 

import { and, desc, eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
  bookingTable,
  TBookingInsert,
  TBookingSelect,
} from "../drizzle/schema";

//  Allowed status values (sync with schema & controller)
export const allowedStatuses = [
  "pending",
  "confirmed",
  "canceled",
  "completed",
] as const;

export type BookingStatus = typeof allowedStatuses[number];

//  Get all bookings with optional filters
export const getBookingsServices = async (filters?: {
  userId?: number;
  status?: BookingStatus;
}): Promise<TBookingSelect[]> => {
  const whereClauses = [];

  if (filters?.userId !== undefined) {
    whereClauses.push(eq(bookingTable.userId, filters.userId));
  }

  if (filters?.status !== undefined) {
    whereClauses.push(eq(bookingTable.status, filters.status));
  }

  return await db.query.bookingTable.findMany({
    where: whereClauses.length > 0 ? and(...whereClauses) : undefined,
    with: {
      user: {
        columns: {
          userId: true,
          firstName: true,
          lastName: true,
          email: true,
          contactPhone: true,
        },
      },
      event: {
        with: {
          venue: true,
        },
      },
      payment: true,
    },
    orderBy: [desc(bookingTable.bookingId)],
  });
};

// Get booking by ID
export const getBookingByIdServices = async (
  bookingId: number
): Promise<TBookingSelect | undefined> => {
  return await db.query.bookingTable.findFirst({
    where: eq(bookingTable.bookingId, bookingId),
    with: {
      user: {
        columns: {
          userId: true,
          firstName: true,
          lastName: true,
          email: true,
          contactPhone: true,
        },
      },
      event: {
        with: {
          venue: true,
        },
      },
      payment: true,
    },
  });
};

// ✅ Create booking
export const createBookingServices = async (
  booking: TBookingInsert
): Promise<TBookingSelect> => {
  const [created] = await db
    .insert(bookingTable)
    .values(booking)
    .returning();

  return created; // Return the full created object for the frontend
};

// ✅ Update booking
export const updateBookingServices = async (
  bookingId: number,
  booking: Partial<TBookingInsert>
): Promise<string> => {
  await db
    .update(bookingTable)
    .set(booking)
    .where(eq(bookingTable.bookingId, bookingId));
  return "Booking updated successfully 😎";
};

// ✅ Delete booking
export const deleteBookingServices = async (
  bookingId: number
): Promise<string> => {
  await db
    .delete(bookingTable)
    .where(eq(bookingTable.bookingId, bookingId));
  return "Booking deleted successfully 🗑️";
};
