import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function PatientDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeModule, setActiveModule] = useState('overview');

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

  const renderModuleContent = () => {
    switch(activeModule) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900">Upcoming Appointments</h3>
                <p className="text-2xl font-bold text-blue-600">2</p>
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
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Book New Appointment
              </button>
            </div>
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h3 className="font-semibold">Upcoming Appointments</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-semibold">Dr. Smith - Cardiology</p>
                      <p className="text-gray-600">Tomorrow, 10:00 AM</p>
                      <p className="text-sm text-gray-500">Regular checkup</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:underline">Reschedule</button>
                      <button className="text-red-600 hover:underline">Cancel</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Dr. Johnson - Dermatology</p>
                      <p className="text-gray-600">Next Week, 2:30 PM</p>
                      <p className="text-sm text-gray-500">Skin consultation</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:underline">Reschedule</button>
                      <button className="text-red-600 hover:underline">Cancel</button>
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
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h3 className="font-semibold">Recent Bills</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-semibold">Consultation Fee - Dr. Smith</p>
                      <p className="text-gray-600">January 15, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">$100</p>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">Pending</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Lab Tests</p>
                      <p className="text-gray-600">December 20, 2023</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">$50</p>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Paid</span>
                    </div>
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
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <p className="mt-1 text-sm text-gray-900">{user?.role}</p>
                </div>
              </div>
              <div className="mt-6">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Edit Profile
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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.firstName} {user.lastName}</p>
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
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm border p-4 h-fit">
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
          <div className="flex-1 ml-8">
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