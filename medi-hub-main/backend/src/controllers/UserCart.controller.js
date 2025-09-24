import asyncHandler from "../utilis/asyncHandler.js";
import { ApiResponse } from "../utilis/ApiResponse.js";

//! Placeholder for cart controller
export const getCart = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, {}, "Cart fetched successfully")
    );
});

export const addToCart = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, {}, "Item added to cart successfully")
    );
});