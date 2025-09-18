import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      
      if (!userData) {
        navigate('/login');
        return;
      }

      try {
        const user = JSON.parse(userData);
        
        if (allowedRoles && !allowedRoles.includes(user.role)) {
          // Redirect to appropriate dashboard based on role
          switch(user.role) {
            case 'Patient':
              navigate('/patient-dashboard');
              break;
            case 'Doctor':
              navigate('/doctor-dashboard');
              break;
            case 'Admin':
              navigate('/admin-dashboard');
              break;
            default:
              navigate('/login');
          }
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect, so don't render anything
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute;