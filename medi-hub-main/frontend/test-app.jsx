import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './src/pages/login_signup_page/LoginPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TestApp() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default TestApp;