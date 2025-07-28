 
 import { Request, Response } from "express";
import {
  getEventsServices,
  getEventByIdServices,
  createEventServices,
  updateEventServices,
  deleteEventServices,
} from "./event.service";

// Get all events
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const allEvents = await getEventsServices();
    if (!allEvents.length) {
      res.status(404).json({ message: "No events found" });
      return;
    }
    res.status(200).json(allEvents);
  } catch (error: any) {
    console.error("❌ Error fetching events:", error);
    res.status(500).json({ message: error.message || "Failed to fetch events" });
  }
};

// Get single event by ID
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  const eventId = Number(req.params.id);

  if (isNaN(eventId)) {
    res.status(400).json({ message: "Invalid event ID" });
    return;
  }

  try {
    const event = await getEventByIdServices(eventId);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.status(200).json(event);
  } catch (error: any) {
    console.error("❌ Error fetching event by ID:", error);
    res.status(500).json({ message: error.message || "Failed to fetch event" });
  }
};

// Create new event
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  const {
    title,
    description,
    venueId,
    category,
    date,
    time,
    ticketPrice,
    ticketsTotal,
  } = req.body;

  if (!title || !venueId || !ticketPrice || !ticketsTotal) {
    res.status(400).json({
      error: "Required fields: title, venueId, ticketPrice, ticketsTotal",
    });
    return;
  }

  try {
    const newEvent = await createEventServices({
      title,
      description,
      venueId,
      category,
      date,
      time,
      ticketPrice,
      ticketsTotal,
    });
    res.status(201).json(newEvent);
  } catch (error: any) {
    console.error("❌ Error creating event:", error);
    res.status(500).json({ error: error.message || "Failed to create event" });
  }
};

// Update event
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  const eventId = Number(req.params.id);

  if (isNaN(eventId)) {
    res.status(400).json({ error: "Invalid event ID" });
    return;
  }

  try {
    const message = await updateEventServices(eventId, req.body);
    res.status(200).json({ message });
  } catch (error: any) {
    console.error("❌ Error updating event:", error);
    res.status(500).json({ error: error.message || "Failed to update event" });
  }
};

// Delete event
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  const eventId = Number(req.params.id);

  if (isNaN(eventId)) {
    res.status(400).json({ error: "Invalid event ID" });
    return;
  }

  try {
    const exists = await getEventByIdServices(eventId);
    if (!exists) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    const result = await deleteEventServices(eventId);
    res.status(200).json({ message: result });
  } catch (error: any) {
    console.error("❌ Error deleting event:", error);
    res.status(500).json({ error: error.message || "Failed to delete event" });
  }
};


