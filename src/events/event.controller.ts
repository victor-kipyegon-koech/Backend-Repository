 import { Request, Response } from "express";
import {
  getEventsServices,
  getEventByIdServices,
  createEventServices,
  updateEventServices,
  deleteEventServices,
} from "./event.service"

// get all events
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const allEvents = await getEventsServices();
    if (!allEvents || allEvents.length === 0) {
      res.status(404).json({ message: "No events found" });
    } else {
      res.status(200).json(allEvents);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch events" });
  }
};

// get event by ID
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  const eventId = parseInt(req.params.id);
  if (isNaN(eventId)) {
    res.status(400).json({ message: "Invalid event ID" });
    return;
  }

  try {
    const event = await getEventByIdServices(eventId); 
    if (!event) {
      res.status(404).json({ message: "Event not found" });
    } else {
      res.status(200).json(event);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch event" });
  }
};

// create  event
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
    const message = await createEventServices({
      title,
      description,
      venueId,
      category,
      date,
      time,
      ticketPrice,
      ticketsTotal,
    });
    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create event" });
  }
};

// update event
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  const eventId = parseInt(req.params.id);
  if (isNaN(eventId)) {
    res.status(400).json({ error: "Invalid event ID" });
    return;
  }

  const {
    title,
    description,
    venueId,
    category,
    date,
    time,
    ticketPrice,
    ticketsTotal,
    ticketsSold,
  } = req.body;

  try {
    const message = await updateEventServices(eventId, {
      title,
      description,
      venueId,
      category,
      date,
      time,
      ticketPrice,
      ticketsTotal,
      ticketsSold,
    });
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update event" });
  }
};

// delete event
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  const eventId = parseInt(req.params.id);
  if (isNaN(eventId)) {
    res.status(400).json({ error: "Invalid event ID" });
    return;
  }

  try {
    const event = await getEventByIdServices(eventId); 
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    const result = await deleteEventServices(eventId);
    res.status(200).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete event" });
  }
};
