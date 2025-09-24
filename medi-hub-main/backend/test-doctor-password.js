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

// Test doctor password
const testDoctorPassword = async () => {
    try {
        const doctor = await Doctor.findOne({ email: 'dr.sarah@example.com' }).select('+password');
        if (doctor) {
            console.log('Doctor found:');
            console.log('ID:', doctor._id);
            console.log('Email:', doctor.email);
            console.log('Password hash:', doctor.password);
            
            // Test password comparison
            const isMatch = await doctor.comparePassword('password123');
            console.log('Password match result:', isMatch);
            
            // Test manual bcrypt comparison
            const manualMatch = await bcrypt.compare('password123', doctor.password);
            console.log('Manual bcrypt comparison:', manualMatch);
        } else {
            console.log('Doctor not found');
        }
    } catch (error) {
        console.error('Error testing doctor password:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
    }
};

// Main function
const main = async () => {
    await connectDB();
    await testDoctorPassword();
};

main();