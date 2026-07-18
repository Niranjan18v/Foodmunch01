import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, Phone } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer' // Always customer — admins are created by other admins
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await register(formData.name, formData.email, formData.password, formData.phone, 'customer');
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-wrap">
            <UserPlus size={28} className="auth-header-icon" />
          </div>
          <h2>Create Account</h2>
          <p>Join FoodMunch and start booking your tables online</p>
        </div>

        {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input type="text" id="name" name="name" value={formData.name}
                onChange={handleChange} placeholder="Jane Doe" required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input type="email" id="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="you@example.com" required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <div className="input-with-icon">
              <Phone size={18} className="input-icon" />
              <input type="tel" id="phone" name="phone" value={formData.phone}
                onChange={handleChange} placeholder="+91 98765 43210" required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input type="password" id="password" name="password" value={formData.password}
                onChange={handleChange} placeholder="Minimum 6 characters" minLength="6" required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg mt-3" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
