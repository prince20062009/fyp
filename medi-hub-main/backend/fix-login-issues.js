import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenv configuration
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Import User model
import { User } from './src/models/user.model.js';

// Function to check if a user exists and verify password hashing
async function diagnoseUser(email) {
  try {
    console.log(`Diagnosing user: ${email}`);
    
    // Find the user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User found:', {
      id: user._id,
      email: user.email,
      role: user.role,
      passwordLength: user.password?.length
    });
    
    // Test password comparison
    const testPassword = 'password123';
    const isMatch = await user.comparePassword(testPassword);
    console.log('Password comparison test with "password123":', isMatch);
    
    return user;
  } catch (error) {
    console.log('Error diagnosing user:', error.message);
  }
}

// Function to reset password with proper hashing
async function resetPassword(email, newPassword) {
  try {
    console.log(`Resetting password for user: ${email}`);
    
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return;
    }
    
    // Hash the new password with the same salt rounds as in the model
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the user's password
    await User.updateOne({ email }, { password: hashedPassword });
    
    console.log('Password reset successfully');
    
    // Verify the new password works
    const updatedUser = await User.findOne({ email }).select('+password');
    const isMatch = await updatedUser.comparePassword(newPassword);
    console.log('New password verification:', isMatch);
  } catch (error) {
    console.log('Error resetting password:', error.message);
  }
}

// Function to create a test user if none exists
async function createTestUser() {
  try {
    const email = 'test@example.com';
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }
    
    const newUser = new User({
      firstName: 'Test',
      lastName: 'User',
      age: 30,
      email: email,
      phone: '1234567890',
      password: 'password123',
      role: 'Patient'
    });
    
    await newUser.save();
    console.log('Test user created successfully');
  } catch (error) {
    console.log('Error creating test user:', error.message);
  }
}

// Main function
async function main() {
  const action = process.argv[2];
  const email = process.argv[3];
  const password = process.argv[4];
  
  switch (action) {
    case 'diagnose':
      if (!email) {
        console.log('Usage: node fix-login-issues.js diagnose <email>');
        break;
      }
      await diagnoseUser(email);
      break;
      
    case 'reset':
      if (!email || !password) {
        console.log('Usage: node fix-login-issues.js reset <email> <newPassword>');
        break;
      }
      await resetPassword(email, password);
      break;
      
    case 'create-test':
      await createTestUser();
      break;
      
    default:
      console.log('Usage:');
      console.log('  node fix-login-issues.js diagnose <email>');
      console.log('  node fix-login-issues.js reset <email> <newPassword>');
      console.log('  node fix-login-issues.js create-test');
  }
  
  // Close the database connection
  await mongoose.connection.close();
}

main();