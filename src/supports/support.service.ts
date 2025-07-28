 
// import { desc, eq } from "drizzle-orm";
// import db from "../drizzle/db";
// import {
//   supportTable,
//   TSupportInsert,
//   TSupportSelect
// } from "../drizzle/schema";

// // Get all support tickets
// export const getSupportsServices = async (): Promise<TSupportSelect[] | null> => {
//   try {
//     const results = await db.query.supportTable.findMany({
//       with: {
//         user: true, // assuming relations are set up properly
//       },
//       orderBy: [desc(supportTable.ticketId)],
//     });
//     return results;
//   } catch (error: any) {
//     console.error("Error fetching support tickets:", error);
//     throw new Error("Failed to fetch support tickets");
//   }
// };

// // Get support ticket by ID
// export const getSupportByIdServices = async (ticketId: number): Promise<TSupportSelect | undefined> => {
//   try {
//     const ticket = await db.query.supportTable.findFirst({
//       where: eq(supportTable.ticketId, ticketId),
//     });
//     return ticket;
//   } catch (error: any) {
//     console.error(`Error fetching ticket ID ${ticketId}:`, error);
//     throw new Error("Failed to fetch support ticket");
//   }
// };

// // Create a new support ticket
// export const createSupportServices = async (support: TSupportInsert): Promise<string> => {
//   try {
//     console.log("Inserting support ticket:", support);

//     await db.insert(supportTable).values(support).returning(); // Use returning() if needed
//     return "Support ticket created successfully 🎉";
//   } catch (error: any) {
//     console.error("createSupportServices error:", error);
//     throw new Error("Database error: " + error.message);
//   }
// };

// // Update an existing support ticket
// export const updateSupportServices = async (
//   ticketId: number,
//   updates: Partial<TSupportInsert>
// ): Promise<string> => {
//   try {
//     await db
//       .update(supportTable)
//       .set(updates)
//       .where(eq(supportTable.ticketId, ticketId));
//     return "Support ticket updated successfully 😎";
//   } catch (error: any) {
//     console.error(`Error updating ticket ID ${ticketId}:`, error);
//     throw new Error("Failed to update support ticket");
//   }
// };

// // Delete a support ticket
// export const deleteSupportServices = async (ticketId: number): Promise<string> => {
//   try {
//     await db.delete(supportTable).where(eq(supportTable.ticketId, ticketId));
//     return "Support ticket deleted successfully 🗑️";
//   } catch (error: any) {
//     console.error(`Error deleting ticket ID ${ticketId}:`, error);
//     throw new Error("Failed to delete support ticket");
//   }
// };
 import { desc, eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
  supportTable,
  TSupportInsert,
  TSupportSelect
} from "../drizzle/schema";

// ✅ Get all support tickets (with user info)
export const getSupportsServices = async (): Promise<TSupportSelect[] | null> => {
  try {
    const results = await db.query.supportTable.findMany({
      with: {
        user: true, // ✅ ensure user relation is configured in schema
      },
      orderBy: [desc(supportTable.ticketId)],
    });
    return results;
  } catch (error: any) {
    console.error("Error fetching support tickets:", error);
    throw new Error("Failed to fetch support tickets");
  }
};

// ✅ Get a single support ticket by ID
export const getSupportByIdServices = async (
  ticketId: number
): Promise<TSupportSelect | undefined> => {
  try {
    const ticket = await db.query.supportTable.findFirst({
      where: eq(supportTable.ticketId, ticketId),
    });
    return ticket;
  } catch (error: any) {
    console.error(`Error fetching ticket ID ${ticketId}:`, error);
    throw new Error("Failed to fetch support ticket");
  }
};

// ✅ Create a new support ticket
export const createSupportServices = async (
  support: TSupportInsert
): Promise<string> => {
  try {
    const trimmedStatus = support.status?.trim() || "pending";
    const trimmedPriority = support.priority?.trim() || "medium";

    console.log("Inserting support ticket:", {
      ...support,
      status: trimmedStatus,
      priority: trimmedPriority,
    });

    await db.insert(supportTable).values({
      ...support,
      status: trimmedStatus as any,
      priority: trimmedPriority as any,
    });

    return "Support ticket created successfully 🎉";
  } catch (error: any) {
    console.error("createSupportServices error:", error);

    if (error?.code === "23503") {
      throw new Error("Invalid userId: user does not exist");
    }
    if (error?.code === "22P02" || error?.message?.includes("enum")) {
      throw new Error("Invalid enum value for status or priority");
    }

    throw new Error("Database error: " + error.message);
  }
};

// ✅ Update an existing support ticket
export const updateSupportServices = async (
  ticketId: number,
  updates: Partial<TSupportInsert>
): Promise<string> => {
  try {
    const cleanedUpdates = {
      ...(updates.subject && { subject: updates.subject.trim() }),
      ...(updates.message && { message: updates.message.trim() }),
      ...(updates.status && updates.status.trim() && {
        status: updates.status.trim() as any,
      }),
      ...(updates.priority && updates.priority.trim() && {
        priority: updates.priority.trim() as any,
      }),
    };

    console.log(`Updating ticket #${ticketId} with:`, cleanedUpdates);

    await db
      .update(supportTable)
      .set(cleanedUpdates)
      .where(eq(supportTable.ticketId, ticketId));

    return "Support ticket updated successfully 😎";
  } catch (error: any) {
    console.error(`Error updating ticket ID ${ticketId}:`, error);
    throw new Error("Failed to update support ticket");
  }
};

// ✅ Delete a support ticket
export const deleteSupportServices = async (
  ticketId: number
): Promise<string> => {
  try {
    await db.delete(supportTable).where(eq(supportTable.ticketId, ticketId));
    return "Support ticket deleted successfully 🗑️";
  } catch (error: any) {
    console.error(`Error deleting ticket ID ${ticketId}:`, error);
    throw new Error("Failed to delete support ticket");
  }
};
