import axios from 'axios';

const testLogin = async () => {
    try {
        console.log('Testing login with your email...');
        const response = await axios.post('http://localhost:8000/api/v1/user/simple-login', {
            email: 'gowtham29062006@gmail.com',
            password: 'your_password_here', // Replace with your actual password
            role: 'Patient'
        }, {
            withCredentials: true
        });
        
        console.log('Login successful:', response.data);
    } catch (error) {
        console.log('Login error:', error.response?.data || error.message);
    }
};

testLogin();