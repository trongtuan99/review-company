import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CompanyDetail from './pages/CompanyDetail';
import AllCompanies from './pages/AllCompanies';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Profile from './pages/Profile';
import { API_BASE_URL } from './config/api';
import './App.css';

function App() {
  const isDevelopment = import.meta.env.DEV;

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
              <Route path="/companies" element={<AllCompanies />} />
              <Route path="/companies/:id" element={<CompanyDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          {isDevelopment && (
            <div style={{
              position: 'fixed',
              bottom: '10px',
              right: '10px',
              background: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '5px',
              padding: '8px 12px',
              fontSize: '11px',
              color: '#666',
              zIndex: 1000,
              maxWidth: '300px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <strong>API URL:</strong><br />
              <code style={{ fontSize: '10px', wordBreak: 'break-all' }}>{API_BASE_URL}</code>
            </div>
          )}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
