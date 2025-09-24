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

// List all doctors
const listDoctors = async () => {
    try {
        const doctors = await Doctor.find({});
        console.log(`Found ${doctors.length} doctors:`);
        doctors.forEach(doctor => {
            console.log(`- ${doctor.firstName} ${doctor.lastName} (${doctor.email}) - Role: ${doctor.role}`);
        });
    } catch (error) {
        console.error('Error listing doctors:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
    }
};

// Main function
const main = async () => {
    await connectDB();
    await listDoctors();
};

main();