import mongoose from 'mongoose';
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

// List all users
const listUsers = async () => {
    try {
        const users = await User.find({});
        console.log(`Found ${users.length} users:`);
        users.forEach(user => {
            console.log(`- ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`);
        });
    } catch (error) {
        console.error('Error listing users:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
    }
};

// Main function
const main = async () => {
    await connectDB();
    await listUsers();
};

main();