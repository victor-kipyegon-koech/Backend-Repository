import { desc, eq } from "drizzle-orm";
import db from "../drizzle/db";
import { bookingTable, TBookingInsert, TBookingSelect } from "../drizzle/schema";

// CRUD Operations for Booking entity

// Get all Bookings
export const getBookingsServices = async (): Promise<TBookingSelect[] | null> => {
    return await db.query.bookingTable.findMany({
        with:{
            user:{
                columns:{
                    userId:true,
                    firstName:true,
                    lastName:true,
                    email:true,
                    contactPhone:true


                }
            },
            
            event:true,
            payment:true,
        },
        orderBy: [desc(bookingTable.bookingId)]
    });
};

// Get booking by ID
export const getBookingByIdServices = async (bookingId: number): Promise<TBookingSelect | undefined> => {
    return await db.query.bookingTable.findFirst({
        where: eq(bookingTable.bookingId, bookingId)
    });
};

// Create a new booking
export const createBookingServices = async (booking: TBookingInsert): Promise<string> => {
    await db.insert(bookingTable).values(booking).returning();
    return "Booking created successfully 🎉";
};

// Update an existing booking
export const updateBookingServices = async (bookingId: number, booking: Partial<TBookingInsert>): Promise<string> => {
    await db.update(bookingTable).set(booking).where(eq(bookingTable.bookingId, bookingId));
    return "Booking updated successfully 😎";
};

// Delete a booking
export const deleteBookingServices = async (bookingId: number): Promise<string> => {
    await db.delete(bookingTable).where(eq(bookingTable.bookingId, bookingId));
    return "Booking deleted successfully 🎉";
};
