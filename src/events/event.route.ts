import { Router } from "express";
 

import { adminRoleAuth } from "../middleware/bearAuth";
import { createEvent, deleteEvent, getEventById, getEvents, updateEvent } from "./event.controller";

export const eventRouter = Router();

//get  all events
eventRouter.get("/events", getEvents);

// get a specific event by ID
eventRouter.get("/events/:id", getEventById);

// create a new event  
eventRouter.post("/events",  createEvent);

// update an event 
eventRouter.put("/events/:id",  updateEvent);

//delete an event 
eventRouter.delete("/events/:id",  deleteEvent);
