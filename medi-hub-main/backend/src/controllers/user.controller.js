import asyncHandler from "../utilis/asyncHandler.js";
import asyncHandler from "../utilis/asyncHandler.js";
import { ApiError } from "../utilis/ApiError.js";
import { ApiResponse } from "../utilis/ApiResponse.js";
import { User } from "../models/user.model.js";
import { generateToken } from "../utilis/jwtToken.js";

//! Register the user
export const patientRegister = asyncHandler(async (req, res, next) => {
    // taking the info from the user
    const { firstName, lastName, age, email, phone, address, password, role, specialty, licenseNumber, department, experience, emergencyContact } = req.body;

    // checking the info provided by the user
    if (!firstName || !lastName || !age || !email || !phone || !password || !role) {
        throw new ApiError(400, "Please Fill Required Fields!");
    }

    // Role-specific validation
    if (role === "Doctor") {
        if (!specialty || !licenseNumber || !department || experience === undefined) {
            throw new ApiError(400, "Please fill all doctor-specific fields: specialty, license number, department, and experience!");
        }
    }

    // check if the user already exists
    let existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ApiError(400, `${existedUser.role} with this Email already Registered`);
    }

    // Prepare user data
    const userData = {
        firstName,
        lastName,
        age,
        email,
        phone,
        address,
        password,
        role
    };

    // Add role-specific data
    if (role === "Doctor") {
        userData.specialty = specialty;
        userData.licenseNumber = licenseNumber;
        userData.department = department;
        userData.experience = experience;
    }

    if (emergencyContact) {
        userData.emergencyContact = emergencyContact;
    }

    // finally create the user
    const createdUser = await User.create(userData);
    generateToken(createdUser, "User Registered Successfully!", 200, res);
    // return res.status(201).json(
    //     new ApiResponse(200, createdUser, "User registered Successfully")
    // )
});


//! Getting details for the user(patiend & admin)
export const getUserDetails = asyncHandler(async (req, res, next) => {
    const user = req.user;

    res
        .status(200)
        .json(new ApiResponse(200, user, `${user.role} Details`));
});

//! Getting details for the doctro
export const getDoctorDetails = asyncHandler(async (req, res, next) => {
    const user = req.doctor;

    res
        .status(200)
        .json(new ApiResponse(200, user, `${user.role} Details`));
});