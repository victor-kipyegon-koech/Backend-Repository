import { desc, eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TUserInsert, TUserSelect, userTable } from "../drizzle/schema";

// CRUD Operations for User entity

// Get all users
export const getUsersServices = async (): Promise<TUserSelect[] | null> => {
  return await db.query.userTable.findMany({
    with: {
      bookings: true,
      supportTickets: true,
    },
    orderBy: [desc(userTable.userId)],
  });
};

// Get user by ID
export const getUserByIdServices = async (
  userId: number
): Promise<TUserSelect | undefined> => {
  return await db.query.userTable.findFirst({
    where: eq(userTable.userId, userId),
    with: {
      bookings: true,
      supportTickets: true,
    },
  });
};

// Create a new user
export const createUserServices = async (user: TUserInsert): Promise<string> => {
  await db.insert(userTable).values(user).returning();
  return "User Created Successfully 😎";
};

// ✅ Update an existing user with partial data
export const updateUserServices = async (
  userId: number,
  user: Partial<TUserInsert>
): Promise<string> => {
  await db.update(userTable).set(user).where(eq(userTable.userId, userId));
  return "User Updated Successfully 😎";
};

// Delete an existing user
export const deleteUserServices = async (userId: number): Promise<string> => {
  await db.delete(userTable).where(eq(userTable.userId, userId));
  return "User Deleted Successfully";
};


// import { desc, eq } from "drizzle-orm";
// import db from "../drizzle/db";
// import { TUserInsert, TUserSelect, userTable } from "../drizzle/schema";

// // ========== Get all users ==========
// export const getUsersServices = async (): Promise<TUserSelect[] | null> => {
//   return await db.query.userTable.findMany({
//     with: {
//       bookings: true,
//       supportTickets: true,
//     },
//     orderBy: [desc(userTable.userId)],
//   });
// };

// // ========== Get user by ID ==========
// export const getUserByIdServices = async (
//   userId: number
// ): Promise<TUserSelect | undefined> => {
//   return await db.query.userTable.findFirst({
//     where: eq(userTable.userId, userId),
//     with: {
//       bookings: true,
//       supportTickets: true,
//     },
//   });
// };

// // ========== Create a new user ==========
// export const createUserServices = async (
//   user: TUserInsert
// ): Promise<string> => {
//   await db.insert(userTable).values(user).returning();
//   return "User Created Successfully 😎";
// };

// // ========== Update user and return updated user ==========
// export const updateUserServices = async (
//   userId: number,
//   user: Partial<TUserInsert>
// ): Promise<TUserSelect | undefined> => {
//   await db.update(userTable).set(user).where(eq(userTable.userId, userId));

//   return await db.query.userTable.findFirst({
//     where: eq(userTable.userId, userId),
//     with: {
//       bookings: true,
//       supportTickets: true,
//     },
//   });
// };

// // ========== Delete a user ==========
// export const deleteUserServices = async (
//   userId: number
// ): Promise<string> => {
//   await db.delete(userTable).where(eq(userTable.userId, userId));
//   return "User Deleted Successfully";
// };
