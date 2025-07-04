 import { desc, eq } from "drizzle-orm";
import db from "../drizzle/db";
import { eventTable, TEventInsert, TEventSelect } from "../drizzle/schema";

// CRUD Operations for Event entity

// Get all Events
export const getEventsServices = async (): Promise<TEventSelect[] | null> => {
    return await db.query.eventTable.findMany({
        with:{
            venue:true,
            bookings:true,
        },
        orderBy: [desc(eventTable.eventId)]
    });
};

// Get event by ID
export const getEventByIdServices = async (eventId: number): Promise<TEventSelect | undefined> => {
    return await db.query.eventTable.findFirst({
        where: eq(eventTable.eventId, eventId)
    });
};

// Create a new event
export const createEventServices = async (event: TEventInsert): Promise<string> => {
    await db.insert(eventTable).values(event).returning();
    return "Event created successfully 🎉";
};

// Update an existing event
export const updateEventServices = async (eventId: number, event: Partial<TEventInsert>): Promise<string> => {
    await db.update(eventTable).set(event).where(eq(eventTable.eventId, eventId));
    return "Event updated successfully 😎";
};

// Delete an event
export const deleteEventServices = async (eventId: number): Promise<string> => {
    await db.delete(eventTable).where(eq(eventTable.eventId, eventId));
    return "Event deleted successfully 🎉";
};
