import { Request, Response } from "express";
import {
  getSupportsServices,
  getSupportByIdServices,
  createSupportServices,
  updateSupportServices,
  deleteSupportServices,
} from "./support.service";

// get all support tickets
export const getSupports = async (req: Request, res: Response): Promise<void> => {
  try {
    const supports = await getSupportsServices();
    if (!supports || supports.length === 0) {
      res.status(404).json({ message: "No support tickets found" });
    } else {
      res.status(200).json(supports);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch support tickets" });
  }
};

//get support ticket by ID
export const getSupportById = async (req: Request, res: Response): Promise<void> => {
  const ticketId = parseInt(req.params.id);
  if (isNaN(ticketId)) {
    res.status(400).json({ message: "Invalid ticket ID" });
    return;
  }

  try {
    const support = await getSupportByIdServices(ticketId);
    if (!support) {
      res.status(404).json({ message: "Support ticket not found" });
    } else {
      res.status(200).json(support);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch support ticket" });
  }
};

// create support ticket
export const createSupport = async (req: Request, res: Response): Promise<void> => {
  const { userId, subject, message, status } = req.body;

  if (!userId || !subject || !message) {
    res.status(400).json({
      error: "Required fields: userId, subject, message",
    });
    return;
  }

  try {
    const result = await createSupportServices({
      userId,
      subject,
      message,
      status, 
    });
    res.status(201).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create support ticket" });
  }
};

// update support ticket
export const updateSupport = async (req: Request, res: Response): Promise<void> => {
  const ticketId = parseInt(req.params.id);
  if (isNaN(ticketId)) {
    res.status(400).json({ error: "Invalid ticket ID" });
    return;
  }

  const { subject, message, status } = req.body;

  // Nothing to update
  if (!subject && !message && !status) {
    res.status(400).json({ error: "At least one field (subject, message, status) is required to update" });
    return;
  }

  try {
    const result = await updateSupportServices(ticketId, { subject, message, status });
    res.status(200).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update support ticket" });
  }
};

// delete support ticket
export const deleteSupport = async (req: Request, res: Response): Promise<void> => {
  const ticketId = parseInt(req.params.id);
  if (isNaN(ticketId)) {
    res.status(400).json({ error: "Invalid ticket ID" });
    return;
  }

  try {
    const support = await getSupportByIdServices(ticketId);
    if (!support) {
      res.status(404).json({ message: "Support ticket not found" });
      return;
    }

    const result = await deleteSupportServices(ticketId);
    res.status(200).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete support ticket" });
  }
};
