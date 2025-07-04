import { desc, eq } from "drizzle-orm";
import db from "../drizzle/db";
import { venueTable, TVenueInsert, TVenueSelect } from "../drizzle/schema";

// CRUD Operations for Venue entity

// Get all venues
export const getVenuesServices = async (): Promise<TVenueSelect[] | null> => {
  return await db.query.venueTable.findMany({
    orderBy: [desc(venueTable.venueId)],
  });
};

// Get venue by ID
export const getVenueByIdServices = async (
  venueId: number
): Promise<TVenueSelect | undefined> => {
  return await db.query.venueTable.findFirst({
    where: eq(venueTable.venueId, venueId),
  });
};

// Create a new venue
export const createVenueServices = async (
  venue: TVenueInsert
): Promise<string> => {
  await db.insert(venueTable).values(venue).returning();
  return "Venue created successfully 🎉";
};

// Update an existing venue
export const updateVenueServices = async (
  venueId: number,
  venue: Partial<TVenueInsert>
): Promise<string> => {
  await db
    .update(venueTable)
    .set(venue)
    .where(eq(venueTable.venueId, venueId));
  return "Venue updated successfully 😎";
};

// Delete a venue
export const deleteVenueServices = async (
  venueId: number
): Promise<string> => {
  await db.delete(venueTable).where(eq(venueTable.venueId, venueId));
  return "Venue deleted successfully 🎉";
};
