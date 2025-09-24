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

// Find doctor by email
const findDoctorByEmail = async (email) => {
    try {
        const doctor = await Doctor.findOne({ email: email });
        if (doctor) {
            console.log('Doctor found:');
            console.log('ID:', doctor._id);
            console.log('Name:', doctor.firstName, doctor.lastName);
            console.log('Email:', doctor.email);
            console.log('Role:', doctor.role);
            console.log('DOB:', doctor.dob);
            console.log('Gender:', doctor.gender);
            console.log('Department:', doctor.department);
            console.log('Specializations:', doctor.specializations);
            console.log('Experience:', doctor.experience);
        } else {
            console.log('Doctor with email', email, 'not found');
        }
    } catch (error) {
        console.error('Error finding doctor:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
    }
};

// Main function
const main = async () => {
    await connectDB();
    await findDoctorByEmail('dr.sarah@example.com');
};

main();