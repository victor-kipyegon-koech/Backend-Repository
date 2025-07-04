import express, { Application, Response } from "express";

import { logger } from "./middleware/logger";
 
 
 
import { rateLimiterMiddleware } from "./middleware/rateLimiter";
import cors from "cors"
import { userRouter } from "./users/user.route";
import { authRouter } from "./auth/auth.route";
import { eventRouter } from "./events/event.route";
import { venueRouter } from "./venues/venue.route";
import { bookingRouter } from "./bookings/booking.route";
import { paymentRouter } from "./payments/payment.route";
import { supportRouter } from "./supports/support.route";
 

const app:Application = express()




//Basic MIddleware
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(logger);
app.use(rateLimiterMiddleware)

//default route
app.get('/',(req,res:Response)=>{
    res.send("Welcome to Event Ticketing and Venue Booking api")
})


//import routes
app.use("/api",userRouter) 
app.use('/api',authRouter)
app.use("/api", eventRouter);
app.use('/api',venueRouter)
app.use('/api',bookingRouter)
app.use('/api',paymentRouter)
app.use('/api',supportRouter)


export default app;