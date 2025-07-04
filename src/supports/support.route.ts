import { Router } from "express";

import {
  createSupport,
  deleteSupport,
  getSupportById,
  getSupports,
  updateSupport,
} from "./support.controller";

export const supportRouter = Router();

// get all support tickets
supportRouter.get("/supports", getSupports);

// get a specific support ticket by ID
supportRouter.get("/supports/:id", getSupportById);

// create a new support ticket
supportRouter.post("/supports", createSupport);

//Update a support ticket
supportRouter.put("/supports/:id", updateSupport);

// delete a support ticket
supportRouter.delete("/supports/:id", deleteSupport);
