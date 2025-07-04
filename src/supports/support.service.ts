 import { desc, eq } from "drizzle-orm";
import db from "../drizzle/db";
import { supportTable, TSupportInsert, TSupportSelect } from "../drizzle/schema";

// Get all Support Tickets
export const getSupportsServices = async (): Promise<TSupportSelect[] | null> => {
    return await db.query.supportTable.findMany({
        with:{
            user:true,
        },
        orderBy: [desc(supportTable.ticketId)]
    });
};

// Get Support Ticket by ID
export const getSupportByIdServices = async (ticketId: number): Promise<TSupportSelect | undefined> => {
    return await db.query.supportTable.findFirst({
        where: eq(supportTable.ticketId, ticketId)
    });
};

// Create a new Support Ticket
export const createSupportServices = async (support: TSupportInsert): Promise<string> => {
    await db.insert(supportTable).values(support).returning();
    return "Support ticket created successfully 🎉";
};

// Update an existing Support Ticket
export const updateSupportServices = async (
    ticketId: number,
    support: Partial<TSupportInsert>
): Promise<string> => {
    await db.update(supportTable).set(support).where(eq(supportTable.ticketId, ticketId));
    return "Support ticket updated successfully 😎";
};

// Delete a Support Ticket
export const deleteSupportServices = async (ticketId: number): Promise<string> => {
    await db.delete(supportTable).where(eq(supportTable.ticketId, ticketId));
    return "Support ticket deleted successfully 🎉";
};
