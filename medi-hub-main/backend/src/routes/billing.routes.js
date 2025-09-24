import express from "express";
import { 
    createBill, 
    getPatientBills, 
    getAllBills, 
    getBillById, 
    updateBillPayment,
    deleteBill
} from "../controllers/billing.controller.js";
import { isPatientAuthenticated, isAdminAuthenticated, isDoctorAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create a middleware that checks for any authenticated user
const isAuthenticated = (req, res, next) => {
    if (req.user || req.doctor) {
        return next();
    }
    // If no user is authenticated, check patient authentication
    return isPatientAuthenticated(req, res, next);
};

// Apply authentication middleware based on role
router.use((req, res, next) => {
    // For admin routes
    if (req.path.startsWith('/admin')) {
        return isAdminAuthenticated(req, res, next);
    }
    // For doctor routes
    else if (req.path === '/' && req.method === 'POST') {
        // Check if doctor is authenticated first, then admin
        isDoctorAuthenticated(req, res, (err) => {
            if (!err) return next();
            isAdminAuthenticated(req, res, next);
        });
    }
    // For patient routes
    else {
        isAuthenticated(req, res, next);
    }
});

// Billing routes
router.route("/")
    .post(createBill) // Doctors and admins can create bills
    .get(getPatientBills); // Patients can view their own bills

// Admin route to get all bills
router.route("/admin")
    .get(getAllBills);

// Specific bill routes
router.route("/:id")
    .get(getBillById)
    .put(updateBillPayment) // Patients, doctors, and admins can update payment status
    .delete(deleteBill); // Only admins can delete bills

export default router;