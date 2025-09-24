import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addDoctor, getAllDoctors, getAllAppointmentsAdmin, getAllPatients, bookAppointment, getAllBillsAdmin, createBill } from "../../utils/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeModule, setActiveModule] = useState('overview');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [bills, setBills] = useState([]);
  const [showAddDoctorForm, setShowAddDoctorForm] = useState(false);
  const [showAddAppointmentForm, setShowAddAppointmentForm] = useState(false);
  const [showAddBillForm, setShowAddBillForm] = useState(false);
  const [doctorFormData, setDoctorFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    password: '',
    department: '',
    specializations: '',
    experience: ''
  });
  const [appointmentFormData, setAppointmentFormData] = useState({
    patient: '',
    doctor: '',
    appointmentDate: '',
    appointmentTime: '',
    department: '',
    city: '',
    pincode: '',
    notes: ''
  });
  const [billFormData, setBillFormData] = useState({
    patient: '',
    appointment: '',
    items: [{ name: '', description: '', quantity: 1, unitPrice: 0 }],
    tax: 0,
    discount: 0,
    notes: '',
    dueDate: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'Admin') {
        setUser(parsedUser);
        if (activeModule === 'doctors') {
          fetchDoctors();
        } else if (activeModule === 'appointments') {
          fetchAppointments();
          fetchPatients(); // Fetch patients when on appointments page
        } else if (activeModule === 'patients') {
          fetchPatients();
        } else if (activeModule === 'overview') {
          fetchDoctors();
          fetchPatients();
          fetchAppointments();
        } else if (activeModule === 'billing') {
          fetchBills();
          fetchPatients();
        }
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate, activeModule]);

  const fetchDoctors = async () => {
    try {
      const response = await getAllDoctors();
      setDoctors(response.data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch doctors');
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await getAllPatients();
      setPatients(response.data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch patients');
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await getAllAppointmentsAdmin();
      setAppointments(response.data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch appointments');
    }
  };

  const fetchBills = async () => {
    try {
      const response = await getAllBillsAdmin();
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

  const handleDoctorFormChange = (e) => {
    const { name, value } = e.target;
    setDoctorFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAppointmentFormChange = (e) => {
    const { name, value } = e.target;
    setAppointmentFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBillFormChange = (e) => {
    const { name, value } = e.target;
    setBillFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBillItemChange = (index, field, value) => {
    const updatedItems = [...billFormData.items];
    updatedItems[index][field] = value;
    setBillFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addBillItem = () => {
    setBillFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', description: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeBillItem = (index) => {
    if (billFormData.items.length > 1) {
      const updatedItems = [...billFormData.items];
      updatedItems.splice(index, 1);
      setBillFormData(prev => ({
        ...prev,
        items: updatedItems
      }));
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      // Process specializations array
      const doctorData = {
        ...doctorFormData,
        specializations: doctorFormData.specializations.split(',').map(s => s.trim()).filter(s => s)
      };
      
      await addDoctor(doctorData);
      toast.success('Doctor added successfully!');
      setShowAddDoctorForm(false);
      setDoctorFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        password: '',
        department: '',
        specializations: '',
        experience: ''
      });
      fetchDoctors(); // Refresh the doctors list
    } catch (error) {
      toast.error(error.message || 'Failed to add doctor');
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!appointmentFormData.patient || !appointmentFormData.doctor || 
        !appointmentFormData.appointmentDate || !appointmentFormData.appointmentTime || 
        !appointmentFormData.department) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Combine date and time
    const combinedDateTime = `${appointmentFormData.appointmentDate}T${appointmentFormData.appointmentTime}:00`;
    
    const appointmentData = {
      patient: appointmentFormData.patient,
      doctor: appointmentFormData.doctor,
      appointmentDate: combinedDateTime,
      department: appointmentFormData.department,
      city: appointmentFormData.city,
      pincode: appointmentFormData.pincode,
      notes: appointmentFormData.notes
    };

    try {
      await bookAppointment(appointmentData);
      toast.success('Appointment created successfully!');
      setShowAddAppointmentForm(false);
      setAppointmentFormData({
        patient: '',
        doctor: '',
        appointmentDate: '',
        appointmentTime: '',
        department: '',
        city: '',
        pincode: '',
        notes: ''
      });
      fetchAppointments(); // Refresh the appointments list
    } catch (error) {
      toast.error(error.message || 'Failed to create appointment');
    }
  };

  const handleAddBill = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!billFormData.patient || !billFormData.items || billFormData.items.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Validate items
    for (let i = 0; i < billFormData.items.length; i++) {
      const item = billFormData.items[i];
      if (!item.name || item.quantity <= 0 || item.unitPrice <= 0) {
        toast.error(`Please fill in all required fields for item ${i + 1}`);
        return;
      }
    }

    try {
      const billData = {
        patient: billFormData.patient,
        appointment: billFormData.appointment || null,
        items: billFormData.items,
        tax: parseFloat(billFormData.tax) || 0,
        discount: parseFloat(billFormData.discount) || 0,
        notes: billFormData.notes,
        dueDate: billFormData.dueDate || null
      };

      await createBill(billData);
      toast.success('Bill created successfully!');
      setShowAddBillForm(false);
      setBillFormData({
        patient: '',
        appointment: '',
        items: [{ name: '', description: '', quantity: 1, unitPrice: 0 }],
        tax: 0,
        discount: 0,
        notes: '',
        dueDate: ''
      });
      fetchBills(); // Refresh the bills list
    } catch (error) {
      toast.error(error.message || 'Failed to create bill');
    }
  };

  const modules = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'patients', name: 'Patient Management', icon: '👥' },
    { id: 'doctors', name: 'Doctor Management', icon: '👨‍⚕️' },
    { id: 'appointments', name: 'Appointments', icon: '📅' },
    { id: 'billing', name: 'Billing & Payments', icon: '💳' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈' },
    { id: 'settings', name: 'System Settings', icon: '⚙️' }
  ];

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

  const renderModuleContent = () => {
    switch(activeModule) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900">Total Patients</h3>
                <p className="text-2xl font-bold text-blue-600">{patients.length || 0}</p>
                <p className="text-sm text-blue-700">+12 this week</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900">Active Doctors</h3>
                <p className="text-2xl font-bold text-green-600">{doctors.length || 0}</p>
                <p className="text-sm text-green-700">3 on duty now</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900">Today&apos;s Appointments</h3>
                <p className="text-2xl font-bold text-yellow-600">{appointments.length || 0}</p>
                <p className="text-sm text-yellow-700">23 pending</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900">Monthly Revenue</h3>
                <p className="text-2xl font-bold text-purple-600">$45,320</p>
                <p className="text-sm text-purple-700">+8% from last month</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Activities</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">New doctor registered: Dr. Sarah Wilson</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">System backup completed successfully</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Monthly report generated</p>
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Payment Gateway</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Email Service</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Running</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Backup System</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Scheduled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'patients':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Patient Management</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Add Patient
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Export Data
                </button>
              </div>
            </div>
            
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patients.map((patient) => (
                      <tr key={patient._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-sm font-semibold">
                                {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                              <p className="text-sm text-gray-500">{patient.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.age}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Jan 15, 2024</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:underline mr-3">View</button>
                          <button className="text-green-600 hover:underline mr-3">Edit</button>
                          <button className="text-red-600 hover:underline">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'doctors':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Doctor Management</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search doctors..."
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
                <button 
                  onClick={() => setShowAddDoctorForm(!showAddDoctorForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {showAddDoctorForm ? 'Cancel' : 'Add New Doctor'}
                </button>
              </div>
            </div>
            
            {/* Add Doctor Form - Moved to top when visible */}
            {showAddDoctorForm && (
              <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold mb-4 text-blue-700">Add New Doctor</h3>
                
                <form onSubmit={handleAddDoctor} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={doctorFormData.firstName}
                        onChange={handleDoctorFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={doctorFormData.lastName}
                        onChange={handleDoctorFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={doctorFormData.email}
                        onChange={handleDoctorFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={doctorFormData.phone}
                        onChange={handleDoctorFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={doctorFormData.dob}
                        onChange={handleDoctorFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gender</label>
                      <select
                        name="gender"
                        value={doctorFormData.gender}
                        onChange={handleDoctorFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={doctorFormData.password}
                        onChange={handleDoctorFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Department</label>
                      <input
                        type="text"
                        name="department"
                        value={doctorFormData.department}
                        onChange={handleDoctorFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
                      <input
                        type="number"
                        name="experience"
                        value={doctorFormData.experience}
                        onChange={handleDoctorFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Specializations (comma separated)</label>
                      <input
                        type="text"
                        name="specializations"
                        value={doctorFormData.specializations}
                        onChange={handleDoctorFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Cardiology, Emergency Medicine"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddDoctorForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add Doctor
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Doctors List */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {doctors.map((doctor) => (
                      <tr key={doctor._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 text-sm font-semibold">
                                {doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">Dr. {doctor.firstName} {doctor.lastName}</p>
                              <p className="text-sm text-gray-500">{doctor.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.specializations && doctor.specializations.length > 0 
                            ? doctor.specializations.join(", ") 
                            : "General Practitioner"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="font-medium">{doctor.experience || 0}</span> years
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:underline mr-3">View</button>
                          <button className="text-green-600 hover:underline mr-3">Edit</button>
                          <button className="text-yellow-600 hover:underline">Suspend</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'appointments':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Appointment Management</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
                <button 
                  onClick={() => setShowAddAppointmentForm(!showAddAppointmentForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {showAddAppointmentForm ? 'Cancel' : 'Create Appointment'}
                </button>
              </div>
            </div>
            
            {/* Add Appointment Form */}
            {showAddAppointmentForm && (
              <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold mb-4 text-blue-700">Create New Appointment</h3>
                
                <form onSubmit={handleAddAppointment} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Patient <span className="text-red-500">*</span></label>
                      <select
                        name="patient"
                        value={appointmentFormData.patient}
                        onChange={handleAppointmentFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Patient</option>
                        {patients.map(patient => (
                          <option key={patient._id} value={patient._id}>
                            {patient.firstName} {patient.lastName} ({patient.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Doctor <span className="text-red-500">*</span></label>
                      <select
                        name="doctor"
                        value={appointmentFormData.doctor}
                        onChange={handleAppointmentFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Doctor</option>
                        {doctors.map(doctor => (
                          <option key={doctor._id} value={doctor._id}>
                            Dr. {doctor.firstName} {doctor.lastName} - {doctor.department}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Department <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="department"
                        value={appointmentFormData.department}
                        onChange={handleAppointmentFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Cardiology"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date & Time <span className="text-red-500">*</span></label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          name="appointmentDate"
                          value={appointmentFormData.appointmentDate}
                          onChange={handleAppointmentFormChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        <input
                          type="time"
                          name="appointmentTime"
                          value={appointmentFormData.appointmentTime}
                          onChange={handleAppointmentFormChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">City</label>
                      <input
                        type="text"
                        name="city"
                        value={appointmentFormData.city}
                        onChange={handleAppointmentFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., New York"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={appointmentFormData.pincode}
                        onChange={handleAppointmentFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 10001"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea
                        name="notes"
                        value={appointmentFormData.notes}
                        onChange={handleAppointmentFormChange}
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Additional notes about the appointment"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddAppointmentForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Create Appointment
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Appointments List */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pincode</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map((appointment) => (
                      <tr key={appointment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-sm font-semibold">
                                {appointment.patient.firstName.charAt(0)}{appointment.patient.lastName.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">{appointment.patient.firstName} {appointment.patient.lastName}</p>
                              <p className="text-sm text-gray-500">{appointment.patient.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 text-sm font-semibold">
                                {appointment.doctor.firstName.charAt(0)}{appointment.doctor.lastName.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}</p>
                              <p className="text-sm text-gray-500">{appointment.doctor.department}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.city}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.pincode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.notes}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Scheduled</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:underline mr-3">View</button>
                          <button className="text-green-600 hover:underline mr-3">Edit</button>
                          <button className="text-red-600 hover:underline">Cancel</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Billing Management</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search bills..."
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
                <button 
                  onClick={() => setShowAddBillForm(!showAddBillForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {showAddBillForm ? 'Cancel' : 'Create Bill'}
                </button>
              </div>
            </div>
            
            {/* Add Bill Form */}
            {showAddBillForm && (
              <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold mb-4 text-blue-700">Create New Bill</h3>
                
                <form onSubmit={handleAddBill} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Patient <span className="text-red-500">*</span></label>
                      <select
                        name="patient"
                        value={billFormData.patient}
                        onChange={handleBillFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Patient</option>
                        {patients.map(patient => (
                          <option key={patient._id} value={patient._id}>
                            {patient.firstName} {patient.lastName} ({patient.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Appointment (Optional)</label>
                      <select
                        name="appointment"
                        value={billFormData.appointment}
                        onChange={handleBillFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Appointment</option>
                        {appointments.map(appointment => (
                          <option key={appointment._id} value={appointment._id}>
                            {appointment.patient.firstName} {appointment.patient.lastName} - 
                            Dr. {appointment.doctor.firstName} {appointment.doctor.lastName} - 
                            {new Date(appointment.appointmentDate).toLocaleDateString()}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Bill Items</label>
                      <div className="mt-2 space-y-3">
                        {billFormData.items.map((item, index) => (
                          <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
                            <div className="md:col-span-3">
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleBillItemChange(index, 'name', e.target.value)}
                                placeholder="Item name"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                            </div>
                            <div className="md:col-span-3">
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => handleBillItemChange(index, 'description', e.target.value)}
                                placeholder="Description"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleBillItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                                placeholder="Qty"
                                min="1"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                            </div>
                            <div className="md:col-span-2">
                              <input
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) => handleBillItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                placeholder="Unit Price"
                                step="0.01"
                                min="0"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                            </div>
                            <div className="md:col-span-2">
                              <button
                                type="button"
                                onClick={() => removeBillItem(index)}
                                className="text-red-600 hover:text-red-800"
                                disabled={billFormData.items.length <= 1}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addBillItem}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          + Add Item
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tax</label>
                      <input
                        type="number"
                        name="tax"
                        value={billFormData.tax}
                        onChange={handleBillFormChange}
                        step="0.01"
                        min="0"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Discount</label>
                      <input
                        type="number"
                        name="discount"
                        value={billFormData.discount}
                        onChange={handleBillFormChange}
                        step="0.01"
                        min="0"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Due Date</label>
                      <input
                        type="date"
                        name="dueDate"
                        value={billFormData.dueDate}
                        onChange={handleBillFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea
                        name="notes"
                        value={billFormData.notes}
                        onChange={handleBillFormChange}
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Additional notes about the bill"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddBillForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Create Bill
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Bills List */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bills.map((bill) => (
                      <tr key={bill._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #{bill._id.substring(0, 8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-sm font-semibold">
                                {bill.patient.firstName.charAt(0)}{bill.patient.lastName.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">{bill.patient.firstName} {bill.patient.lastName}</p>
                              <p className="text-sm text-gray-500">{bill.patient.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {bill.items && bill.items.length > 0 ? (
                            <div>
                              <p>{bill.items[0].name}</p>
                              {bill.items.length > 1 && (
                                <p className="text-xs text-gray-500">+{bill.items.length - 1} more</p>
                              )}
                            </div>
                          ) : 'No items'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{bill.totalAmount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            bill.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : bill.status === 'overdue'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:underline mr-3">View</button>
                          <button className="text-green-600 hover:underline mr-3">Edit</button>
                          <button className="text-red-600 hover:underline">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Financial Reports</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                    <p className="font-medium">Monthly Revenue Report</p>
                    <p className="text-sm text-gray-600">Last updated: Today</p>
                  </button>
                  <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                    <p className="font-medium">Payment Collection Summary</p>
                    <p className="text-sm text-gray-600">Last updated: Yesterday</p>
                  </button>
                  <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                    <p className="font-medium">Insurance Claims Report</p>
                    <p className="text-sm text-gray-600">Last updated: 2 days ago</p>
                  </button>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Patient Analytics</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                    <p className="font-medium">Patient Demographics</p>
                    <p className="text-sm text-gray-600">Age, gender, location analysis</p>
                  </button>
                  <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                    <p className="font-medium">Treatment Outcomes</p>
                    <p className="text-sm text-gray-600">Success rates by department</p>
                  </button>
                  <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                    <p className="font-medium">Appointment Trends</p>
                    <p className="text-sm text-gray-600">Peak hours and seasons</p>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">System Logs</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span>User login: admin@hospital.com</span>
                  <span className="text-gray-500">2 hours ago</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span>Database backup completed</span>
                  <span className="text-gray-500">4 hours ago</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span>New patient registered</span>
                  <span className="text-gray-500">6 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
                    <input
                      type="text"
                      defaultValue="City Medical Center"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time Zone</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC-6 (Central Time)</option>
                      <option>UTC-7 (Mountain Time)</option>
                      <option>UTC-8 (Pacific Time)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Enable two-factor authentication</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Force password reset every 90 days</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Enable login notifications</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Session timeout (minutes)</label>
                    <input
                      type="number"
                      defaultValue="30"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Backup & Maintenance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Run Backup Now
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  System Health Check
                </button>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
                  Clear Cache
                </button>
              </div>
            </div>
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
      {/* Header */}
      <header className="bg-blue-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
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
          {/* Sidebar */}
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

          {/* Main Content */}
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

export default AdminDashboard;