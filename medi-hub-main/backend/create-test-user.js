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

// Create test user function
const createTestUser = async () => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: 'test2@example.com' });
        if (existingUser) {
            console.log('Test user already exists');
            return;
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        // Create the user
        const user = new User({
            firstName: 'Test',
            lastName: 'User',
            age: 30,
            email: 'test2@example.com',
            phone: '1234567890',
            password: hashedPassword,
            role: 'Patient'
        });
        
        await user.save();
        console.log('Test user created successfully');
    } catch (error) {
        console.error('Error creating test user:', error);
    }
};

// Main function
const main = async () => {
    await connectDB();
    
    // Create test user
    await createTestUser();
    
    // Close the connection
    mongoose.connection.close();
};

main();