import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';
import { Calendar, Users, Clock, AlignLeft, CheckCircle } from 'lucide-react';

const BookTable = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const todayStr = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    date: todayStr,
    timeSlot: '19:00',
    guestsCount: 2,
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const timeSlots = [
    '11:00', '12:00', '13:00', '14:00', '15:00', 
    '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessData(null);

    try {
      const data = await apiRequest('/reservations', 'POST', {
        ...formData,
        guestsCount: parseInt(formData.guestsCount, 10)
      });
      if (data.success) {
        setSuccessData(data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit reservation.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="book-page auth-prompt-container container">
        <div className="auth-prompt-card text-center">
          <Calendar size={60} className="prompt-icon mb-3" />
          <h2>Reserve Your Table</h2>
          <p>
            To book a table, manage your reservations, and receive confirmation updates, please log in to your FoodMunch account.
          </p>
          <div className="prompt-actions">
            <Link to="/login" className="btn btn-primary">Log In Now</Link>
            <Link to="/register" className="btn btn-outline">Create Account</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-page container">
      <div className="book-header text-center">
        <span className="section-label">RESERVATION SYSTEM</span>
        <h2>Book Your Dining Table</h2>
        <p>Choose your date, time, and party size. We'll handle the rest.</p>
      </div>

      <div className="booking-layout">
        {successData ? (
          <div className="booking-success text-center">
            <div className="success-icon-wrap">
              <CheckCircle size={56} className="success-icon" />
            </div>
            <h2>Reservation Submitted!</h2>
            <p className="success-message">{successData.message}</p>
            
            <div className="reservation-summary-card">
              <h3>Booking Details</h3>
              <ul className="summary-list">
                <li><span>Date:</span> <strong>{successData.reservation.date}</strong></li>
                <li><span>Time:</span> <strong>{successData.reservation.timeSlot}</strong></li>
                <li><span>Guests:</span> <strong>{successData.reservation.guestsCount} People</strong></li>
                <li>
                  <span>Assigned Table:</span> 
                  <strong>
                    {successData.reservation.table?.number 
                      ? successData.reservation.table.number 
                      : 'Pending (Assigned at arrival)'}
                  </strong>
                </li>
                <li><span>Status:</span> <span className="status-badge pending">Pending Confirmation</span></li>
              </ul>
            </div>

            <div className="success-actions mt-4">
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
              <button 
                onClick={() => setSuccessData(null)} 
                className="btn btn-outline ml-3"
              >
                Book Another Table
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 0' }}>
            <div className="booking-form-card" style={{ maxWidth: '600px', width: '100%', margin: '0 auto' }}>
              <h3 style={{ textAlign: 'center' }}>Reservation Details</h3>
              {errorMsg && (
                <div className="alert alert-error">
                  {errorMsg}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="booking-form">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label htmlFor="date">Select Date</label>
                    <div className="input-with-icon">
                      <Calendar size={18} className="input-icon" />
                      <input
                        type="date"
                        id="date"
                        name="date"
                        min={todayStr}
                        value={formData.date}
                        onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="timeSlot">Time Slot</label>
                  <div className="input-with-icon">
                    <Clock size={18} className="input-icon" />
                    <select
                      id="timeSlot"
                      name="timeSlot"
                      value={formData.timeSlot}
                      onChange={handleChange}
                      required
                    >
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="guestsCount">Number of Guests</label>
                <div className="input-with-icon">
                  <Users size={18} className="input-icon" />
                  <input
                    type="number"
                    id="guestsCount"
                    name="guestsCount"
                    min="1"
                    max="20"
                    value={formData.guestsCount}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="specialRequests">Special Requests (Optional)</label>
                <div className="input-with-icon">
                  <AlignLeft size={18} className="input-icon textarea-icon" />
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    rows="3"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    placeholder="E.g., Window seat, dietary requirements, high chair for baby..."
                  ></textarea>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-block btn-lg mt-3"
                disabled={loading}
              >
                {loading ? 'Submitting Request...' : 'Confirm Reservation'}
              </button>
            </form>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default BookTable;
