import express from "express";
import { bookAppointment, getAllAppointments, updateAppointment, deleteAppointment, getAllAppointmentsAdmin } from "../controllers/appointment.controller.js";
import { isPatientAuthenticated, isAdminAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply patient authentication middleware to patient routes
router.use((req, res, next) => {
    // Skip middleware for admin routes
    if (req.path === '/admin' && req.method === 'GET') {
        return next();
    }
    isPatientAuthenticated(req, res, next);
});

// Appointment routes for patients
router.route("/")
  .post(bookAppointment);
  // Removed GET route to disable appointment history

router.route("/:id")
  .put(updateAppointment)
  .delete(deleteAppointment);

// Admin route to get all appointments
router.route("/admin")
  .get(isAdminAuthenticated, getAllAppointmentsAdmin);

export default router;