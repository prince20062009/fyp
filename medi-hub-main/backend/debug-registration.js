import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './src/models/user.model.js';
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

// Debug registration
const debugRegistration = async () => {
    try {
        const doctorData = {
            firstName: "Dr. Debug",
            lastName: "Doctor",
            email: "dr.debug.doctor@example.com",
            phone: "5556667777",
            dob: new Date("1980-01-01"),
            gender: "Male",
            password: "password123",
            role: "Doctor",
            department: "Debugging",
            specializations: ["Debugging"],
            experience: 15,
            avatar: {
                public_id: null,
                url: "https://img.freepik.com/premium-vector/doctor-profile-with-medical-service-icons_24877-41470.jpg"
            }
        };
        
        console.log('Doctor data:', doctorData);
        console.log('Role:', doctorData.role);
        console.log('Role type:', typeof doctorData.role);
        console.log('Role === "Doctor":', doctorData.role === "Doctor");
        
        // Hash password
        doctorData.password = await bcrypt.hash(doctorData.password, 10);
        
        // Create doctor directly
        const createdDoctor = await Doctor.create(doctorData);
        console.log('Doctor created successfully:', createdDoctor.firstName, createdDoctor.lastName);
        
        // Verify the doctor was created
        const foundDoctor = await Doctor.findOne({ email: doctorData.email });
        if (foundDoctor) {
            console.log('Doctor found in database:', foundDoctor.firstName, foundDoctor.lastName);
            console.log('Role in database:', foundDoctor.role);
        } else {
            console.log('Doctor not found in database');
        }
    } catch (error) {
        console.error('Error in debug registration:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
    }
};

// Main function
const main = async () => {
    await connectDB();
    await debugRegistration();
};

main();