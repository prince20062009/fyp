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

// Delete doctor
const deleteDoctor = async () => {
    try {
        const result = await Doctor.deleteOne({ email: 'dr.sarah@example.com' });
        if (result.deletedCount > 0) {
            console.log('Doctor deleted successfully');
        } else {
            console.log('Doctor not found');
        }
    } catch (error) {
        console.error('Error deleting doctor:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
    }
};

// Main function
const main = async () => {
    await connectDB();
    await deleteDoctor();
};

main();