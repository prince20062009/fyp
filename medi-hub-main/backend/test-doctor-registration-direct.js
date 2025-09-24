import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Doctor } from './src/models/doctor.model.js';

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

// Test doctor registration directly
const testDoctorRegistrationDirect = async () => {
    try {
        const doctorData = {
            firstName: "Dr. Direct",
            lastName: "Doctor",
            email: "dr.direct.doctor@example.com",
            phone: "4445556666",
            dob: new Date("1982-03-15"),
            gender: "Female",
            password: "password123", // Plain text password
            role: "Doctor",
            department: "Direct",
            specializations: ["Direct"],
            experience: 12,
            avatar: {
                public_id: null,
                url: "https://img.freepik.com/premium-vector/doctor-profile-with-medical-service-icons_24877-41470.jpg"
            }
        };
        
        console.log('Creating doctor with plain text password...');
        
        // Create doctor directly (let the pre-save hook handle password hashing)
        const createdDoctor = await Doctor.create(doctorData);
        console.log('Doctor created successfully:', createdDoctor.firstName, createdDoctor.lastName);
        
        // Verify the doctor was created and password was hashed
        const foundDoctor = await Doctor.findOne({ email: doctorData.email }).select('+password');
        if (foundDoctor) {
            console.log('Doctor found in database:', foundDoctor.firstName, foundDoctor.lastName);
            console.log('Password hash:', foundDoctor.password);
            
            // Test password comparison
            const isMatch = await foundDoctor.comparePassword('password123');
            console.log('Password match result:', isMatch);
        } else {
            console.log('Doctor not found in database');
        }
    } catch (error) {
        console.error('Error in direct doctor registration:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
    }
};

// Main function
const main = async () => {
    await connectDB();
    await testDoctorRegistrationDirect();
};

main();