import { desc, eq } from "drizzle-orm";
import db from "../drizzle/db";
import { paymentTable, TPaymentInsert, TPaymentSelect } from "../drizzle/schema";

// CRUD Operations for Payment entity

// Get all Payments
export const getPaymentsServices = async (): Promise<TPaymentSelect[] | null> => {
    return await db.query.paymentTable.findMany({
        with:{
            booking:true,
        },
        orderBy: [desc(paymentTable.paymentId)]
    });
};

// Get payment by ID
export const getPaymentByIdServices = async (paymentId: number): Promise<TPaymentSelect | undefined> => {
    return await db.query.paymentTable.findFirst({
        where: eq(paymentTable.paymentId, paymentId)
    });
};

// Create a new payment
export const createPaymentServices = async (payment: TPaymentInsert): Promise<string> => {
    await db.insert(paymentTable).values(payment).returning();
    return "Payment created successfully 🎉";
};

// Update an existing payment
export const updatePaymentServices = async (paymentId: number, payment: Partial<TPaymentInsert>): Promise<string> => {
    await db.update(paymentTable).set(payment).where(eq(paymentTable.paymentId, paymentId));
    return "Payment updated successfully 😎";
};

// Delete a payment
export const deletePaymentServices = async (paymentId: number): Promise<string> => {
    await db.delete(paymentTable).where(eq(paymentTable.paymentId, paymentId));
    return "Payment deleted successfully 🎉";
};
