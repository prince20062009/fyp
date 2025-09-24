import asyncHandler from "../utilis/asyncHandler.js";
import { ApiResponse } from "../utilis/ApiResponse.js";
import { ApiError } from "../utilis/ApiError.js";
import { Appointment } from "../models/appointment.model.js";
import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js";
import mongoose from "mongoose";

// Book a new appointment
export const bookAppointment = asyncHandler(async (req, res) => {
    const { doctor, appointmentDate, department, city, pincode, notes } = req.body;
    
    // Validate required fields
    if (!doctor || !appointmentDate || !department) {
        throw new ApiError(400, "Doctor, appointment date, and department are required");
    }
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(doctor)) {
        throw new ApiError(400, "Invalid doctor ID format");
    }
    
    // Get patient from authenticated user
    const patient = req.user._id;
    
    // Verify doctor exists in either User or Doctor collection
    let doctorExists = await Doctor.findById(doctor);
    let doctorRef = doctor;
    
    if (!doctorExists) {
        // Check if doctor exists in User collection
        doctorExists = await User.findById(doctor);
        if (!doctorExists || doctorExists.role !== "Doctor") {
            throw new ApiError(400, "Doctor not found");
        }
        // For backward compatibility, we'll use the User collection reference
        doctorRef = doctor;
    }
    
    // Create appointment
    const appointment = await Appointment.create({
        patient,
        doctor: doctorRef,
        appointmentDate: new Date(appointmentDate),
        department,
        city,
        pincode,
        notes
    });
    
    // Populate patient and doctor details
    const createdAppointment = await Appointment.findById(appointment._id)
        .populate("patient", "firstName lastName email")
        .populate({
            path: "doctor",
            select: "firstName lastName email department specialty experience",
            model: doctorExists instanceof Doctor ? Doctor : User
        });
    
    if (!createdAppointment) {
        throw new ApiError(500, "Failed to book appointment");
    }
    
    return res.status(201).json(
        new ApiResponse(201, createdAppointment, "Appointment booked successfully")
    );
});

// Placeholder function for appointment history (disabled)
export const getAllAppointments = asyncHandler(async (req, res) => {
    throw new ApiError(404, "Appointment history feature is disabled for patients");
});

// Get all appointments (admin only)
export const getAllAppointmentsAdmin = asyncHandler(async (req, res) => {
    // Only admins can access all appointments
    if (req.user.role !== "Admin") {
        throw new ApiError(403, "Access denied. Admins only.");
    }
    
    const appointments = await Appointment.find({})
        .populate("patient", "firstName lastName email")
        .populate("doctor", "firstName lastName email department specialty experience")
        .sort({ createdAt: -1 });
    
    return res.status(200).json(
        new ApiResponse(200, appointments, "All appointments fetched successfully")
    );
});

// Update an appointment
export const updateAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { doctor, appointmentDate, department, city, pincode, notes } = req.body;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid appointment ID format");
    }
    
    // Get patient from authenticated user
    const patient = req.user._id;
    
    // Find the appointment by ID and ensure it belongs to the patient
    const appointment = await Appointment.findOne({ _id: id, patient });
    
    if (!appointment) {
        throw new ApiError(404, "Appointment not found or you don't have permission to update it");
    }
    
    // Verify doctor exists if provided
    if (doctor) {
        if (!mongoose.Types.ObjectId.isValid(doctor)) {
            throw new ApiError(400, "Invalid doctor ID format");
        }
        
        let doctorExists = await Doctor.findById(doctor);
        let doctorRef = doctor;
        
        if (!doctorExists) {
            // Check if doctor exists in User collection
            doctorExists = await User.findById(doctor);
            if (!doctorExists || doctorExists.role !== "Doctor") {
                throw new ApiError(400, "Doctor not found");
            }
            doctorRef = doctor;
        }
        
        appointment.doctor = doctorRef;
    }
    
    // Update other fields if provided
    if (appointmentDate) appointment.appointmentDate = new Date(appointmentDate);
    if (department) appointment.department = department;
    if (city !== undefined) appointment.city = city;
    if (pincode !== undefined) appointment.pincode = pincode;
    if (notes !== undefined) appointment.notes = notes;
    
    // Save the updated appointment
    const updatedAppointment = await appointment.save();
    
    // Populate patient and doctor details
    await updatedAppointment.populate([
        { path: "patient", select: "firstName lastName email" },
        { path: "doctor", select: "firstName lastName email department specialty experience" }
    ]);
    
    return res.status(200).json(
        new ApiResponse(200, updatedAppointment, "Appointment updated successfully")
    );
});

// Delete an appointment
export const deleteAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid appointment ID format");
    }
    
    // Get patient from authenticated user
    const patient = req.user._id;
    
    // Find the appointment by ID and ensure it belongs to the patient
    const appointment = await Appointment.findOneAndDelete({ _id: id, patient });
    
    if (!appointment) {
        throw new ApiError(404, "Appointment not found or you don't have permission to delete it");
    }
    
    return res.status(200).json(
        new ApiResponse(200, null, "Appointment deleted successfully")
    );
});