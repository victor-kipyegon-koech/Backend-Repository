import { Request, Response } from "express";
import {  createVenueSchema } from "../validation/validation";
import {
  getVenuesServices,
  getVenueByIdServices,
  createVenueServices,
  updateVenueServices,
  deleteVenueServices,
} from "./venue.service";

// ✅ GET all venues
export const getVenues = async (req: Request, res: Response): Promise<void> => {
  try {
    const venues = await getVenuesServices();
    if (!venues || venues.length === 0) {
      res.status(404).json({ message: "No venues found" });
    } else {
      res.status(200).json(venues);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch venues" });
  }
};

// ✅ GET venue by ID
export const getVenueById = async (req: Request, res: Response): Promise<void> => {
  const venueId = parseInt(req.params.id);
  if (isNaN(venueId)) {
    res.status(400).json({ message: "Invalid venue ID" });
    return;
  }

  try {
    const venue = await getVenueByIdServices(venueId);
    if (!venue) {
      res.status(404).json({ message: "Venue not found" });
    } else {
      res.status(200).json(venue);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch venue" });
  }
};

// ✅ CREATE venue
export const createVenue = async (req: Request, res: Response): Promise<void> => {
  // const { name, address, capacity } = req.body;

  // if (!name || !capacity) {
  //   res.status(400).json({ error: "Required fields: name and capacity" });
  //   return;
  // }

  // try {
  //   const message = await createVenueServices({ name, address, capacity });
  //   res.status(201).json({ message });
  // } catch (error: any) {
  //   res.status(500).json({ error: error.message || "Failed to create venue" });
  // }
    const result =createVenueSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten() });
    return;
  }

  try {
    const message = await createVenueServices(result.data);
    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create venue" });
  }
};

//update venue
export const updateVenue = async (req: Request, res: Response): Promise<void> => {
  const venueId = parseInt(req.params.id);
  if (isNaN(venueId)) {
    res.status(400).json({ error: "Invalid venue ID" });
    return;
  }

  // const { name, address, capacity } = req.body;

  // try {
  //   const message = await updateVenueServices(venueId, { name, address, capacity });
  //   res.status(200).json({ message });
  // } catch (error: any) {
  //   res.status(500).json({ error: error.message || "Failed to update venue" });
  // }
    const result = createVenueSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten() });
    return;
  }

  try {
    const message = await updateVenueServices(venueId, result.data);
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update venue" });
  }
};

// ✅ DELETE venue
export const deleteVenue = async (req: Request, res: Response): Promise<void> => {
  const venueId = parseInt(req.params.id);
  if (isNaN(venueId)) {
    res.status(400).json({ error: "Invalid venue ID" });
    return;
  }

  try {
    const venue = await getVenueByIdServices(venueId);
    if (!venue) {
      res.status(404).json({ message: "Venue not found" });
      return;
    }

    const message = await deleteVenueServices(venueId);
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete venue" });
  }
};
