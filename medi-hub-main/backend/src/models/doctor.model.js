import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const doctorSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First Name is required"],
            minLength: [3, "First Name contains at least 3 characters"],
        },
        lastName: {
            type: String,
            required: [true, "Last Name is required"],
            minLength: [3, "Last Name contains at least 3 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required!"],
            validate: [validator.isEmail, "Email is invalid"]
        },
        phone: {
            type: String,
            required: [true, "Phone is required"],
            minLength: [10, "Phone Number must contain exactly 10 digits"],
            maxLength: [10, "Phone Number must contain exactly 10 digits"],
        },
        dob: {
            type: Date,
            required: [true, "DOB Is Required!"],
        },
        gender: {
            type: String,
            required: [true, "Gender Is Required!"],
            enum: ["Male", "Female"],
        },
        password: {
            type: String,
            required: true,
            minLength: [8, "Password must contain at least 8 characters"],
            select: false,
        },
        role: {
            type: String,
            required: true,
            enum: ["Doctor"]
        },
        department: {
            type: String,
            required: [true, "Department is required"]
        },
        specializations: {
            type: [String],
            default: []
        },
        experience: {
            type: Number,
            default: 0
        },
        avatar: {
            public_id: String,
            url: String,
        },
    },
    { timestamps: true }
);

doctorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

doctorSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

doctorSchema.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

export const Doctor = mongoose.model("Doctor", doctorSchema, "doctors");