import axios from 'axios';

// Register a fresh doctor
async function registerFreshDoctor() {
  try {
    console.log('Registering fresh doctor...');
    
    const doctorData = {
      firstName: "Dr. Fresh",
      lastName: "Doctor",
      age: 35,
      email: "dr.fresh.doctor@example.com", // Completely new email
      phone: "9998887777",
      password: "password123",
      role: "Doctor",
      specialty: "Neurology",
      licenseNumber: "DOC999888",
      department: "Neurology",
      experience: 8,
      dob: "1985-10-20",
      gender: "Male"
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

registerFreshDoctor();