 import { Request, Response } from "express";
import {
  getPaymentsServices,
  getPaymentByIdServices,
  createPaymentServices,
  updatePaymentServices,
  deletePaymentServices,
} from "./payment.service";

// ✅ GET all payments
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

// ✅ GET payment by ID
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

// ✅ CREATE payment
export const createPayment = async (req: Request, res: Response): Promise<void> => {
  const {
    bookingId,
    amount,
    paymentMethod,
    transactionId,
    paymentStatus,//optional
    
  } = req.body;

  if (!bookingId || !amount) {
    res.status(400).json({
      error: "Required fields: bookingId, amount",
    });
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

// ✅ UPDATE payment
export const updatePayment = async (req: Request, res: Response): Promise<void> => {
  const paymentId = parseInt(req.params.id);
  if (isNaN(paymentId)) {
    res.status(400).json({ error: "Invalid payment ID" });
    return;
  }

  const {
    bookingId,
    amount,
    paymentMethod,
    transactionId,
    paymentStatus,
  } = req.body;

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

// ✅ DELETE payment
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
