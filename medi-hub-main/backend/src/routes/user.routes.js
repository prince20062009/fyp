import express from "express";
import { patientRegister, getUserDetails, getDoctorDetails, getAllPatients, updateUserProfile } from "../controllers/user.controller.js";
import { login, simpleLogin, logoutAdmin, logoutDoctor, logoutPatient } from "../controllers/login_logout.controller.js";
import { addNewAdmin } from "../controllers/admin.controller.js";
import { addNewDoctor, getAllDoctors, updateDoctorProfile } from "../controllers/doctor.controller.js";
import { isAdminAuthenticated, isPatientAuthenticated, isDoctorAuthenticated } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import asyncHandler from "../utilis/asyncHandler.js";
import { ApiResponse } from "../utilis/ApiResponse.js";

// Temporary password reset function
const resetPassword = asyncHandler(async (req, res) => {
    const { email, newPassword } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashedPassword });
    
    res.status(200).json(new ApiResponse(200, null, "Password reset successfully"));
});


const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/simple-login", simpleLogin);
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);
router.post("/doctor/addnew", isAdminAuthenticated, upload.single("docAvatar"), addNewDoctor);
router.get("/alldoctors", getAllDoctors);
router.get("/allpatients", isAdminAuthenticated, getAllPatients);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/doctor/me", isDoctorAuthenticated, getDoctorDetails);
router.put("/patient/update", isPatientAuthenticated, updateUserProfile);
router.put("/doctor/update", isDoctorAuthenticated, updateDoctorProfile);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);
router.get("/doctor/logout", isDoctorAuthenticated, logoutDoctor);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);
router.post("/reset-password", resetPassword);




export default router;