 
// import { desc, eq } from "drizzle-orm";
// import db from "../drizzle/db";
// import {
//   paymentTable,
//   TPaymentInsert,
//   TPaymentSelect,
//   stripeConfigTable,
//   webhookLogTable,
// } from "../drizzle/schema";

// // =========================
// // PAYMENT CRUD OPERATIONS
// // =========================

// export const getPaymentsServices = async (): Promise<TPaymentSelect[] | null> => {
//   return await db.query.paymentTable.findMany({
//     with: { booking: true },
//     orderBy: [desc(paymentTable.paymentId)],
//   });
// };

// export const getPaymentByIdServices = async (
//   paymentId: number
// ): Promise<TPaymentSelect | undefined> => {
//   return await db.query.paymentTable.findFirst({
//     where: eq(paymentTable.paymentId, paymentId),
//   });
// };

// export const createPaymentServices = async (
//   payment: TPaymentInsert
// ): Promise<string> => {
//   await db.insert(paymentTable).values(payment).returning();
//   return "Payment created successfully 🎉";
// };

// export const updatePaymentServices = async (
//   paymentId: number,
//   payment: Partial<TPaymentInsert>
// ): Promise<string> => {
//   await db.update(paymentTable).set(payment).where(eq(paymentTable.paymentId, paymentId));
//   return "Payment updated successfully 😎";
// };

// export const deletePaymentServices = async (
//   paymentId: number
// ): Promise<string> => {
//   await db.delete(paymentTable).where(eq(paymentTable.paymentId, paymentId));
//   return "Payment deleted successfully 🎉";
// };

// // =========================
// // ADMIN PAYMENT STATISTICS
// // =========================

// export const getPaymentStatsService = async () => {
//   const payments = await db.query.paymentTable.findMany();

//   if (!payments) {
//     return {
//       totalTransactions: 0,
//       successfulPayments: 0,
//       failedPayments: 0,
//       totalRevenue: 0,
//       averageTransaction: 0,
//       refunds: 0,
//     };
//   }

//   const totalTransactions = payments.length;

//   const successfulPayments = payments.filter(
//     (p) => p.paymentStatus === "completed"
//   ).length;

//   const failedPayments = payments.filter(
//     (p) => p.paymentStatus === "failed"
//   ).length;

//   const refunds = payments.filter(
//     (p) => p.paymentStatus === "refunded"
//   ).length;

//   const totalRevenue = payments.reduce((acc, p) => {
//     return p.paymentStatus === "completed" ? acc + Number(p.amount) : acc;
//   }, 0);

//   const averageTransaction =
//     successfulPayments > 0 ? totalRevenue / successfulPayments : 0;

//   return {
//     totalTransactions,
//     successfulPayments,
//     failedPayments,
//     totalRevenue,
//     averageTransaction,
//     refunds,
//   };
// };

// // =========================
// // STRIPE CONFIGURATION
// // =========================

// export const getStripeConfigService = async () => {
//   const config = await db.query.stripeConfigTable.findFirst();

//   if (!config) {
//     return {
//       publishableKey: '',
//       secretKey: '',
//       webhookEndpoint: '',
//       currency: 'usd',
//       testMode: false,
//       stripeEnabled: false,
//       paymentMethods: [],
//     };
//   }

//   return config;
// };

// export const updateStripeConfigService = async (
//   data: Partial<typeof stripeConfigTable.$inferInsert>
// ) => {
//   const existing = await db.query.stripeConfigTable.findFirst();
//   if (!existing) {
//     throw new Error("No Stripe config found to update");
//   }

//   await db
//     .update(stripeConfigTable)
//     .set(data)
//     .where(eq(stripeConfigTable.id, existing.id));

//   const updated = await db.query.stripeConfigTable.findFirst();
//   return updated;
// };

// // =========================
// // WEBHOOK LOGS
// // =========================

// export const getWebhookLogsService = async () => {
//   const logs = await db.query.webhookLogTable.findMany({
//     orderBy: [desc(webhookLogTable.receivedAt)],
//     limit: 10,
//   });
//   return logs ?? [];
// };
import { desc, eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
  paymentTable,
  TPaymentInsert,
  TPaymentSelect,
  stripeConfigTable,
  webhookLogTable,
  TStripeConfigSelect,
} from "../drizzle/schema";

// =========================
// PAYMENT CRUD OPERATIONS
// =========================

export const getPaymentsServices = async (): Promise<TPaymentSelect[] | null> => {
  return await db.query.paymentTable.findMany({
    with: { booking: true },
    orderBy: [desc(paymentTable.paymentId)],
  });
};

export const getPaymentByIdServices = async (
  paymentId: number
): Promise<TPaymentSelect | undefined> => {
  return await db.query.paymentTable.findFirst({
    where: eq(paymentTable.paymentId, paymentId),
  });
};

export const createPaymentServices = async (
  payment: TPaymentInsert
): Promise<string> => {
  await db.insert(paymentTable).values(payment).returning();
  return "Payment created successfully 🎉";
};

export const updatePaymentServices = async (
  paymentId: number,
  payment: Partial<TPaymentInsert>
): Promise<string> => {
  await db
    .update(paymentTable)
    .set(payment)
    .where(eq(paymentTable.paymentId, paymentId));
  return "Payment updated successfully 😎";
};

export const deletePaymentServices = async (
  paymentId: number
): Promise<string> => {
  await db.delete(paymentTable).where(eq(paymentTable.paymentId, paymentId));
  return "Payment deleted successfully 🎉";
};

// =========================
// ADMIN PAYMENT STATISTICS
// =========================

export const getPaymentStatsService = async () => {
  const payments = await db.query.paymentTable.findMany();

  if (!payments) {
    return {
      totalTransactions: 0,
      successfulPayments: 0,
      failedPayments: 0,
      totalRevenue: 0,
      averageTransaction: 0,
      refunds: 0,
    };
  }

  const totalTransactions = payments.length;

  const successfulPayments = payments.filter(
    (p) => p.paymentStatus === "completed"
  ).length;

  const failedPayments = payments.filter(
    (p) => p.paymentStatus === "failed"
  ).length;

  const refunds = payments.filter(
    (p) => p.paymentStatus === "refunded"
  ).length;

  const totalRevenue = payments.reduce((acc, p) => {
    return p.paymentStatus === "completed" ? acc + Number(p.amount) : acc;
  }, 0);

  const averageTransaction =
    successfulPayments > 0 ? totalRevenue / successfulPayments : 0;

  return {
    totalTransactions,
    successfulPayments,
    failedPayments,
    totalRevenue,
    averageTransaction,
    refunds,
  };
};

// =========================
// STRIPE CONFIGURATION
// =========================

export const getStripeConfigService = async (): Promise<TStripeConfigSelect> => {
  const config = await db.query.stripeConfigTable.findFirst();

  if (!config) {
    return {
      id: 0,
      publishableKey: "",
      secretKey: "",
      webhookEndpoint: "",
      currency: "usd",
      testMode: false,
      stripeEnabled: false,
      paymentMethods: [],
      updatedAt: new Date(),
    };
  }

  return config;
};

export const updateStripeConfigService = async (
  data: Partial<typeof stripeConfigTable.$inferInsert>
): Promise<TStripeConfigSelect> => {
  const existing = await db.query.stripeConfigTable.findFirst();
  if (!existing) {
    throw new Error("No Stripe config found to update");
  }

  await db
    .update(stripeConfigTable)
    .set(data)
    .where(eq(stripeConfigTable.id, existing.id));

  const updated = await db.query.stripeConfigTable.findFirst();
  if (!updated) {
    throw new Error("Stripe config update failed");
  }

  return updated;
};

// =========================
// WEBHOOK LOGS
// =========================

export const getWebhookLogsService = async () => {
  const logs = await db.query.webhookLogTable.findMany({
    orderBy: [desc(webhookLogTable.receivedAt)],
    limit: 10,
  });

  return logs ?? [];
};

