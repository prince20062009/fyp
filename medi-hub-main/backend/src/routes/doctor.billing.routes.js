import express from "express";
import { 
    createBill, 
    getDoctorBills
} from "../controllers/billing.controller.js";
import { isDoctorAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply doctor authentication middleware
router.use(isDoctorAuthenticated);

// Doctor billing routes
router.route("/")
    .post(createBill) // Doctors can create bills
    .get(getDoctorBills); // Doctors can view bills they created

export default router;