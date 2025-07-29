
// import express, { Application, Response } from "express";
// import cors from "cors";

// import { logger } from "./middleware/logger";
// import { rateLimiterMiddleware } from "./middleware/rateLimiter";

// // Routers
// import { userRouter } from "./users/user.route";
// import { authRouter } from "./auth/auth.route";
// import { eventRouter } from "./events/event.route";
// import { venueRouter } from "./venues/venue.route";
// import { bookingRouter } from "./bookings/booking.route";
// import { paymentRouter } from "./payments/payment.route";
// import { supportRouter } from "./supports/support.route";
// import reportRouter from "./Reports/reports.routes";
// import dashboardRouter from "./dashbaord/dashboardRoute";

// const app: Application = express();

// // ✅ Allowed frontends
// const allowedOrigins = [
//   // "http://localhost:5173",
//   // "http://127.0.0.1:5173",
//   // "http://localhost:5000",
  
//   "https://frontend-repository-s86b.vercel.app" ,
// // "  https://frontend-repository-git-main-victor-kipyegons-projects-e912668c.vercel.app"
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost")) {
//         callback(null, true);
//       } else {
//         console.error("❌ Blocked by CORS:", origin);
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(logger);
// app.use(rateLimiterMiddleware);

// // Default route
// app.get('/', (_req, res: Response) => {
//   res.send("Welcome to Event Ticketing and Venue Booking API");
// });

// // Mount routes
// app.use("/api/", userRouter);
// app.use("/api/auth", authRouter);
// app.use("/api/", eventRouter);
// app.use("/api", venueRouter);
// app.use("/api", bookingRouter);
// app.use("/api/payment", paymentRouter);
// app.use("/api", supportRouter);
// app.use("/api/reports", reportRouter);
// app.use("/api", dashboardRouter);

// export default app;

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

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5000",
  "https://frontend-repository-s86b.vercel.app", // ✅ Main deployed frontend
  "https://frontend-repository-git-main-victor-kipyegons-projects-e912668c.vercel.app", // ✅ Preview URL
  "https://front-mherydoz9-victor-kipyegons-projects-e912668c.vercel.app" // ✅ Another preview URL
];

// Enable CORS
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("🔎 CORS origin:", origin);

      // ✅ Allow requests with no origin (e.g. Postman) or from allowed list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      }

      // Optional: Allow all Vercel preview domains
      // else if (origin.endsWith(".vercel.app")) {
      //   callback(null, true);
      // }

      else {
        console.error("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(rateLimiterMiddleware);

// Default route
app.get("/", (_req, res: Response) => {
  res.send("✅ Welcome to Event Ticketing and Venue Booking API");
});

// Mount routes
app.use("/api/", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/", eventRouter);
app.use("/api", venueRouter);
app.use("/api", bookingRouter);
app.use("/api/payment", paymentRouter);
app.use("/api", supportRouter);
app.use("/api/reports", reportRouter);
app.use("/api", dashboardRouter);

export default app;
