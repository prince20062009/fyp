import asyncHandler from "../utilis/asyncHandler.js";
import { ApiError } from "../utilis/ApiError.js";
import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js"
import { generateToken } from "../utilis/jwtToken.js";
import axios from "axios";


//! Simple Login (without reCAPTCHA and confirm password)
export const simpleLogin = asyncHandler(async (req, res, next) => {
    const { email, password, role = "Patient" } = req.body;
    
    console.log("Login attempt:", { email, role });
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);

    if (!email || !password) {
        console.log("Missing email or password");
        throw new ApiError(400, "Please provide email and password!");
    }

    // Find user based on role
    let user;
    if (role === "Patient" || role === "Admin") {
        user = await User.findOne({ email }).select("+password");
    } else if (role === "Doctor") {
        user = await Doctor.findOne({ email }).select("+password");
    } else {
        throw new ApiError(400, "Invalid role");
    }

    // Check if user exists
    if (!user) {
        console.log("User not found for email:", email);
        throw new ApiError(400, "Invalid email or password");
    }

    console.log("User found:", { id: user._id, email: user.email, role: user.role });

    // Check if password matches
    const isPasswordMatched = await user.comparePassword(password);
    console.log("Password match result:", isPasswordMatched);
    
    if (!isPasswordMatched) {
        console.log("Password does not match for user:", email);
        throw new ApiError(400, "Invalid email or password");
    }

    console.log("Login successful for user:", email);
    generateToken(user, "User Logged In Successfully", 200, res);
});

//! Login the user (with reCAPTCHA)
export const login = asyncHandler(async (req, res, next) => {
    // taking the info from the user
    const { email, password, confirmPassword, role, token } = req.body;

    // checking the info provided by the user
    if (!email || !password || !confirmPassword || !role) {
        throw new ApiError(400, "Please Fill Full Form!");
    }
    // check if password and confirm password matches
    if (password !== confirmPassword) {
        throw new ApiError(400, "Password and Confirm Password do not match!");
    }

    // Verify the reCAPTCHA token
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
        params: {
            secret: '6LdzteopAAAAAHwBYUTrGjupn-LuF8ox6Uc7n1Uy',
            response: token
        }
    });
    
    if (!response.data.success) {
        throw new ApiError(400, "reCAPTCHA verification failed");
    }

    // ! checking the user provide correct details for login
    // find the user in database via email 
    let user;
    if (role === "Patient" || role === "Admin") {
        // Find user in user collection
        user = await User.findOne({ email }).select("+password");
    } else if (role === "Doctor") {
        // Find doctor in doctor collection
        user = await Doctor.findOne({ email }).select("+password");
    } else {
        throw new ApiError(400, "Invalid email or password");
    }

    // Check if user or doctor exists
    if (!user) {
        throw new ApiError(400, `User with ${role} role not found`);

    }

    // Check if password matches
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        throw new ApiError(400, "Invalid email or password");
    }

    generateToken(user, "User Logged In Successfully", 200, res)
})


//! Logout Admin
export const logoutAdmin = asyncHandler(async (req, res, next) => {
    res
        .status(200)
        .cookie("adminToken", "", {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "None"
        })
        .json({
            success: true,
            message: "Admin logged out Successfully"
        });
})


//! Logout Patient
export const logoutPatient = asyncHandler(async (req, res, next) => {
    res
        .status(200)
        .cookie("patientToken", "", {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "None"
        })
        .json({
            success: true,
            message: "User logged out Successfully"
        });
})


//! Logout Doctor
export const logoutDoctor = asyncHandler(async (req, res, next) => {
    res
        .status(200)
        .cookie("doctorToken", "", {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "None"
        })
        .json({
            success: true,
            message: "User logged out Successfully"
        });
})