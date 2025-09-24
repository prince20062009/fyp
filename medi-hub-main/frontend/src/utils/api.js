const API_BASE_URL = 'http://localhost:8000/api/v1';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.accessToken;
};

// Generic API call function
const apiCall = async (endpoint, method = 'GET', data = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    method,
    headers,
    credentials: 'include',
  };
  
  if (data) {
    config.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, config);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }
    
    return result;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Appointment API functions
export const bookAppointment = (appointmentData) => {
  return apiCall('/appointment', 'POST', appointmentData);
};

export const getAppointments = () => {
  return apiCall('/appointment', 'GET');
};

export const getAllAppointmentsAdmin = () => {
  return apiCall('/appointment/admin', 'GET');
};

export const updateAppointment = (appointmentId, appointmentData) => {
  return apiCall(`/appointment/${appointmentId}`, 'PUT', appointmentData);
};

export const deleteAppointment = (appointmentId) => {
  return apiCall(`/appointment/${appointmentId}`, 'DELETE');
};

// Doctor API functions
export const getAllDoctors = () => {
  return apiCall('/user/alldoctors', 'GET');
};

export const addDoctor = (doctorData) => {
  return apiCall('/user/doctor/addnew', 'POST', doctorData);
};

// Patient API functions
export const getAllPatients = () => {
  return apiCall('/user/allpatients', 'GET');
};

// Billing API functions
export const createBill = (billData) => {
  return apiCall('/billing', 'POST', billData);
};

export const getPatientBills = () => {
  return apiCall('/billing', 'GET');
};

export const getAllBillsAdmin = () => {
  return apiCall('/billing/admin', 'GET');
};

export const getBillById = (billId) => {
  return apiCall(`/billing/${billId}`, 'GET');
};

export const updateBillPayment = (billId, paymentData) => {
  return apiCall(`/billing/${billId}`, 'PUT', paymentData);
};

export const deleteBill = (billId) => {
  return apiCall(`/billing/${billId}`, 'DELETE');
};

// User API functions
export const getUserProfile = () => {
  return apiCall('/user/profile', 'GET');
};

export const updateUserProfile = (profileData) => {
  return apiCall('/user/patient/update', 'PUT', profileData);
};

export const updateDoctorProfile = (profileData) => {
  return apiCall('/user/doctor/update', 'PUT', profileData);
};

// Password reset function
export const resetPassword = (email, newPassword) => {
  return apiCall('/user/reset-password', 'POST', { email, newPassword });
};

export default {
  bookAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
  getAllDoctors,
  addDoctor,
  getAllPatients,
  createBill,
  getPatientBills,
  getAllBillsAdmin,
  getBillById,
  updateBillPayment,
  deleteBill,
  getUserProfile,
  updateUserProfile,
  updateDoctorProfile,
  resetPassword
};