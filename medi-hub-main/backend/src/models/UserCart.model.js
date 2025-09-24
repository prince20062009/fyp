import mongoose from "mongoose";

const userCartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: [{
            medicine: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Medicine",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }],
        totalAmount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

export const UserCart = mongoose.model("UserCart", userCartSchema, "usercarts");