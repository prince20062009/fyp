import axios from 'axios';

const testRegisterUser = async () => {
    try {
        console.log('Testing user registration...');
        const response = await axios.post('http://localhost:8000/api/v1/user/patient/register', {
            firstName: 'Test',
            lastName: 'User',
            age: 30,
            email: 'test2@example.com',
            phone: '1234567890',
            password: 'testpassword123',
            role: 'Patient'
        }, {
            withCredentials: true
        });
        
        console.log('User registered successfully:', response.data);
    } catch (error) {
        console.log('Registration error:', error.response?.data || error.message);
    }
};

const testLogin = async () => {
    try {
        console.log('Testing user login...');
        const response = await axios.post('http://localhost:8000/api/v1/user/simple-login', {
            email: 'test2@example.com',
            password: 'testpassword123',
            role: 'Patient'
        }, {
            withCredentials: true
        });
        
        console.log('Login successful:', response.data);
    } catch (error) {
        console.log('Login error:', error.response?.data || error.message);
    }
};

// Run tests
(async () => {
    await testRegisterUser();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    await testLogin();
})();