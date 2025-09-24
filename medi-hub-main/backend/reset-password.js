import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from './src/models/user.model.js';

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

// Reset password function
const resetPassword = async (email, newPassword) => {
    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update the user's password
        const result = await User.updateOne(
            { email: email },
            { password: hashedPassword }
        );
        
        if (result.modifiedCount > 0) {
            console.log(`Password successfully reset for user: ${email}`);
        } else {
            console.log(`No user found with email: ${email}`);
        }
    } catch (error) {
        console.error('Error resetting password:', error);
    }
};

// Main function
const main = async () => {
    await connectDB();
    
    // Reset password for demo user
    await resetPassword('demo@example.com', 'password123');
    
    // Close the connection
    mongoose.connection.close();
};

main();