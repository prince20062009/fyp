import axios from 'axios';

// Test the billing system with different user roles
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Test data
const testPatientId = '68d18c26a2a3a128bf1eecd6'; // Example patient ID
const testDoctorId = '68d18c26a2a3a128bf1eecd7'; // Example doctor ID

// Function to test as admin
const testAsAdmin = async (adminToken) => {
    console.log('Testing as Admin...');
    
    try {
        // Create a bill as admin
        const billResponse = await axios.post(`${API_BASE_URL}/billing`, {
            patient: testPatientId,
            doctor: testDoctorId,
            diagnosis: 'Common cold with fever',
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
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }, {
            headers: {
                'Authorization': `Bearer ${adminToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Admin - Bill created successfully:', billResponse.data);
        return billResponse.data.data._id;
    } catch (error) {
        console.log('Admin - Error creating bill:', error.response?.data || error.message);
        return null;
    }
};

// Function to test as doctor
const testAsDoctor = async (doctorToken, patientId) => {
    console.log('Testing as Doctor...');
    
    try {
        // Create a bill as doctor
        const billResponse = await axios.post(`${API_BASE_URL}/doctor/billing`, {
            patient: patientId,
            diagnosis: 'Headache and nausea',
            items: [
                {
                    name: 'Consultation Fee',
                    description: 'Neurologist consultation',
                    quantity: 1,
                    unitPrice: 800
                },
                {
                    name: 'MRI Scan',
                    description: 'Brain MRI scan',
                    quantity: 1,
                    unitPrice: 2500
                }
            ],
            tax: 100,
            discount: 0,
            notes: 'Scan results will be available in 24 hours',
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
        }, {
            headers: {
                'Authorization': `Bearer ${doctorToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Doctor - Bill created successfully:', billResponse.data);
        return billResponse.data.data._id;
    } catch (error) {
        console.log('Doctor - Error creating bill:', error.response?.data || error.message);
        return null;
    }
};

// Function to test as patient
const testAsPatient = async (patientToken) => {
    console.log('Testing as Patient...');
    
    try {
        // Get patient bills
        const billsResponse = await axios.get(`${API_BASE_URL}/billing`, {
            headers: {
                'Authorization': `Bearer ${patientToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Patient - Bills fetched successfully:', billsResponse.data);
        
        // Try to create a bill (should fail)
        try {
            const createBillResponse = await axios.post(`${API_BASE_URL}/billing`, {
                patient: testPatientId,
                items: [{ name: 'Test', quantity: 1, unitPrice: 100 }]
            }, {
                headers: {
                    'Authorization': `Bearer ${patientToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Patient - Unexpected success creating bill:', createBillResponse.data);
        } catch (error) {
            console.log('Patient - Correctly denied bill creation:', error.response?.data?.message || error.message);
        }
        
        return billsResponse.data.data;
    } catch (error) {
        console.log('Patient - Error fetching bills:', error.response?.data || error.message);
        return null;
    }
};

// Function to test admin getting all bills
const testAdminGetAllBills = async (adminToken) => {
    console.log('Testing Admin getting all bills...');
    
    try {
        const billsResponse = await axios.get(`${API_BASE_URL}/billing/admin`, {
            headers: {
                'Authorization': `Bearer ${adminToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Admin - All bills fetched successfully:', billsResponse.data);
        return billsResponse.data.data;
    } catch (error) {
        console.log('Admin - Error fetching all bills:', error.response?.data || error.message);
        return null;
    }
};

// Run tests
(async () => {
    console.log('Testing billing system role-based access...');
    
    // Note: In a real test, you would first login to get tokens
    // For now, we'll just show the structure
    
    console.log('Test structure ready. To run full tests, you need to:');
    console.log('1. Login as admin to get adminToken');
    console.log('2. Login as doctor to get doctorToken');
    console.log('3. Login as patient to get patientToken');
    console.log('4. Run the test functions with the tokens');
})();