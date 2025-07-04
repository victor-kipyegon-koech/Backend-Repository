import { Router } from "express";

import { adminRoleAuth, bothRoleAuth } from "../middleware/bearAuth";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "./user.controller";

export const userRouter = Router();




// Get all users
userRouter.get('/users', getUsers);

// Get user by ID
userRouter.get('/users/:id', getUserById);

// Create a new user
userRouter.post('/users', createUser);

// Update an existing user
userRouter.put('/users/:id',updateUser);


// Delete an existing user
userRouter.delete('/users/:id',  deleteUser);