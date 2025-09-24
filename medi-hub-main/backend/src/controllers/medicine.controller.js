import asyncHandler from "../utilis/asyncHandler.js";
import { ApiResponse } from "../utilis/ApiResponse.js";

//! Placeholder for medicine controller
export const getAllMedicines = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, [], "Medicines fetched successfully")
    );
});

export const getMedicineById = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, {}, "Medicine details fetched successfully")
    );
});