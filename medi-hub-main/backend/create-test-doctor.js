import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Doctor } from './src/models/doctor.model.js';
import bcrypt from 'bcrypt';

// Load environment variables
dotenv.config();

// MongoDB connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

// Create test doctor
const createTestDoctor = async () => {
    try {
        // Check if doctor already exists
        const existingDoctor = await Doctor.findOne({ email: 'dr.sarah@example.com' });
        if (existingDoctor) {
            console.log('Doctor already exists');
            return;
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        // Create doctor
        const doctor = new Doctor({
            firstName: "Dr. Sarah",
            lastName: "Doctor",
            email: "dr.sarah@example.com",
            phone: "1112223333",
            dob: new Date("1988-05-15"),
            gender: "Female",
            password: hashedPassword,
            role: "Doctor",
            department: "Cardiology",
            specializations: ["Cardiology"],
            experience: 10,
            avatar: {
                public_id: null,
                url: "https://img.freepik.com/premium-vector/doctor-profile-with-medical-service-icons_24877-41470.jpg"
            }
        });
        
        await doctor.save();
        console.log('Doctor created successfully');
        console.log('Doctor ID:', doctor._id);
    } catch (error) {
        console.error('Error creating doctor:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
    }
};

// Main function
const main = async () => {
    await connectDB();
    await createTestDoctor();
};

main();