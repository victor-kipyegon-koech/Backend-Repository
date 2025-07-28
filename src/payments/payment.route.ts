  
import { Router } from "express";
import {
  createPayment,
  deletePayment,
  getPaymentById,
  getPayments,
  updatePayment,
  getPaymentStats,
  getStripeConfig,
  updateStripeConfig,
  getWebhookLogs,
} from "./payment.controller";

export const paymentRouter = Router();

// ========== ADMIN PAYMENT ROUTES ==========
// Important: Declare specific routes first to avoid conflict with "/:id"
paymentRouter.get("/stats", getPaymentStats);           // GET /api/payment/stats
paymentRouter.get("/config", getStripeConfig);          // GET /api/payment/config
paymentRouter.put("/config", updateStripeConfig);       // PUT /api/payment/config
paymentRouter.get("/webhooks", getWebhookLogs);         // GET /api/payment/webhooks

// ========== PAYMENT CRUD ROUTES ==========
paymentRouter.get("/", getPayments);                    // GET /api/payment/
paymentRouter.post("/", createPayment);                 // POST /api/payment/
paymentRouter.get("/:id", getPaymentById);              // GET /api/payment/:id
paymentRouter.put("/:id", updatePayment);               // PUT /api/payment/:id
paymentRouter.delete("/:id", deletePayment);            // DELETE /api/payment/:id
