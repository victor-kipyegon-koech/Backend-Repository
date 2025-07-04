import { Router } from "express";

import {
  createPayment,
  deletePayment,
  getPaymentById,
  getPayments,
  updatePayment,
} from "./payment.controller";

export const paymentRouter = Router();

// ✅ Get all payments
paymentRouter.get("/payments", getPayments);

// ✅ Get a specific payment by ID
paymentRouter.get("/payments/:id", getPaymentById);

// ✅ Create a new payment
paymentRouter.post("/payments", createPayment);

// ✅ Update a payment
paymentRouter.put("/payments/:id", updatePayment);

// ✅ Delete a payment
paymentRouter.delete("/payments/:id", deletePayment);
