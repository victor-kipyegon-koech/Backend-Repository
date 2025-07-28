 
// import { Request, Response } from "express";
// import {
//   getPaymentsServices,
//   getPaymentByIdServices,
//   createPaymentServices,
//   updatePaymentServices,
//   deletePaymentServices,
//   getPaymentStatsService,
//   getStripeConfigService,
//   updateStripeConfigService,
//   getWebhookLogsService,
// } from "./payment.service";

// // ───────────────────────────────────────────────────────────
// // GET /api/payment             - Get all payments
// export const getPayments = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const payments = await getPaymentsServices();
//     if (!payments || payments.length === 0) {
//       res.status(404).json({ message: "No payments found" });
//     } else {
//       res.status(200).json(payments);
//     }
//   } catch (error: any) {
//     res.status(500).json({ message: error.message || "Failed to fetch payments" });
//   }
// };

// // ───────────────────────────────────────────────────────────
// // GET /api/payment/:id         - Get payment by ID
// export const getPaymentById = async (req: Request, res: Response): Promise<void> => {
//   const paymentId = parseInt(req.params.id);
//   if (isNaN(paymentId)) {
//     res.status(400).json({ message: "Invalid payment ID" });
//     return;
//   }

//   try {
//     const payment = await getPaymentByIdServices(paymentId);
//     if (!payment) {
//       res.status(404).json({ message: "Payment not found" });
//     } else {
//       res.status(200).json(payment);
//     }
//   } catch (error: any) {
//     res.status(500).json({ message: error.message || "Failed to fetch payment" });
//   }
// };

// // ───────────────────────────────────────────────────────────
// // POST /api/payment            - Create a new payment
// export const createPayment = async (req: Request, res: Response): Promise<void> => {
//   const { bookingId, amount, paymentMethod, transactionId, paymentStatus } = req.body;

//   if (!bookingId || !amount) {
//     res.status(400).json({ error: "Required fields: bookingId, amount" });
//     return;
//   }

//   try {
//     const message = await createPaymentServices({
//       bookingId,
//       amount,
//       paymentMethod,
//       transactionId,
//       paymentStatus,
//     });
//     res.status(201).json({ message });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message || "Failed to create payment" });
//   }
// };

// // ───────────────────────────────────────────────────────────
// // PUT /api/payment/:id         - Update a payment
// export const updatePayment = async (req: Request, res: Response): Promise<void> => {
//   const paymentId = parseInt(req.params.id);
//   if (isNaN(paymentId)) {
//     res.status(400).json({ error: "Invalid payment ID" });
//     return;
//   }

//   const { bookingId, amount, paymentMethod, transactionId, paymentStatus } = req.body;

//   try {
//     const message = await updatePaymentServices(paymentId, {
//       bookingId,
//       amount,
//       paymentMethod,
//       transactionId,
//       paymentStatus,
//     });
//     res.status(200).json({ message });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message || "Failed to update payment" });
//   }
// };

// // ───────────────────────────────────────────────────────────
// // DELETE /api/payment/:id      - Delete a payment
// export const deletePayment = async (req: Request, res: Response): Promise<void> => {
//   const paymentId = parseInt(req.params.id);
//   if (isNaN(paymentId)) {
//     res.status(400).json({ error: "Invalid payment ID" });
//     return;
//   }

//   try {
//     const payment = await getPaymentByIdServices(paymentId);
//     if (!payment) {
//       res.status(404).json({ message: "Payment not found" });
//       return;
//     }

//     const result = await deletePaymentServices(paymentId);
//     res.status(200).json({ message: result });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message || "Failed to delete payment" });
//   }
// };

// // ───────────────────────────────────────────────────────────
// // GET /api/payment/stats       - Get payment analytics
// export const getPaymentStats = async (req: Request, res: Response) => {
//   try {
//     const stats = await getPaymentStatsService();
//     res.status(200).json(stats);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message || "Failed to fetch payment stats" });
//   }
// };

// // ───────────────────────────────────────────────────────────
// // GET /api/payment/config      - Get Stripe config
// export const getStripeConfig = async (req: Request, res: Response) => {
//   try {
//     const config = await getStripeConfigService();
//     res.status(200).json(config);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message || "Failed to get Stripe config" });
//   }
// };

// // ───────────────────────────────────────────────────────────
// // PUT /api/payment/config      - Update Stripe config
// export const updateStripeConfig = async (req: Request, res: Response) => {
//   try {
//     const updated = await updateStripeConfigService(req.body);
//     res.status(200).json({ message: "Stripe config updated", config: updated });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message || "Failed to update Stripe config" });
//   }
// };

// // ───────────────────────────────────────────────────────────
// // GET /api/payment/webhooks    - Get recent webhook logs
// export const getWebhookLogs = async (req: Request, res: Response) => {
//   try {
//     const logs = await getWebhookLogsService();
//     res.status(200).json(logs);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message || "Failed to get webhook logs" });
//   }
// };
import { Request, Response } from "express";
import {
  getPaymentsServices,
  getPaymentByIdServices,
  createPaymentServices,
  updatePaymentServices,
  deletePaymentServices,
  getPaymentStatsService,
  getStripeConfigService,
  updateStripeConfigService,
  getWebhookLogsService,
} from "./payment.service";

// ───────────────────────────────────────────────────────────
// GET /api/payment             - Get all payments
export const getPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const payments = await getPaymentsServices();
    if (!payments || payments.length === 0) {
      res.status(404).json({ message: "No payments found" });
    } else {
      res.status(200).json(payments);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch payments" });
  }
};

// ───────────────────────────────────────────────────────────
// GET /api/payment/:id         - Get payment by ID
export const getPaymentById = async (req: Request, res: Response): Promise<void> => {
  const paymentId = parseInt(req.params.id);
  if (isNaN(paymentId)) {
    res.status(400).json({ message: "Invalid payment ID" });
    return;
  }

  try {
    const payment = await getPaymentByIdServices(paymentId);
    if (!payment) {
      res.status(404).json({ message: "Payment not found" });
    } else {
      res.status(200).json(payment);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch payment" });
  }
};

// ───────────────────────────────────────────────────────────
// POST /api/payment            - Create a new payment
export const createPayment = async (req: Request, res: Response): Promise<void> => {
  const { bookingId, amount, paymentMethod, transactionId, paymentStatus } = req.body;

  if (!bookingId || !amount) {
    res.status(400).json({ error: "Required fields: bookingId, amount" });
    return;
  }

  try {
    const message = await createPaymentServices({
      bookingId,
      amount,
      paymentMethod,
      transactionId,
      paymentStatus,
    });
    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create payment" });
  }
};

// ───────────────────────────────────────────────────────────
// PUT /api/payment/:id         - Update a payment
export const updatePayment = async (req: Request, res: Response): Promise<void> => {
  const paymentId = parseInt(req.params.id);
  if (isNaN(paymentId)) {
    res.status(400).json({ error: "Invalid payment ID" });
    return;
  }

  const { bookingId, amount, paymentMethod, transactionId, paymentStatus } = req.body;

  try {
    const message = await updatePaymentServices(paymentId, {
      bookingId,
      amount,
      paymentMethod,
      transactionId,
      paymentStatus,
    });
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update payment" });
  }
};

// ───────────────────────────────────────────────────────────
// DELETE /api/payment/:id      - Delete a payment
export const deletePayment = async (req: Request, res: Response): Promise<void> => {
  const paymentId = parseInt(req.params.id);
  if (isNaN(paymentId)) {
    res.status(400).json({ error: "Invalid payment ID" });
    return;
  }

  try {
    const payment = await getPaymentByIdServices(paymentId);
    if (!payment) {
      res.status(404).json({ message: "Payment not found" });
      return;
    }

    const result = await deletePaymentServices(paymentId);
    res.status(200).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete payment" });
  }
};

// ───────────────────────────────────────────────────────────
// GET /api/payment/stats       - Get payment analytics
export const getPaymentStats = async (req: Request, res: Response) => {
  try {
    const stats = await getPaymentStatsService();
    res.status(200).json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch payment stats" });
  }
};

// ───────────────────────────────────────────────────────────
// GET /api/payment/config      - Get Stripe config
export const getStripeConfig = async (req: Request, res: Response) => {
  try {
    const config = await getStripeConfigService();
    res.status(200).json(config);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to get Stripe config" });
  }
};

// ───────────────────────────────────────────────────────────
// PUT /api/payment/config      - Update Stripe config
export const updateStripeConfig = async (req: Request, res: Response) => {
  try {
    const updated = await updateStripeConfigService(req.body);
    res.status(200).json({ message: "Stripe config updated", config: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update Stripe config" });
  }
};

// ───────────────────────────────────────────────────────────
// GET /api/payment/webhooks    - Get recent webhook logs
export const getWebhookLogs = async (req: Request, res: Response) => {
  try {
    const logs = await getWebhookLogsService();
    res.status(200).json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to get webhook logs" });
  }
};

