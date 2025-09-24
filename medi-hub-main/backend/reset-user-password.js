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

// Reset password function
async function resetPassword(email, newPassword) {
  try {
    console.log(`Resetting password for user: ${email}`);
    
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return;
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the user's password
    await User.updateOne({ email }, { password: hashedPassword });
    
    console.log('Password reset successfully');
  } catch (error) {
    console.log('Error resetting password:', error.message);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
  }
}

// Get email and password from command line arguments
const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.log('Usage: node reset-user-password.js <email> <newPassword>');
  process.exit(1);
}

resetPassword(email, newPassword);