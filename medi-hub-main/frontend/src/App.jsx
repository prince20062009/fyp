import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppContext from "./Context/Context.jsx";
import {
  Navbar,
  Footer,
  HomePage,
  LoginPage,
  SignupPage,
  ErrorPage,
  FaqsPage,
  AboutUsPage,
  PrivacyPolicyPage,
  TermsAndConditionsPage,
  Bot,
} from "./import-export/ImportExport.js";

// Import new dashboard components
import PatientDashboard from "./pages/dashboards/PatientDashboard.jsx";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard.jsx";
import AdminDashboard from "./pages/dashboards/AdminDashboard.jsx";
import RegistrationPage from "./pages/login_signup_page/RegistrationPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <AppContext>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          
          {/* Role-based Dashboard Routes */}
          <Route path="/patient-dashboard" element={
            <ProtectedRoute allowedRoles={['Patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/doctor-dashboard" element={
            <ProtectedRoute allowedRoles={['Doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/*" element={<ErrorPage />} />
          <Route path="/faqs" element={<FaqsPage />} />
          <Route path="/aboutus" element={<AboutUsPage />} />
          <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
          <Route
            path="/termsandconditions"
            element={<TermsAndConditionsPage />}
          />
        </Routes>
        <Bot />
        {/* <GoToTop /> */}
        <Footer />
        <ToastContainer position="top-right" />
      </AppContext>
    </BrowserRouter>
  );
}

export default App;
