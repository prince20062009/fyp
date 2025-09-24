import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true
        },
        appointmentDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
            default: "Pending"
        },
        department: {
            type: String,
            required: true
        },
        city: String,
        pincode: String,
        notes: String
    },
    { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema, "appointments");