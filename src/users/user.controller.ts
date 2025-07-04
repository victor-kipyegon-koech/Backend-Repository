 
import { Request, Response } from "express";
import { createUserSchema } from "../validation/validation"; 

import {createUserServices,deleteUserServices,getUserByIdServices,getUsersServices,updateUserServices} from "../users/user.service";

// get all users 
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const allUsers = await getUsersServices();
    if (!allUsers || allUsers.length === 0) {
      res.status(404).json({ message: "No users found" });
    } else {
      const safeUsers = allUsers.map(({ password, ...user }) => user); 
      res.status(200).json(safeUsers);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch users" });
  }
};

//get  user by ID 
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const user = await getUserByIdServices(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      const { password, ...safeUser } = user; 
      res.status(200).json(safeUser);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch user" });
  }
};

//  create  user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  // const { firstName, lastName, email, password, contactPhone, address, userType } = req.body;

  // if (!firstName || !lastName || !email || !password) {
  //   res.status(400).json({ error: "firstName, lastName, email, and password are required" });
  //   return;
  // }

  // try {
  //   const message = await createUserServices({
  //     firstName,
  //     lastName,
  //     email,
  //     password,
  //     contactPhone,
  //     address,
  //     userType,
  //   });
  //   res.status(201).json({ message });
  // } catch (error: any) {
  //   res.status(500).json({ error: error.message || "Failed to create user" });
  // }
    try {
    const validatedData = createUserSchema.parse(req.body);
    const message = await createUserServices(validatedData);
    res.status(201).json({ message });
  } catch (error: any) {
    if (error.name === "ZodError") {
      interface ZodValidationError {
        path: (string | number)[];
        message: string;
      }

      res.status(400).json({
        error: "Validation failed",
        details: (error.errors as ZodValidationError[]).map((e: ZodValidationError) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });   } else {
      res.status(500).json({ error: error.message || "Failed to create user" });
    }
  }
};

// update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  // const { firstName, lastName, email, password, contactPhone, address, userType } = req.body;

  // if (!firstName || !lastName || !email || !password) {
  //   res.status(400).json({ error: "firstName, lastName, email, and password are required" });
  //   return;
  // }

  // try {
  //   const message = await updateUserServices(userId, {
  //     firstName,
  //     lastName,
  //     email,
  //     password,
  //     contactPhone,
  //     address,
  //     userType,
  //   });
  //   res.status(200).json({ message });
  // } catch (error: any) {
  //   res.status(500).json({ error: error.message || "Failed to update user" });
  // }
  try {
    const validatedData =createUserSchema.parse(req.body);
    const message = await updateUserServices(userId, validatedData);
    res.status(200).json({ message });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({
        error: "Validation failed",
        details: (error.errors as ZodValidationError[]).map((e: ZodValidationError) => ({
          path: e.path.join("."),
          message: e.message,
        })),
            });

      interface ZodValidationError {
        path: (string | number)[];
        message: string;
      }   } else {
      res.status(500).json({ error: error.message || "Failed to update user" });
    }
  }
};

// delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const message = await deleteUserServices(userId);
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete user" });
  }
};
