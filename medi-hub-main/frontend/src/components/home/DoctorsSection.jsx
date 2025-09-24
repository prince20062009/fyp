import { useState, useEffect } from "react";
import { api } from "../../import-export/ImportExport";

function DoctorsSection() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.getAllDoctors();
      setDoctors(response.data || []);
    } catch (err) {
      setError("Failed to fetch doctors");
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to determine if a doctor is "active" (for demo purposes)
  const isActiveDoctor = (doctor) => {
    // In a real application, this would check actual availability/online status
    // For now, we'll simulate with some doctors being active based on their ID
    const doctorId = doctor._id || "";
    const lastChar = doctorId.slice(-1);
    // Doctors with IDs ending in 1, 3, or 5 are considered active
    return ["1", "3", "5"].includes(lastChar);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Doctors</h2>
            <p className="mt-4 text-lg text-gray-600">Meet our experienced medical professionals</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchDoctors}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Doctors</h2>
          <p className="mt-4 text-lg text-gray-600">Meet our experienced medical professionals</p>
        </div>
        
        {doctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No doctors available at the moment.</p>
            <p className="text-gray-500 mt-2">Please check back later or contact admin to add doctors.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                    <div className="bg-white border-2 border-dashed rounded-xl w-32 h-32 flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  {isActiveDoctor(doctor) && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                      <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
                      Active
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h3>
                  <p className="text-blue-600 font-medium mt-1">{doctor.department}</p>
                  <p className="text-gray-600 mt-2">
                    {doctor.specializations && doctor.specializations.length > 0 
                      ? doctor.specializations.join(", ") 
                      : "General Practitioner"}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {doctor.experience || 0} years exp
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default DoctorsSection;