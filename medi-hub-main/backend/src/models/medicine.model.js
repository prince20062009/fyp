import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: String,
        price: {
            type: Number,
            required: true
        },
        category: String,
        inStock: {
            type: Boolean,
            default: true
        },
        image: {
            public_id: String,
            url: String,
        }
    },
    { timestamps: true }
);

export const Medicine = mongoose.model("Medicine", medicineSchema, "medicines");