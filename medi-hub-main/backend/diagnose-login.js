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

// Function to diagnose login issues
async function diagnoseLoginIssues(email, password) {
  try {
    console.log("=== LOGIN ISSUE DIAGNOSIS ===");
    console.log("Email:", email);
    console.log("Password provided:", password ? `(${password.length} characters)` : "NULL");
    
    // 1. Check if user exists
    console.log("\n1. Checking if user exists...");
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log("❌ User not found in database");
      return;
    }
    console.log("✅ User found");
    console.log("User ID:", user._id);
    console.log("User role:", user.role);
    console.log("Password hash length:", user.password?.length);
    
    // 2. Check password format
    console.log("\n2. Checking password format...");
    if (!password) {
      console.log("❌ No password provided");
      return;
    }
    
    if (password.length < 8) {
      console.log("❌ Password too short (minimum 8 characters)");
      return;
    }
    
    console.log("✅ Password format valid");
    
    // 3. Test password comparison
    console.log("\n3. Testing password comparison...");
    try {
      const isMatch = await user.comparePassword(password);
      console.log("Password comparison result:", isMatch);
      
      if (isMatch) {
        console.log("✅ Password matches!");
      } else {
        console.log("❌ Password does not match");
        
        // Try some common variations
        console.log("\n4. Testing common password variations...");
        const variations = [
          password.trim(),
          password.toLowerCase(),
          password.toUpperCase()
        ];
        
        for (const variation of variations) {
          if (variation !== password) {
            const variationMatch = await user.comparePassword(variation);
            console.log(`  "${variation}" matches: ${variationMatch}`);
          }
        }
      }
    } catch (compareError) {
      console.log("❌ Error during password comparison:", compareError.message);
      return;
    }
    
    // 5. Test manual bcrypt comparison
    console.log("\n5. Testing manual bcrypt comparison...");
    try {
      const manualCompare = await bcrypt.compare(password, user.password);
      console.log("Manual bcrypt comparison result:", manualCompare);
    } catch (manualError) {
      console.log("❌ Error during manual bcrypt comparison:", manualError.message);
    }
    
  } catch (error) {
    console.log("❌ Error during diagnosis:", error.message);
    console.log("Stack trace:", error.stack);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log("\n=== DIAGNOSIS COMPLETE ===");
  }
}

// Get email and password from command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log("Usage: node diagnose-login.js <email> <password>");
  console.log("Example: node diagnose-login.js test2@example.com password123");
  process.exit(1);
}

diagnoseLoginIssues(email, password);