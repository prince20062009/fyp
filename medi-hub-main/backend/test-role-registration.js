import axios from 'axios';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from './src/models/user.model.js';
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

// Test registration for different roles
const testRoleRegistration = async () => {
    try {
        console.log('Testing registration for different roles...\n');
        
        // Test data for each role
        const testData = [
            {
                firstName: "John",
                lastName: "Patient",
                age: 30,
                email: "john.patient@example.com",
                phone: "1234567890",
                password: "password123",
                role: "Patient",
                address: {
                    city: "New York",
                    country: "USA"
                },
                emergencyContact: {
                    name: "Jane Smith",
                    phone: "0987654321",
                    relationship: "Spouse"
                }
            },
            {
                firstName: "Dr. Sarah",
                lastName: "Doctor",
                age: 35,
                email: "dr.sarah@example.com",
                phone: "1112223333",
                password: "password123",
                role: "Doctor",
                specialty: "Cardiology",
                licenseNumber: "DOC123456",
                department: "Cardiology",
                experience: 10,
                dob: "1988-05-15",
                gender: "Female"
            },
            {
                firstName: "Admin",
                lastName: "User",
                age: 40,
                email: "admin@example.com",
                phone: "4445556666",
                password: "password123",
                role: "Admin"
            }
        ];
        
        // Test registration for each role
        for (const data of testData) {
            console.log(`Testing registration for ${data.role}...`);
            
            try {
                // Check if user already exists
                let existingUser;
                if (data.role === "Doctor") {
                    existingUser = await Doctor.findOne({ email: data.email });
                } else {
                    existingUser = await User.findOne({ email: data.email });
                }
                
                if (existingUser) {
                    console.log(`✅ ${data.role} already exists, skipping registration`);
                    continue;
                }
                
                // Register the user
                const response = await axios.post('http://localhost:8000/api/v1/user/patient/register', data, {
                    withCredentials: true
                });
                
                console.log(`✅ ${data.role} registration successful`);
                console.log('Response:', response.data.message);
                console.log('---\n');
            } catch (error) {
                console.log(`❌ ${data.role} registration failed`);
                console.log('Error:', error.response?.data || error.message);
                console.log('---\n');
            }
        }
    } catch (error) {
        console.log('Test error:', error.message);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
    }
};

// Main function
const main = async () => {
    await connectDB();
    await testRoleRegistration();
};

main();