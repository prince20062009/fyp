import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProfileEditForm from "../../components/ProfileEditForm";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeModule, setActiveModule] = useState('overview');
  // Add state for profile editing
  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'Doctor') {
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

  // Add profile save function
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

  const modules = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'appointments', name: 'Appointments', icon: '📅' },
    { id: 'patients', name: 'My Patients', icon: '👥' },
    { id: 'billing', name: 'Billing', icon: '💰' },
    { id: 'schedule', name: 'Schedule', icon: '🗓️' },
    { id: 'prescriptions', name: 'Prescriptions', icon: '💊' },
    { id: 'profile', name: 'Profile', icon: '👤' }
  ];

  const renderModuleContent = () => {
    switch(activeModule) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900">Today&apos;s Appointments</h3>
                <p className="text-2xl font-bold text-blue-600">8</p>
                <p className="text-sm text-blue-700">Next: 2:00 PM</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900">Active Patients</h3>
                <p className="text-2xl font-bold text-green-600">45</p>
                <p className="text-sm text-green-700">3 new this week</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900">Pending Reviews</h3>
                <p className="text-2xl font-bold text-yellow-600">12</p>
                <p className="text-sm text-yellow-700">Lab results & reports</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900">This Month</h3>
                <p className="text-2xl font-bold text-purple-600">156</p>
                <p className="text-sm text-purple-700">Consultations</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Today&apos;s Schedule</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-gray-600">Regular checkup</p>
                    </div>
                    <span className="text-sm font-medium text-blue-600">10:00 AM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Jane Smith</p>
                      <p className="text-sm text-gray-600">Follow-up visit</p>
                    </div>
                    <span className="text-sm font-medium text-blue-600">2:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Mike Johnson</p>
                      <p className="text-sm text-gray-600">Consultation</p>
                    </div>
                    <span className="text-sm font-medium text-blue-600">4:30 PM</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Activities</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Prescribed medication for John Doe</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Updated patient record for Jane Smith</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Reviewed lab results</p>
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'appointments':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
              <div className="flex space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Set Availability
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Emergency Slot
                </button>
              </div>
            </div>
            
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h3 className="font-semibold">Today&apos;s Appointments</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">JD</span>
                      </div>
                      <div>
                        <p className="font-semibold">John Doe</p>
                        <p className="text-gray-600">Regular checkup</p>
                        <p className="text-sm text-gray-500">Age: 45, Male</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">10:00 AM</p>
                      <div className="flex space-x-2 mt-2">
                        <button className="text-blue-600 hover:underline text-sm">View History</button>
                        <button className="text-green-600 hover:underline text-sm">Start Consultation</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                        <span className="text-pink-600 font-semibold">JS</span>
                      </div>
                      <div>
                        <p className="font-semibold">Jane Smith</p>
                        <p className="text-gray-600">Follow-up visit</p>
                        <p className="text-sm text-gray-500">Age: 32, Female</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">2:00 PM</p>
                      <div className="flex space-x-2 mt-2">
                        <button className="text-blue-600 hover:underline text-sm">View History</button>
                        <button className="text-green-600 hover:underline text-sm">Start Consultation</button>
                      </div>
                    </div>
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
              <h2 className="text-2xl font-bold text-gray-900">My Patients</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Add Patient
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-semibold">JD</span>
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">John Doe</p>
                            <p className="text-sm text-gray-500">john.doe@email.com</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">45</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Jan 15, 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Hypertension</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:underline mr-3">View</button>
                        <button className="text-green-600 hover:underline">Edit</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                            <span className="text-pink-600 text-sm font-semibold">JS</span>
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">Jane Smith</p>
                            <p className="text-sm text-gray-500">jane.smith@email.com</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">32</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Jan 10, 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Diabetes</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:underline mr-3">View</button>
                        <button className="text-green-600 hover:underline">Edit</button>
                      </td>
                    </tr>
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
              <button 
                onClick={() => setActiveModule('create-bill')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Create New Bill
              </button>
            </div>
            
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h3 className="font-semibold">Recent Bills</h3>
              </div>
              <div className="p-6">
                <div className="text-center py-8 text-gray-500">
                  <p>No bills created yet.</p>
                  <button 
                    onClick={() => setActiveModule('create-bill')}
                    className="mt-4 text-blue-600 hover:underline"
                  >
                    Create your first bill
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'create-bill':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Create New Bill</h2>
              <button 
                onClick={() => setActiveModule('billing')}
                className="text-gray-600 hover:underline"
              >
                ← Back to Billing
              </button>
            </div>
            
            <div className="bg-white border rounded-lg p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Patient ID</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter patient ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Appointment ID (Optional)</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter appointment ID"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="3"
                    placeholder="Enter diagnosis details"
                  ></textarea>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Bill Items</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      <div className="md:col-span-4">
                        <label className="block text-sm font-medium text-gray-700">Item Name</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="Medicine/Service name"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="Description"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input
                          type="number"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="Qty"
                          min="1"
                          defaultValue="1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Unit Price ($)</label>
                        <input
                          type="number"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <button className="text-red-600 hover:text-red-800">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  <button className="mt-2 text-blue-600 hover:underline">
                    + Add Another Item
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tax ($)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Discount ($)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date (Optional)</label>
                    <input
                      type="date"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="2"
                    placeholder="Additional notes"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setActiveModule('billing')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Bill
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      case 'schedule':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Schedule</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Update Availability
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">This Week&apos;s Schedule</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">Monday</span>
                    <span className="text-sm text-gray-600">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">Tuesday</span>
                    <span className="text-sm text-gray-600">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">Wednesday</span>
                    <span className="text-sm text-red-600">Off</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">Thursday</span>
                    <span className="text-sm text-gray-600">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Friday</span>
                    <span className="text-sm text-gray-600">9:00 AM - 3:00 PM</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Availability Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Consultation Duration</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>30 minutes</option>
                      <option>45 minutes</option>
                      <option>60 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Break Between Appointments</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>10 minutes</option>
                      <option>15 minutes</option>
                      <option>20 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Allow emergency appointments</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Doctor Profile</h2>
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
                    <label className="block text-sm font-medium text-gray-700">Specialty</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.specialty || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.department || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">License Number</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.licenseNumber || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Experience</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.experience ? `${user.experience} years` : 'Not specified'}</p>
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
                  {user?.specializations && user.specializations.length > 0 && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Specializations</label>
                      <p className="mt-1 text-sm text-gray-900">{user.specializations.join(", ")}</p>
                    </div>
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
              <p className="text-gray-600">Dr. {user.firstName} {user.lastName} - {user.specialty}</p>
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

export default DoctorDashboard;