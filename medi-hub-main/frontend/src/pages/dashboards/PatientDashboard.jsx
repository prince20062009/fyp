import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllDoctors, getAppointments, getPatientBills, bookAppointment, updateAppointment, deleteAppointment } from "../../utils/api";
import PaymentModal from "../../components/payments/PaymentModal";
import ProfileEditForm from "../../components/ProfileEditForm";

function PatientDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeModule, setActiveModule] = useState('overview');
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    doctor: '',
    appointmentDate: '',
    appointmentTime: '',
    department: '',
    city: '',
    pincode: '',
    notes: ''
  });
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  // Add these new state variables for profile editing
  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'Patient') {
        setUser(parsedUser);
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch doctors when the component mounts
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch appointments when the appointments module is active
  useEffect(() => {
    if (activeModule === 'appointments') {
      fetchAppointments();
    } else if (activeModule === 'billing') {
      fetchBills();
    }
  }, [activeModule]);

  const fetchDoctors = async () => {
    try {
      const response = await getAllDoctors();
      setDoctors(response.data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch doctors');
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await getAppointments();
      setAppointments(response.data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchBills = async () => {
    try {
      const response = await getPatientBills();
      setBills(response.data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch bills');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const modules = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'appointments', name: 'Appointments', icon: '📅' },
    { id: 'medical-history', name: 'Medical History', icon: '📋' },
    { id: 'prescriptions', name: 'Prescriptions', icon: '💊' },
    { id: 'billing', name: 'Billing', icon: '💳' },
    { id: 'profile', name: 'Profile', icon: '👤' }
  ];

  const departments = [
    { id: 'cardiology', name: 'Cardiology', icon: '❤️' },
    { id: 'dermatology', name: 'Dermatology', icon: '肤' },
    { id: 'pediatrics', name: 'Pediatrics', icon: '👶' },
    { id: 'orthopedics', name: 'Orthopedics', icon: '🦴' },
    { id: 'neurology', name: 'Neurology', icon: '🧠' },
    { id: 'opthalmology', name: 'Ophthalmology', icon: '👁️' },
    { id: 'gynecology', name: 'Gynecology', icon: '🚺' },
    { id: 'dentistry', name: 'Dentistry', icon: '🦷' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.doctor || !formData.appointmentDate || !formData.appointmentTime || !formData.department) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Combine date and time
    const combinedDateTime = `${formData.appointmentDate}T${formData.appointmentTime}:00`;
    
    const appointmentData = {
      doctor: formData.doctor,
      appointmentDate: combinedDateTime,
      department: formData.department,
      city: formData.city,
      pincode: formData.pincode,
      notes: formData.notes
    };

    try {
      if (editingAppointment) {
        // Update existing appointment
        await updateAppointment(editingAppointment._id, appointmentData);
        toast.success('Appointment updated successfully!');
        setEditingAppointment(null);
      } else {
        // Book new appointment
        await bookAppointment(appointmentData);
        toast.success('Appointment booked successfully!');
      }
      
      // Reset form
      setFormData({
        doctor: '',
        appointmentDate: '',
        appointmentTime: '',
        department: '',
        city: '',
        pincode: '',
        notes: ''
      });
      
      // Refresh appointments list
      fetchAppointments();
    } catch (error) {
      toast.error(error.message || 'Failed to process appointment');
    }
  };

  const handleEditAppointment = (appointment) => {
    // Convert appointment date to form fields
    const appointmentDate = new Date(appointment.appointmentDate);
    const dateStr = appointmentDate.toISOString().split('T')[0];
    const timeStr = appointmentDate.toTimeString().substring(0, 5);
    
    setFormData({
      doctor: appointment.doctor._id || appointment.doctor,
      appointmentDate: dateStr,
      appointmentTime: timeStr,
      department: appointment.department,
      city: appointment.city || '',
      pincode: appointment.pincode || '',
      notes: appointment.notes || ''
    });
    
    setEditingAppointment(appointment);
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteAppointment(appointmentId);
        toast.success('Appointment deleted successfully!');
        fetchAppointments();
      } catch (error) {
        toast.error(error.message || 'Failed to delete appointment');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingAppointment(null);
    setFormData({
      doctor: '',
      appointmentDate: '',
      appointmentTime: '',
      department: '',
      city: '',
      pincode: '',
      notes: ''
    });
  };

  // Function to format date in a readable way
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to format time in a readable way
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // Function to get doctor by ID
  const getDoctorById = (id) => {
    return doctors.find(doctor => doctor._id === id);
  };

  const handlePaymentSuccess = () => {
    // Refresh bills after successful payment
    fetchBills();
  };

  const handleSaveProfile = async (profileData) => {
    try {
      // Update user in localStorage
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditingProfile(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const renderModuleContent = () => {
    switch(activeModule) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900">Upcoming Appointments</h3>
                <p className="text-2xl font-bold text-blue-600">{appointments.length || 2}</p>
                <p className="text-sm text-blue-700">Next: Tomorrow 10:00 AM</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900">Active Prescriptions</h3>
                <p className="text-2xl font-bold text-green-600">3</p>
                <p className="text-sm text-green-700">1 expiring soon</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900">Pending Bills</h3>
                <p className="text-2xl font-bold text-yellow-600">$150</p>
                <p className="text-sm text-yellow-700">Due in 5 days</p>
              </div>
            </div>
          </div>
        );
      case 'appointments':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
                <p className="text-gray-600">Manage your appointments and book new ones</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center">
                  <span>📅</span>
                  <span className="ml-2">Today</span>
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center">
                  <span>📆</span>
                  <span className="ml-2">This Week</span>
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center">
                  <span>🗓️</span>
                  <span className="ml-2">This Month</span>
                </button>
              </div>
            </div>
            
            {/* Quick Stats */ }
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length + 5}</p>
              </div>
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600">{appointments.length || 2}</p>
              </div>
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">3</p>
              </div>
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">0</p>
              </div>
            </div>
            
            {/* Booking Form - Improved UI */ }
            <div className="bg-white border rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h3 className="text-xl font-semibold">
                  {editingAppointment ? 'Edit Appointment' : 'Book New Appointment'}
                </h3>
              </div>
              <div className="p-6">
                <form className="space-y-6" onSubmit={handleFormSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Department Selection - Visual Cards */ }
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select Department <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {departments.map(dept => (
                          <button
                            key={dept.id}
                            type="button"
                            onClick={() => setFormData({...formData, department: dept.id})}
                            className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                              formData.department === dept.id 
                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                          >
                            <span className="text-2xl mb-2">{dept.icon}</span>
                            <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Doctor Selection */ }
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Doctor <span className="text-red-500">*</span>
                      </label>
                      <select 
                        name="doctor"
                        value={formData.doctor}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Choose a doctor</option>
                        {doctors.map(doctor => (
                          <option key={doctor._id} value={doctor._id}>
                            Dr. {doctor.firstName} {doctor.lastName} - {doctor.department}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Date and Time */ }
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Appointment Date & Time <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="date" 
                          name="appointmentDate"
                          value={formData.appointmentDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        <input 
                          type="time" 
                          name="appointmentTime"
                          value={formData.appointmentTime}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Location */ }
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input 
                        type="text" 
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter city"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode
                      </label>
                      <input 
                        type="text" 
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter pincode"
                      />
                    </div>
                    
                    {/* Notes */ }
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description of your condition
                      </label>
                      <textarea 
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows="3" 
                        placeholder="Please describe your symptoms or the reason for your visit. For example: 'I've been experiencing chest pain for the past 3 days, especially during physical activity.'"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    {editingAppointment && (
                      <button 
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 bg-gray-300 hover:bg-gray-400 text-gray-700"
                      >
                        Cancel
                      </button>
                    )}
                    <button 
                      type="submit"
                      disabled={loading}
                      className={`px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center ${
                        loading 
                          ? 'bg-blue-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {editingAppointment ? 'Updating...' : 'Booking...'}
                        </>
                      ) : (
                        <>
                          <span>📅</span>
                          <span className="ml-2">{editingAppointment ? 'Update Appointment' : 'Book Appointment'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Upcoming Appointments */ }
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-semibold">Upcoming Appointments</h3>
                <div className="mt-2 sm:mt-0">
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="flex justify-center">
                      <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <p className="mt-2 text-gray-600">Loading appointments...</p>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-4">📅</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No upcoming appointments</h3>
                    <p className="text-gray-500">Book your first appointment to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => {
                      const doctor = appointment.doctor && typeof appointment.doctor === 'object' 
                        ? appointment.doctor 
                        : getDoctorById(appointment.doctor);
                      
                      return (
                        <div key={appointment._id} className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start space-x-4">
                            <div className="bg-blue-100 rounded-lg p-3 flex items-center justify-center">
                              <span className="text-2xl">👨‍⚕️</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown Doctor'} - {appointment.department}
                              </p>
                              <p className="text-gray-600">
                                {formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentDate)}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {appointment.notes || 'Regular checkup'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {appointment.status}
                            </span>
                            <div className="flex space-x-1">
                              <button 
                                onClick={() => handleEditAppointment(appointment)}
                                className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleDeleteAppointment(appointment._id)}
                                className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            
            {/* Appointment History */ }
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h3 className="font-semibold">Appointment History</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 rounded-lg p-3 flex items-center justify-center">
                        <span className="text-2xl">👶</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Dr. Emily Rodriguez - Pediatrics</p>
                        <p className="text-gray-600">Friday, May 26, 2023 at 9:00 AM</p>
                        <p className="text-sm text-gray-500 mt-1">Child vaccination</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        Completed
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 rounded-lg p-3 flex items-center justify-center">
                        <span className="text-2xl">🦴</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Dr. James Wilson - Orthopedics</p>
                        <p className="text-gray-600">Tuesday, May 16, 2023 at 3:45 PM</p>
                        <p className="text-sm text-gray-500 mt-1">Knee pain consultation</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'medical-history':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Medical History</h2>
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h3 className="font-semibold">Visit Records</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold">Regular Checkup</p>
                    <p className="text-gray-600">Dr. Smith - January 15, 2024</p>
                    <p className="text-sm text-gray-500">Blood pressure normal, prescribed medication A</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="font-semibold">Follow-up Visit</p>
                    <p className="text-gray-600">Dr. Johnson - December 20, 2023</p>
                    <p className="text-sm text-gray-500">Skin condition improved, continue treatment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'prescriptions':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Prescriptions</h2>
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h3 className="font-semibold">Active Prescriptions</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-semibold">Medication A - 50mg</p>
                      <p className="text-gray-600">Take twice daily with food</p>
                      <p className="text-sm text-gray-500">Prescribed by Dr. Smith</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Medication B - 25mg</p>
                      <p className="text-gray-600">Take once before bedtime</p>
                      <p className="text-sm text-gray-500">Prescribed by Dr. Johnson</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">Expiring Soon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Billing & Payments</h2>
            
            {showPaymentModal && selectedBill && (
              <PaymentModal 
                bill={selectedBill}
                onClose={() => setShowPaymentModal(false)}
                onPaymentSuccess={handlePaymentSuccess}
              />
            )}
            
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h3 className="font-semibold">Recent Bills</h3>
              </div>
              <div className="p-6">
                {bills.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No bills found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bills.map((bill) => (
                      <div key={bill._id} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-semibold">Bill #{bill._id.substring(0, 8)}</p>
                          <p className="text-gray-600">
                            {new Date(bill.createdAt).toLocaleDateString()}
                          </p>
                          {bill.items && bill.items.length > 0 && (
                            <p className="text-sm text-gray-500">
                              {bill.items[0].name}
                              {bill.items.length > 1 && ` +${bill.items.length - 1} more`}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{bill.totalAmount}</p>
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            bill.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : bill.status === 'overdue'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                          </span>
                          {bill.status !== 'paid' && (
                            <button
                              onClick={() => {
                                setSelectedBill(bill);
                                setShowPaymentModal(true);
                              }}
                              className="ml-2 text-blue-600 hover:underline text-sm"
                            >
                              Pay Now
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Methods</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold">UPI</span>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">UPI Payment</h4>
                      <p className="text-sm text-gray-600">Pay using any UPI app</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    <p>Supported apps: PhonePe, Google Pay, Paytm, BHIM, etc.</p>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">BT</span>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">Bank Transfer</h4>
                      <p className="text-sm text-gray-600">Direct bank transfer</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    <p>NEFT, RTGS, or IMPS transfers accepted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
            {editingProfile ? (
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Profile</h3>
                <ProfileEditForm 
                  user={user} 
                  onSave={handleSaveProfile} 
                  onCancel={() => setEditingProfile(false)} 
                />
              </div>
            ) : (
              <div className="bg-white border rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.age}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.role}</p>
                  </div>
                  {user?.address && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <p className="mt-1 text-sm text-gray-900">{user.address.city || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Country</label>
                        <p className="mt-1 text-sm text-gray-900">{user.address.country || 'Not specified'}</p>
                      </div>
                    </>
                  )}
                  {user?.emergencyContact && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Emergency Contact Name</label>
                        <p className="mt-1 text-sm text-gray-900">{user.emergencyContact.name || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Emergency Contact Phone</label>
                        <p className="mt-1 text-sm text-gray-900">{user.emergencyContact.phone || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Relationship</label>
                        <p className="mt-1 text-sm text-gray-900">{user.emergencyContact.relationship || 'Not specified'}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-6">
                  <button 
                    onClick={() => setEditingProfile(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <div>Module not found</div>;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */ }
      <header className="bg-blue-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Patient Dashboard</h1>
              <p className="text-blue-100">Welcome back, {user.firstName} {user.lastName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */ }
          <div className="w-full lg:w-64 bg-white rounded-lg shadow-sm border p-4 mb-6 lg:mb-0 lg:mr-8">
            <nav className="space-y-2">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeModule === module.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{module.icon}</span>
                  <span className="font-medium">{module.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */ }
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {renderModuleContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;