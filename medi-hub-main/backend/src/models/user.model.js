import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// create user model (firstName, lastName, email, phone, nic, dob, gender, password)
// validate the email
// passoword hashing (bcrypt)
// compare passowrd
// generate jwt 


const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First Name is required"],
            minLength: [2, "First Name contains at least 2 characters"],
        },
        lastName: {
            type: String,
            required: [true, "Last Name is required"],
            minLength: [2, "Last Name contains at least 2 characters"],
        },
        age: {
            type: Number,
            required: [true, "Age is required"],
            min: [1, "Age must be at least 1"],
            max: [120, "Age must be less than 120"]
        },
        email: {
            type: String,
            required: [true, "Email is required!"],
            validate: [validator.isEmail, "Email is invalid"]
        },
        phone: {
            type: String,
            required: [true, "Phone is required"],
            minLength: [10, "Phone Number must contains exactly 10 digits"],
            maxLength: [10, "Phone Number must contains exactly 10 digits"],
        },
        address: {
            city: {
                type: String,
            },
            country: {
                type: String,
            }
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
            enum: ["Admin", "Patient", "Doctor"]
        },
        // Additional fields for different roles
        specialty: {
            type: String,
            required: function() { return this.role === 'Doctor'; }
        },
        licenseNumber: {
            type: String,
            required: function() { return this.role === 'Doctor'; }
        },
        department: {
            type: String,
            required: function() { return this.role === 'Doctor'; }
        },
        experience: {
            type: Number,
            min: 0,
            required: function() { return this.role === 'Doctor'; }
        },
        medicalHistory: [{
            condition: String,
            diagnosedDate: Date,
            notes: String
        }],
        emergencyContact: {
            name: String,
            phone: String,
            relationship: String
        }
    },
    { timestamps: true }
);


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};


export const User = mongoose.model("User", userSchema); 