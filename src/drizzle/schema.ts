 import { relations } from "drizzle-orm";
import { pgTable,serial,varchar,text,integer,decimal,timestamp,pgEnum} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("userType", ["member", "admin", "disabled"]);
export const bookingStatusEnum = pgEnum("bookingStatus", ["pending",  "confirmed", "canceled",  "completed", ]);
export const paymentStatusEnum = pgEnum("paymentStatus", ["pending", "failed", "canceled", "completed"]);
export const ticketStatusEnum = pgEnum("ticketStatus", ["pending",  "in_progress",  "resolved",     "closed"]);

// Users table 
export const userTable = pgTable("userTable", {
  userId: serial("userId").primaryKey(),
  firstName: varchar("firstName"),
  lastName: varchar("lastName"),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  contactPhone: varchar("contactPhone"),
  address: text("address"),
  userType: roleEnum("userType").default("member"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Venue table
export const venueTable = pgTable("venueTable", {
  venueId: serial("venueId").primaryKey(),
  name: varchar("name").notNull(),
  address: text("address"),
  capacity: integer("capacity").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

// Events
export const eventTable = pgTable("eventTable", {
  eventId: serial("eventId").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  venueId: integer("venueId").notNull().references(() => venueTable.venueId, { onDelete: "cascade" }),
  category: varchar("category"),
  date: varchar("date"),
  time: varchar("time"),
  ticketPrice: decimal("ticketPrice").notNull(),
  ticketsTotal: integer("ticketsTotal").notNull(),
  ticketsSold: integer("ticketsSold").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Bookings tables
export const bookingTable = pgTable("bookingTable", {
  bookingId: serial("bookingId").primaryKey(),
  userId: integer("userId").notNull().references(() => userTable.userId, { onDelete: "cascade" }),
  eventId: integer("eventId").notNull().references(() => eventTable.eventId, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  totalAmount: decimal("totalAmount").notNull(),
  status: bookingStatusEnum("status").default("pending"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Payment table
export const paymentTable = pgTable("paymentTable", {
  paymentId: serial("paymentId").primaryKey(),
  bookingId: integer("bookingId").notNull().references(() => bookingTable.bookingId, { onDelete: "cascade" }),
  amount: decimal("amount").notNull(),
  paymentStatus: paymentStatusEnum("paymentStatus").default("pending"),
  paymentDate: timestamp("paymentDate").defaultNow(),
  paymentMethod: varchar("paymentMethod"),
  transactionId: varchar("transactionId"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Support Tickets table
export const supportTable = pgTable("supportTable", {
  ticketId: serial("ticketId").primaryKey(),
  userId: integer("userId").notNull().references(() => userTable.userId, { onDelete: "cascade" }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: ticketStatusEnum("status").default("pending"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// RELATIONS

export const userRelations = relations(userTable, ({ many }) => ({
  bookings: many(bookingTable),
  supportTickets: many(supportTable),
}));

export const venueRelations = relations(venueTable, ({ many }) => ({
  events: many(eventTable),
}));

export const eventRelations = relations(eventTable, ({ one, many }) => ({
  venue: one(venueTable, {
    fields: [eventTable.venueId],
    references: [venueTable.venueId],
  }),
  bookings: many(bookingTable),
}));

export const bookingRelations = relations(bookingTable, ({ one }) => ({
  user: one(userTable, {
    fields: [bookingTable.userId],
    references: [userTable.userId],
  }),
  event: one(eventTable, {
    fields: [bookingTable.eventId],
    references: [eventTable.eventId],
  }),
  payment: one(paymentTable, {
    fields: [bookingTable.bookingId],
    references: [paymentTable.bookingId],
  }),
}));

export const paymentRelations = relations(paymentTable, ({ one }) => ({
  booking: one(bookingTable, {
    fields: [paymentTable.bookingId],
    references: [bookingTable.bookingId],
  }),
}));

export const supportRelations = relations(supportTable, ({ one }) => ({
  user: one(userTable, {
    fields: [supportTable.userId],
    references: [userTable.userId],
  }),
}));
// TYPES

export type TUserInsert = typeof userTable.$inferInsert;
export type TUserSelect = typeof userTable.$inferSelect;

export type TVenueInsert = typeof venueTable.$inferInsert;
export type TVenueSelect = typeof venueTable.$inferSelect;

export type TEventInsert = typeof eventTable.$inferInsert;
export type TEventSelect = typeof eventTable.$inferSelect;

export type TBookingInsert = typeof bookingTable.$inferInsert;
export type TBookingSelect = typeof bookingTable.$inferSelect;

export type TPaymentInsert = typeof paymentTable.$inferInsert;
export type TPaymentSelect = typeof paymentTable.$inferSelect;

export type TSupportInsert = typeof supportTable.$inferInsert;
export type TSupportSelect = typeof supportTable.$inferSelect;
