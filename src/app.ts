 
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
// import dashboardRouter from "./dashbaord/dashboardRoute"; // ✅ added this line

// const app: Application = express();

// // Basic Middleware
// app.use(cors({
//   origin: 'http://localhost:5173',
  

//   credentials: true,
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(logger);
// app.use(rateLimiterMiddleware);

// // Default Route
// app.get('/', (_req, res: Response) => {
//   res.send("Welcome to Event Ticketing and Venue Booking API");
// });

// // Route Mounting
// app.use("/api/", userRouter);
// app.use("/api/auth", authRouter);
// app.use("/api/", eventRouter);
// app.use("/api", venueRouter);
// app.use("/api", bookingRouter);
// app.use("/api/payment", paymentRouter);
// app.use("/api", supportRouter);
// app.use("/api/reports", reportRouter);
// app.use("/api", dashboardRouter); // ✅ makes /api/dashboard-stats available

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

// ✅ Allow multiple origins (local + Vercel)
const allowedOrigins = [
  'http://localhost:5173',
  'https://front-72mn3nuqz-victor-kipyegons-projects-e912668c.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(rateLimiterMiddleware);

// Default route
app.get('/', (_req, res: Response) => {
  res.send("Welcome to Event Ticketing and Venue Booking API");
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
