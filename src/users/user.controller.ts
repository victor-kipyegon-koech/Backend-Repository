 
import { Request, Response } from "express";
import {
  createUserSchema,
  updateUserSchema
} from "../validation/validation";
import {
  createUserServices,
  deleteUserServices,
  getUserByIdServices,
  getUsersServices,
  updateUserServices
} from "../users/user.service";

// ========== Get All Users ==========
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

// ========== Get User by ID ==========
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

// ========== Create User ==========
export const createUser = async (req: Request, res: Response): Promise<void> => {
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
      });
    } else {
      res.status(500).json({ error: error.message || "Failed to create user" });
    }
  }
};

// ========== Update User ==========
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const validatedData = updateUserSchema.parse(req.body);
    const message = await updateUserServices(userId, validatedData);
    res.status(200).json({ message });
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
      });
    } else {
      res.status(500).json({ error: error.message || "Failed to update user" });
    }
  }
};

// ========== Delete User ==========
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
// import { Request, Response } from "express";
// import {
//   createUserSchema,
//   updateUserSchema
// } from "../validation/validation";
// import {
//   createUserServices,
//   deleteUserServices,
//   getUserByIdServices,
//   getUsersServices,
//   updateUserServices
// } from "../users/user.service";

// // ========== Get All Users ==========
// export const getUsers = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const allUsers = await getUsersServices();
//     if (!allUsers || allUsers.length === 0) {
//       res.status(404).json({ message: "No users found" });
//     } else {
//       const safeUsers = allUsers.map(({ password, ...user }) => user);
//       res.status(200).json(safeUsers);
//     }
//   } catch (error: any) {
//     res.status(500).json({ error: error.message || "Failed to fetch users" });
//   }
// };

// // ========== Get User by ID ==========
// export const getUserById = async (req: Request, res: Response): Promise<void> => {
//   const userId = parseInt(req.params.id);
//   if (isNaN(userId)) {
//     res.status(400).json({ error: "Invalid user ID" });
//     return;
//   }

//   try {
//     const user = await getUserByIdServices(userId);
//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//     } else {
//       const { password, ...safeUser } = user;
//       res.status(200).json(safeUser);
//     }
//   } catch (error: any) {
//     res.status(500).json({ error: error.message || "Failed to fetch user" });
//   }
// };

// // ========== Create User ==========
// export const createUser = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const validatedData = createUserSchema.parse(req.body);
//     const message = await createUserServices(validatedData);
//     res.status(201).json({ message });
//   } catch (error: any) {
//     if (error.name === "ZodError") {
//       res.status(400).json({
//         error: "Validation failed",
//         details: error.errors.map((e: any) => ({
//           path: e.path.join("."),
//           message: e.message,
//         })),
//       });
//     } else {
//       res.status(500).json({ error: error.message || "Failed to create user" });
//     }
//   }
// };

// // ========== Update User ==========
// export const updateUser = async (req: Request, res: Response): Promise<void> => {
//   const userId = parseInt(req.params.id);
//   if (isNaN(userId)) {
//     res.status(400).json({ error: "Invalid user ID" });
//     return;
//   }

//   try {
//     const validatedData = updateUserSchema.parse(req.body);
//     const updatedUser = await updateUserServices(userId, validatedData);

//     if (!updatedUser) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     const { password, ...safeUser } = updatedUser;
//     res.status(200).json(safeUser);
//   } catch (error: any) {
//     if (error.name === "ZodError") {
//       res.status(400).json({
//         error: "Validation failed",
//         details: error.errors.map((e: any) => ({
//           path: e.path.join("."),
//           message: e.message,
//         })),
//       });
//     } else {
//       res.status(500).json({ error: error.message || "Failed to update user" });
//     }
//   }
// };

// // ========== Delete User ==========
// export const deleteUser = async (req: Request, res: Response): Promise<void> => {
//   const userId = parseInt(req.params.id);
//   if (isNaN(userId)) {
//     res.status(400).json({ error: "Invalid user ID" });
//     return;
//   }

//   try {
//     const message = await deleteUserServices(userId);
//     res.status(200).json({ message });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message || "Failed to delete user" });
//   }
// };

