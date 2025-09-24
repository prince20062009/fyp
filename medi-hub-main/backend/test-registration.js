import axios from 'axios';

async function testRegistration() {
  try {
    console.log('Testing patient registration...');
    
    const patientData = {
      firstName: "Test",
      lastName: "Patient",
      age: 30,
      email: "testpatient@example.com",
      phone: "1234567890",
      password: "password123",
      role: "Patient",
      address: {
        city: "Test City",
        country: "Test Country"
      }
    };
    
    const response = await axios.post('http://localhost:8000/api/v1/user/patient/register', patientData);
    console.log('Patient Registration Response:', response.data);
  } catch (error) {
    console.log('Patient Registration Error:', error.response ? error.response.data : error.message);
  }
  
  try {
    console.log('\nTesting doctor registration...');
    
    const doctorData = {
      firstName: "Test",
      lastName: "Doctor",
      age: 35,
      email: "testdoctor@example.com",
      phone: "0987654321",
      password: "password123",
      role: "Doctor",
      specialty: "Cardiology",
      licenseNumber: "DOC12345",
      department: "Cardiology",
      experience: 10,
      dob: "1985-01-01",
      gender: "Male"
    };
    
    const response = await axios.post('http://localhost:8000/api/v1/user/patient/register', doctorData);
    console.log('Doctor Registration Response:', response.data);
  } catch (error) {
    console.log('Doctor Registration Error:', error.response ? error.response.data : error.message);
  }
}

testRegistration();