import axios from 'axios';

// First, login as admin to create a bill
const adminLogin = async () => {
    try {
        console.log('Logging in as admin...');
        const response = await axios.post('http://localhost:8000/api/v1/user/simple-login', {
            email: 'admin@example.com', // We'll need to find the actual admin credentials
            password: 'admin123',
            role: 'Admin'
        }, {
            withCredentials: true
        });
        
        console.log('Admin login successful:', response.data);
        return response.data.data.user;
    } catch (error) {
        console.log('Admin login error:', error.response?.data || error.message);
        return null;
    }
};

// Create a bill for the patient
const createBill = async (adminToken) => {
    try {
        console.log('Creating bill...');
        const response = await axios.post('http://localhost:8000/api/v1/billing', {
            patient: '68d18c26a2a3a128bf1eecd6', // The patient ID we just created
            items: [
                {
                    name: 'Consultation Fee',
                    description: 'General physician consultation',
                    quantity: 1,
                    unitPrice: 500
                },
                {
                    name: 'Blood Test',
                    description: 'Complete blood count test',
                    quantity: 1,
                    unitPrice: 300
                }
            ],
            tax: 50,
            discount: 20,
            notes: 'Please pay within 7 days',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        }, {
            headers: {
                'Authorization': `Bearer ${adminToken}`,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        
        console.log('Bill created successfully:', response.data);
        return response.data.data;
    } catch (error) {
        console.log('Bill creation error:', error.response?.data || error.message);
        return null;
    }
};

// Run tests
(async () => {
    // For now, let's just try to create a bill directly without admin login
    // We'll need to adjust this based on how the system actually works
    console.log('Testing billing system...');
})();