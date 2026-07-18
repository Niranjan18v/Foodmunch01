import React from 'react';
import { Calendar, Users, Star, Layers, Activity, FileText } from 'lucide-react';

const DashboardOverview = ({ stats, recentReservations, onTabChange }) => {
  return (
    <div className="dashboard-overview">
      {/* Metrics Cards Grid */}
      <div className="metrics-grid">
        <div className="metric-card shadow-sm">
          <div className="metric-icon-wrap bg-blue-light text-blue">
            <Calendar size={22} />
          </div>
          <div className="metric-details">
            <h3>{stats.totalReservations || 0}</h3>
            <p>Total Reservations</p>
          </div>
          <div className="metric-indicator text-blue">
            {stats.todayReservations || 0} today
          </div>
        </div>

        <div className="metric-card shadow-sm">
          <div className="metric-icon-wrap bg-amber-light text-amber">
            <Activity size={22} />
          </div>
          <div className="metric-details">
            <h3>{stats.pendingReservations || 0}</h3>
            <p>Pending Review</p>
          </div>
          <div className="metric-indicator text-amber">
            Action needed
          </div>
        </div>

        <div className="metric-card shadow-sm">
          <div className="metric-icon-wrap bg-green-light text-green">
            <Layers size={22} />
          </div>
          <div className="metric-details">
            <h3>{stats.availableTables || 0} / {stats.totalTables || 0}</h3>
            <p>Available Tables</p>
          </div>
          <div className="metric-indicator text-green">
            Ready to seat
          </div>
        </div>

        <div className="metric-card shadow-sm">
          <div className="metric-icon-wrap bg-gold-light text-gold">
            <Star size={22} />
          </div>
          <div className="metric-details">
            <h3>{stats.avgRating || '0.0'}</h3>
            <p>Average Rating</p>
          </div>
          <div className="metric-indicator text-gold">
            {stats.reviewsCount || 0} reviews
          </div>
        </div>
      </div>

      {/* Main Section split: Recent activity & quick links */}
      <div className="overview-split mt-4">
        <div className="card shadow-sm recent-bookings-card">
          <div className="card-header-flex">
            <h2>Recent Reservation Requests</h2>
            <button 
              className="btn btn-sm btn-outline"
              onClick={() => onTabChange('reservations')}
            >
              Manage All
            </button>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Guests</th>
                  <th>Date & Time</th>
                  <th>Table</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations && recentReservations.length > 0 ? (
                  recentReservations.map((res) => (
                    <tr key={res._id}>
                      <td>
                        <div className="customer-info">
                          <strong>{res.user?.name || 'Guest'}</strong>
                          <span>{res.user?.email || ''}</span>
                        </div>
                      </td>
                      <td>{res.guestsCount} People</td>
                      <td>
                        <strong>{res.date}</strong>
                        <span className="block text-sm text-muted">{res.timeSlot}</span>
                      </td>
                      <td>{res.table?.number || <span className="text-amber">Not Assigned</span>}</td>
                      <td>
                        <span className={`status-badge ${res.status}`}>
                          {res.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">No recent reservations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
