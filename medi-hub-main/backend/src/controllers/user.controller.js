import asyncHandler from "../utilis/asyncHandler.js";
import { ApiError } from "../utilis/ApiError.js";
import { ApiResponse } from "../utilis/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js";
import { generateToken } from "../utilis/jwtToken.js";

//! Register the user
export const patientRegister = asyncHandler(async (req, res, next) => {
    // taking the info from the user
    const { firstName, lastName, age, email, phone, address, password, role, specialty, licenseNumber, department, experience, emergencyContact, dob, gender } = req.body;

    // checking the info provided by the user
    if (!firstName || !lastName || !age || !email || !phone || !password || !role) {
        throw new ApiError(400, "Please Fill Required Fields!");
    }

    // Role-specific validation
    if (role === "Doctor") {
        if (!specialty || !licenseNumber || !department || experience === undefined || !dob || !gender) {
            throw new ApiError(400, "Please fill all doctor-specific fields: specialty, license number, department, experience, date of birth, and gender!");
        }
    }

    // check if the user already exists
    let existedUser;
    if (role === "Doctor") {
        existedUser = await Doctor.findOne({ email });
    } else {
        existedUser = await User.findOne({ email });
    }
    
    if (existedUser) {
        throw new ApiError(400, `${existedUser.role} with this Email already Registered`);
    }

    // Create user based on role
    let createdUser;
    if (role === "Doctor") {
        // Create doctor in Doctor collection
        const doctorData = {
            firstName,
            lastName,
            email,
            phone,
            dob: new Date(dob),
            gender,
            password,
            role,
            department,
            specializations: [specialty],
            experience: parseInt(experience),
            avatar: {
                public_id: null,
                url: "https://img.freepik.com/premium-vector/doctor-profile-with-medical-service-icons_24877-41470.jpg"
            }
        };
        
        createdUser = await Doctor.create(doctorData);
    } else {
        // Create patient or admin in User collection
        const userData = {
            firstName,
            lastName,
            age: parseInt(age),
            email,
            phone,
            address,
            password,
            role
        };

        // Add emergency contact if provided (only for patients)
        if (emergencyContact && role === "Patient") {
            userData.emergencyContact = emergencyContact;
        }

        createdUser = await User.create(userData);
    }
    
    generateToken(createdUser, "User Registered Successfully!", 200, res);
});


//! Getting details for the user(patient & admin)
export const getUserDetails = asyncHandler(async (req, res, next) => {
    const user = req.user;

    res
        .status(200)
        .json(new ApiResponse(200, user, `${user.role} Details`));
});

//! Getting details for the doctor
export const getDoctorDetails = asyncHandler(async (req, res, next) => {
    const user = req.doctor;

    res
        .status(200)
        .json(new ApiResponse(200, user, `${user.role} Details`));
});

//! Get all patients (admin only)
export const getAllPatients = asyncHandler(async (req, res, next) => {
    // Only admins can access all patients
    if (req.user.role !== "Admin") {
        throw new ApiError(403, "Access denied. Admins only.");
    }
    
    const patients = await User.find({ role: "Patient" }).select("-password");
    
    res.status(200).json(
        new ApiResponse(200, patients, "Patients fetched successfully")
    );
});

//! Update user profile (patient/admin)
export const updateUserProfile = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, age, phone, address, emergencyContact } = req.body;
    const user = req.user;

    // Validate required fields
    if (!firstName || !lastName || !age || !phone) {
        throw new ApiError(400, "Please provide all required fields: firstName, lastName, age, phone");
    }

    // Update user fields
    user.firstName = firstName;
    user.lastName = lastName;
    user.age = age;
    user.phone = phone;
    if (address) user.address = address;
    if (emergencyContact && user.role === "Patient") user.emergencyContact = emergencyContact;

    // Save updated user
    const updatedUser = await user.save();

    res.status(200).json(
        new ApiResponse(200, updatedUser, "Profile updated successfully")
    );
});
