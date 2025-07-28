 
// import { Request, Response } from "express";
// import {
//   getSupportsServices,
//   getSupportByIdServices,
//   createSupportServices,
//   updateSupportServices,
//   deleteSupportServices,
// } from "./support.service";

// // Get all support tickets
// export const getSupports = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const supports = await getSupportsServices();

//     if (!supports || supports.length === 0) {
//       res.status(404).json({ message: "No support tickets found" });
//     } else {
//       res.status(200).json(supports);
//     }
//   } catch (error: any) {
//     console.error("Error fetching support tickets:", error);
//     res.status(500).json({ message: error.message || "Failed to fetch support tickets" });
//   }
// };

// // Get support ticket by ID
// export const getSupportById = async (req: Request, res: Response): Promise<void> => {
//   const ticketId = parseInt(req.params.id);

//   if (isNaN(ticketId)) {
//     res.status(400).json({ message: "Invalid ticket ID" });
//     return;
//   }

//   try {
//     const support = await getSupportByIdServices(ticketId);

//     if (!support) {
//       res.status(404).json({ message: "Support ticket not found" });
//     } else {
//       res.status(200).json(support);
//     }
//   } catch (error: any) {
//     console.error("Error fetching support ticket:", error);
//     res.status(500).json({ message: error.message || "Failed to fetch support ticket" });
//   }
// };

// // Create support ticket
// export const createSupport = async (req: Request, res: Response): Promise<void> => {
//   const { userId, subject, message, status } = req.body;

//   console.log("Creating support ticket with:", req.body);

//   if (!userId || !subject || !message) {
//     res.status(400).json({
//       error: "Missing required fields: userId, subject, and message",
//     });
//     return;
//   }

//   try {
//     const result = await createSupportServices({
//       userId,
//       subject,
//       message,
//       status: status || "open", // default to 'open' if not provided
//     });

//     res.status(201).json({ message: result });
//   } catch (error: any) {
//     console.error("Error creating support ticket:", error);
//     res.status(500).json({ error: error.message || "Failed to create support ticket" });
//   }
// };

// // Update support ticket
// export const updateSupport = async (req: Request, res: Response): Promise<void> => {
//   const ticketId = parseInt(req.params.id);
//   const { subject, message, status } = req.body;

//   if (isNaN(ticketId)) {
//     res.status(400).json({ error: "Invalid ticket ID" });
//     return;
//   }

//   if (!subject && !message && !status) {
//     res.status(400).json({
//       error: "At least one of subject, message, or status must be provided for update",
//     });
//     return;
//   }

//   try {
//     const result = await updateSupportServices(ticketId, { subject, message, status });
//     res.status(200).json({ message: result });
//   } catch (error: any) {
//     console.error("Error updating support ticket:", error);
//     res.status(500).json({ error: error.message || "Failed to update support ticket" });
//   }
// };

// // Delete support ticket
// export const deleteSupport = async (req: Request, res: Response): Promise<void> => {
//   const ticketId = parseInt(req.params.id);

//   if (isNaN(ticketId)) {
//     res.status(400).json({ error: "Invalid ticket ID" });
//     return;
//   }

//   try {
//     const support = await getSupportByIdServices(ticketId);

//     if (!support) {
//       res.status(404).json({ message: "Support ticket not found" });
//       return;
//     }

//     const result = await deleteSupportServices(ticketId);
//     res.status(200).json({ message: result });
//   } catch (error: any) {
//     console.error("Error deleting support ticket:", error);
//     res.status(500).json({ error: error.message || "Failed to delete support ticket" });
//   }
// };
 import { Request, Response } from "express";
import {
  getSupportsServices,
  getSupportByIdServices,
  createSupportServices,
  updateSupportServices,
  deleteSupportServices,
} from "./support.service";

// Enum validation helpers (must match database ENUMs exactly)
const allowedStatuses = ["pending", "in_progress", "resolved", "closed"];
const allowedPriorities = ["low", "medium", "high"];

// Get all support tickets
export const getSupports = async (req: Request, res: Response): Promise<void> => {
  try {
    const supports = await getSupportsServices();

    if (!supports || supports.length === 0) {
      res.status(404).json({ message: "No support tickets found" });
    } else {
      res.status(200).json(supports);
    }
  } catch (error: any) {
    console.error("Error fetching support tickets:", error);
    res.status(500).json({ message: error.message || "Failed to fetch support tickets" });
  }
};

// Get support ticket by ID
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
    console.error("Error fetching support ticket:", error);
    res.status(500).json({ message: error.message || "Failed to fetch support ticket" });
  }
};

// Create support ticket
export const createSupport = async (req: Request, res: Response): Promise<void> => {
  const { userId, subject, message, status = "pending", priority = "medium" } = req.body;

  if (!userId || !subject || !message) {
    res.status(400).json({ error: "Missing required fields: userId, subject, and message" });
    return;
  }

  const cleanStatus = status.trim();
  const cleanPriority = priority.trim();

  if (!allowedStatuses.includes(cleanStatus)) {
    res.status(400).json({ error: `Invalid status: ${cleanStatus}` });
    return;
  }

  if (!allowedPriorities.includes(cleanPriority)) {
    res.status(400).json({ error: `Invalid priority: ${cleanPriority}` });
    return;
  }

  try {
    const result = await createSupportServices({
      userId,
      subject: subject.trim(),
      message: message.trim(),
      status: cleanStatus as any,
      priority: cleanPriority as any,
    });

    res.status(201).json({ message: result });
  } catch (error: any) {
    console.error("Error creating support ticket:", error);
    res.status(500).json({ error: error.message || "Failed to create support ticket" });
  }
};

// Update support ticket
export const updateSupport = async (req: Request, res: Response): Promise<void> => {
  const ticketId = parseInt(req.params.id);
  const { subject, message, status, priority } = req.body;

  if (isNaN(ticketId)) {
    res.status(400).json({ error: "Invalid ticket ID" });
    return;
  }

  const updates: any = {};
  if (subject) updates.subject = subject.trim();
  if (message) updates.message = message.trim();
  if (status) {
    const cleanStatus = status.trim();
    if (!allowedStatuses.includes(cleanStatus)) {
      res.status(400).json({ error: `Invalid status: ${cleanStatus}` });
      return;
    }
    updates.status = cleanStatus;
  }
  if (priority) {
    const cleanPriority = priority.trim();
    if (!allowedPriorities.includes(cleanPriority)) {
      res.status(400).json({ error: `Invalid priority: ${cleanPriority}` });
      return;
    }
    updates.priority = cleanPriority;
  }

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "At least one field must be provided for update" });
    return;
  }

  try {
    const result = await updateSupportServices(ticketId, updates);
    res.status(200).json({ message: result });
  } catch (error: any) {
    console.error("Error updating support ticket:", error);
    res.status(500).json({ error: error.message || "Failed to update support ticket" });
  }
};

// Delete support ticket
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
    console.error("Error deleting support ticket:", error);
    res.status(500).json({ error: error.message || "Failed to delete support ticket" });
  }
};
