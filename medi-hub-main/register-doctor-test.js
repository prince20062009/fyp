import axios from 'axios';

// Register a new doctor using the correct endpoint
async function registerDoctor() {
  try {
    console.log('Registering new doctor...');
    
    const doctorData = {
      firstName: "Dr. Sarah",
      lastName: "Doctor",
      age: 35,
      email: "dr.sarah.test@example.com", // New email to avoid conflicts
      phone: "1112223333",
      password: "password123",
      role: "Doctor",
      specialty: "Cardiology",
      licenseNumber: "DOC123456",
      department: "Cardiology",
      experience: 10,
      dob: "1988-05-15",
      gender: "Female"
    };
    
    // Use the patient register endpoint which handles doctor registration too
    const response = await axios.post('http://localhost:8000/api/v1/user/patient/register', doctorData, {
      withCredentials: true
    });
    
    console.log('✅ Doctor registration successful');
    console.log('Response:', response.data.message);
    console.log('User:', response.data.data.user);
    return response.data.data.user;
  } catch (error) {
    console.log('❌ Doctor registration failed');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return null;
  }
}

// Test login for the newly registered doctor
async function testDoctorLogin(email, password) {
  try {
    console.log('\nTesting login for doctor...');
    
    const loginData = {
      email: email,
      password: password,
      role: 'Doctor'
    };
    
    const response = await axios.post('http://localhost:8000/api/v1/user/simple-login', loginData, {
      withCredentials: true
    });
    
    console.log('✅ Doctor login successful');
    console.log('Response:', response.data.message);
    console.log('User:', response.data.data.user.firstName, response.data.data.user.lastName);
    console.log('Role:', response.data.data.user.role);
    
    return true;
  } catch (error) {
    console.log('❌ Doctor login failed');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    
    return false;
  }
}

// Main function
async function main() {
  // Register a new doctor
  const user = await registerDoctor();
  
  if (user) {
    // Test login with the newly registered doctor
    await testDoctorLogin(user.email, "password123");
  }
}

main();