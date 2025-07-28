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
// import { Router } from "express";
// import {
//   createEvent,
//   deleteEvent,
//   getEventById,
//   getEvents,
//   updateEvent,
// } from "./event.controller";

// import { adminRoleAuth } from "../middleware/bearAuth"; // Only if using admin auth

// export const eventRouter = Router();

// // GET all events (public)
// eventRouter.get("/events", getEvents);

// // GET event by ID (public)
// eventRouter.get("/events/:id", getEventById);

// // CREATE new event (admin-only)
// eventRouter.post("/events", adminRoleAuth, createEvent);

// // UPDATE existing event (admin-only)
// eventRouter.put("/events/:id", adminRoleAuth, updateEvent);

// // DELETE event (admin-only)
// eventRouter.delete("/events/:id", adminRoleAuth, deleteEvent);
