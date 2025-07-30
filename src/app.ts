import express, { Application, Response } from "express";
import cors from "cors";

import { logger } from "./middleware/logger";
import { rateLimiterMiddleware } from "./middleware/rateLimiter";

// Routers
import { userRouter } from "./users/user.route";
import { authRouter } from "./auth/auth.route";
import { eventRouter } from "./events/event.route";
import { venueRouter } from "./venues/venue.route";
import { bookingRouter } from "./bookings/booking.route";
import { paymentRouter } from "./payments/payment.route";
import { supportRouter } from "./supports/support.route";
import reportRouter from "./Reports/reports.routes";
import dashboardRouter from "./dashbaord/dashboardRoute";

const app: Application = express();

// ✅ Allowed frontend origins (no trailing slash!)
const allowedOrigins = [
  // "http://localhost:5173",
  // "https://frontend-repository-ten.vercel.app",
  // "https://frontend-repository-s86b.vercel.app",
  "https://eventticketings.netlify.app"
];

// ✅ Optional: log incoming origin for debugging
app.use((req, _res, next) => {
  console.log("🔍 Incoming request from origin:", req.headers.origin);
  next();
});

// ✅ CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("🔎 CORS origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// 🔧 Core middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(rateLimiterMiddleware);

// ✅ Test route
app.get("/", (_req, res: Response) => {
  res.send("✅ Welcome to Event Ticketing and Venue Booking API");
});

// ✅ Mount routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/events", eventRouter);
app.use("/api/venues", venueRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/supports", supportRouter);
app.use("/api/reports", reportRouter);
app.use("/api/dashboard", dashboardRouter);

export default app;
