import mongoose from "mongoose";
import dotenv from "dotenv";
import { Doctor } from "./src/models/doctor.model.js";

dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/medi_hub_db");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Sample doctors data
const sampleDoctors = [
  {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@medihub.com",
    phone: "1234567890",
    dob: "1980-01-01",
    gender: "Male",
    password: "password123",
    role: "Doctor",
    department: "Cardiology",
    specializations: ["Heart Surgery", "Cardiac Care"],
    experience: 15
  },
  {
    firstName: "Emily",
    lastName: "Johnson",
    email: "emily.johnson@medihub.com",
    phone: "0987654321",
    dob: "1985-05-15",
    gender: "Female",
    password: "password123",
    role: "Doctor",
    department: "Pediatrics",
    specializations: ["Child Care", "Vaccination"],
    experience: 10
  },
  {
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@medihub.com",
    phone: "1122334455",
    dob: "1975-12-10",
    gender: "Male",
    password: "password123",
    role: "Doctor",
    department: "Orthopedics",
    specializations: ["Joint Replacement", "Sports Injury"],
    experience: 20
  },
  {
    firstName: "Sarah",
    lastName: "Davis",
    email: "sarah.davis@medihub.com",
    phone: "5566778899",
    dob: "1982-08-22",
    gender: "Female",
    password: "password123",
    role: "Doctor",
    department: "Dermatology",
    specializations: ["Skin Care", "Cosmetic Surgery"],
    experience: 12
  },
  {
    firstName: "Robert",
    lastName: "Wilson",
    email: "robert.wilson@medihub.com",
    phone: "9988776655",
    dob: "1978-03-30",
    gender: "Male",
    password: "password123",
    role: "Doctor",
    department: "Neurology",
    specializations: ["Brain Surgery", "Nerve Disorders"],
    experience: 18
  }
];

// Add sample doctors to database
const addSampleDoctors = async () => {
  try {
    await connectDB();
    
    // Clear existing doctors
    await Doctor.deleteMany({ role: "Doctor" });
    console.log("Cleared existing doctors");
    
    // Add sample doctors
    for (const doctorData of sampleDoctors) {
      const doctor = new Doctor(doctorData);
      await doctor.save();
      console.log(`Added doctor: Dr. ${doctor.firstName} ${doctor.lastName}`);
    }
    
    console.log("Sample doctors added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error adding sample doctors:", error);
    process.exit(1);
  }
};

addSampleDoctors();