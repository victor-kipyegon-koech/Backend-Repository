 
 

import { desc, eq } from "drizzle-orm";
import db from "../drizzle/db";
import { eventTable, TEventInsert, TEventSelect } from "../drizzle/schema";

// Get all Events
export const getEventsServices = async (): Promise<any[]> => {
  const events = await db.query.eventTable.findMany({
    with: {
      venue: true,
      bookings: true,
    },
    orderBy: [desc(eventTable.eventId)],
  });

  return events.map(({ bookings, ...event }) => ({
    ...event,
    remainingTickets: event.ticketsTotal - bookings.length,
  }));
};

// Get event by ID
export const getEventByIdServices = async (
  eventId: number
): Promise<TEventSelect | undefined> => {
  return await db.query.eventTable.findFirst({
    where: eq(eventTable.eventId, eventId),
  });
};

// ✅ Create a new event and return the full event object
export const createEventServices = async (
  event: TEventInsert
): Promise<TEventSelect> => {
  console.log("📥 Creating event:", event);
  const [insertedEvent] = await db.insert(eventTable).values(event).returning();
  console.log("✅ Event inserted:", insertedEvent);
  return insertedEvent;
};

// Update event
export const updateEventServices = async (
  eventId: number,
  event: Partial<TEventInsert>
): Promise<string> => {
  console.log("✏️ Updating event:", eventId, event);
  await db.update(eventTable).set(event).where(eq(eventTable.eventId, eventId));
  return "Event updated successfully 😎";
};

// Delete event
export const deleteEventServices = async (
  eventId: number
): Promise<string> => {
  console.log("🗑️ Deleting event:", eventId);
  await db.delete(eventTable).where(eq(eventTable.eventId, eventId));
  return "Event deleted successfully 🎉";
};
