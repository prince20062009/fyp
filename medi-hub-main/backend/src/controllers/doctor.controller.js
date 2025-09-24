import asyncHandler from "../utilis/asyncHandler.js";
import { ApiError } from "../utilis/ApiError.js";
import { ApiResponse } from "../utilis/ApiResponse.js";
import { Doctor } from "../models/doctor.model.js";
import { generateToken } from "../utilis/jwtToken.js";

//! Add new doctor
export const addNewDoctor = asyncHandler(async (req, res, next) => {
    const { 
        firstName, 
        lastName, 
        email, 
        phone, 
        dob, 
        gender, 
        password,
        department,
        specializations,
        experience 
    } = req.body;

    // Check if required fields are provided
    if (!firstName || !lastName || !email || !phone || !dob || !gender || !password || !department) {
        throw new ApiError(400, "Please Fill Full Form!");
    }

    // Check if doctor already exists
    const existedDoctor = await Doctor.findOne({ email });
    if (existedDoctor) {
        throw new ApiError(400, "Doctor with this Email already exists");
    }

    // Create new doctor
    const doctor = await Doctor.create({
        firstName,
        lastName,
        email,
        phone,
        dob,
        gender,
        password,
        role: "Doctor",
        department,
        specializations: specializations || [],
        experience: experience || 0
    });

    res.status(201).json(
        new ApiResponse(201, doctor, "Doctor added successfully")
    );
});

//! Get all doctors
export const getAllDoctors = asyncHandler(async (req, res, next) => {
    const doctors = await Doctor.find({ role: "Doctor" }).select("-password");
    
    // Convert ObjectId to string to avoid BSON serialization issues
    const doctorsData = doctors.map(doctor => {
        const doctorObj = doctor.toObject();
        doctorObj._id = doctorObj._id.toString();
        return doctorObj;
    });
    
    res.status(200).json(
        new ApiResponse(200, doctorsData, "Doctors fetched successfully")
    );
});

//! Get doctor details
export const getDoctorDetails = asyncHandler(async (req, res, next) => {
    const doctor = req.doctor;

    res.status(200).json(
        new ApiResponse(200, doctor, "Doctor details fetched successfully")
    );
});

//! Update doctor profile
export const updateDoctorProfile = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, phone, department, specializations, experience } = req.body;
    const doctor = req.doctor;

    // Validate required fields
    if (!firstName || !lastName || !phone || !department) {
        throw new ApiError(400, "Please provide all required fields: firstName, lastName, phone, department");
    }

    // Update doctor fields
    doctor.firstName = firstName;
    doctor.lastName = lastName;
    doctor.phone = phone;
    doctor.department = department;
    if (specializations) doctor.specializations = specializations;
    if (experience !== undefined) doctor.experience = experience;

    // Save updated doctor
    const updatedDoctor = await doctor.save();

    res.status(200).json(
        new ApiResponse(200, updatedDoctor, "Profile updated successfully")
    );
});
