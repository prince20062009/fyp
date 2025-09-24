import axios from 'axios';

// Register a new doctor
async function registerNewDoctor() {
  try {
    console.log('Registering new doctor...');
    
    const doctorData = {
      firstName: "Dr. Sarah",
      lastName: "Doctor",
      age: 35,
      email: "dr.sarah.new@example.com", // New email to avoid conflicts
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
    
    const response = await axios.post('http://localhost:8000/api/v1/user/patient/register', doctorData, {
      withCredentials: true
    });
    
    console.log('✅ Doctor registration successful');
    console.log('Response:', response.data.message);
  } catch (error) {
    console.log('❌ Doctor registration failed');
    console.log('Error:', error.response?.data || error.message);
  }
}

registerNewDoctor();