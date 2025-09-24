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

// Check if doctor exists
const checkDoctor = async () => {
    try {
        const doctor = await Doctor.findOne({ email: 'dr.sarah@example.com' });
        if (doctor) {
            console.log('Doctor found:');
            console.log('ID:', doctor._id);
            console.log('Name:', doctor.firstName, doctor.lastName);
            console.log('Email:', doctor.email);
            console.log('Role:', doctor.role);
            console.log('Department:', doctor.department);
            console.log('Specializations:', doctor.specializations);
        } else {
            console.log('Doctor not found');
        }
    } catch (error) {
        console.error('Error checking doctor:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
    }
};

// Main function
const main = async () => {
    await connectDB();
    await checkDoctor();
};

main();