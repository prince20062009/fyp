import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./src/utilis/ApiError.js";
import cors from "cors";

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenv configuration
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

console.log("Environment variables loaded:");
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("PORT:", process.env.PORT);

const app = express();

// cors middleware configuration connects frontend to backend
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      process.env.DASHBOARD_URL || "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176"
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
    exposedHeaders: ['Set-Cookie']
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add logging for all requests (after parsing middleware)
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  console.log('Request headers:', req.headers);
  next();
});

// import routes
import userRouter from "./src/routes/user.routes.js";
import contactUsRouter from "./src/routes/contactus.routes.js";
import PaymentRouter from "./src/routes/payment.routes.js";
import TestimonialRouter from "./src/routes/testimonial.routes.js";
import appointmentRouter from "./src/routes/appointment.routes.js";
import billingRouter from "./src/routes/billing.routes.js";
import doctorBillingRouter from "./src/routes/doctor.billing.routes.js";

// Define the root route
// app.get('/', (req, res) => {
//   res.send('Welcome to the homepage!');
// });

// routes registration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/contactus", contactUsRouter);
app.use("/api/v1/payment", PaymentRouter);
app.use("/api/v1/testimonial", TestimonialRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/billing", billingRouter);
app.use("/api/v1/doctor/billing", doctorBillingRouter);

// error middleware
app.use(errorHandler);

// 404 handler - ensure all undefined routes return JSON
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

export default app;