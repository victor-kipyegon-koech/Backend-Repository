//  import express, { Application, Response } from "express";
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

// // ✅ Define allowed frontend origins
// const allowedOrigins = [
//   "http://localhost:5173",
  
//  " https://frontend-repository-ten.vercel.app/"
// ];

// // ✅ CORS middleware
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       console.log("🔎 CORS origin:", origin);

//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         console.error("❌ Blocked by CORS:", origin);
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

// // ✅ Basic middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(logger);
// app.use(rateLimiterMiddleware);

// // ✅ Default test route
// app.get("/", (_req, res: Response) => {
//   res.send("✅ Welcome to Event Ticketing and Venue Booking API");
// });

// // ✅ Correctly mounted base paths (no specific subroutes!)
// app.use("/api/users", userRouter);
// app.use("/api/auth", authRouter);
// app.use("/api/events", eventRouter);
// app.use("/api/venues", venueRouter);
// app.use("/api/bookings", bookingRouter);
// app.use("/api/payment", paymentRouter);
// app.use("/api/supports", supportRouter);
// app.use("/api/reports", reportRouter);
// app.use("/api/dashboard", dashboardRouter);

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

// ✅ Fixed allowed origins (no space or trailing slash)
const allowedOrigins = [
  "http://localhost:5173",
  "https://frontend-repository-ten.vercel.app"
];

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

// ✅ Basic middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(rateLimiterMiddleware);

// ✅ Default route
app.get("/", (_req, res: Response) => {
  res.send("✅ Welcome to Event Ticketing and Venue Booking API");
});

// ✅ Mount routes with correct base paths
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
