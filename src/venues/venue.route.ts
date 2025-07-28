import { Router } from "express";
import {
  createVenue,
  deleteVenue,
  getVenueById,
  getVenues,
  updateVenue
} from "./venue.controller";
import { adminRoleAuth } from "../middleware/bearAuth";

export const venueRouter = Router();

//  Get all venues
venueRouter.get("/venues", getVenues);

//  Get a specific venue by ID
venueRouter.get("/venues/:id", getVenueById);

//  Create a new venue  
venueRouter.post("/venues", createVenue);

//  Update a venue  
venueRouter.put("/venues/:id",  updateVenue);

//  Delete a venue  
venueRouter.delete("/venues/:id",  deleteVenue);
