  
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUserServices, getUserByEmailService } from "./auth.service";

// REGISTER CONTROLLER
export const createUser = async (req: Request, res: Response) => {
  const user = req.body;

  try {
    if (!user.firstName || !user.lastName || !user.email || !user.password) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const existingUser = await getUserByEmailService(user.email);
    if (existingUser) {
      res.status(409).json({ message: "Email already taken 😒" });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(user.password, salt);
    user.password = hashedPassword;

    const newUser = await createUserServices(user);

    const { password, ...userWithoutPassword } = newUser as {
      password: string;
      [key: string]: any;
    };

    // Optionally send email
    // await sendNotificationEmail(user.email, `${user.firstName} ${user.lastName}`, "Account Created", "Welcome to our platform!");

    res.status(201).json({ user: userWithoutPassword });
    return;

  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create user" });
    return;
  }
};

// LOGIN CONTROLLER
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await getUserByEmailService(email);
    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = bcrypt.compareSync(password, existingUser.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const payload = {
      userId: existingUser.userId,
      email: existingUser.email,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      userType: existingUser.userType,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign(payload, secret);

    res.status(200).json({
      token,
      user: {
        userId: existingUser.userId,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        userType: existingUser.userType,
      },
    });
    return;

  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to login" });
    return;
  }
};
