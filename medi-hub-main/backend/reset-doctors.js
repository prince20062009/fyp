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

// Reset doctors
const resetDoctors = async () => {
    try {
        const result = await Doctor.deleteMany({ email: 'dr.sarah@example.com' });
        console.log(`Deleted ${result.deletedCount} doctors`);
        
        console.log('Doctors reset successfully');
    } catch (error) {
        console.error('Error resetting doctors:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
    }
};

// Main function
const main = async () => {
    await connectDB();
    await resetDoctors();
};

main();