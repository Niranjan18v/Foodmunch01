import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Search, Calendar, User, Check, X, CheckSquare, Trash2, ShieldAlert } from 'lucide-react';

const ReservationManager = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReservations = async () => {
    try {
      const data = await apiRequest('/reservations');
      if (data.success) {
        setReservations(data.reservations);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch reservations.');
    }
  };

  const fetchTables = async () => {
    // Only staff/admin need list of tables for assignment
    if (user.role === 'customer') return;
    try {
      const data = await apiRequest('/tables');
      if (data.success) {
        setTables(data.tables);
      }
    } catch (err) {
      console.error('Failed to fetch tables:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchReservations(), fetchTables()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      const data = await apiRequest(`/reservations/${id}/status`, 'PUT', { status });
      if (data.success) {
        setReservations(reservations.map(r => r._id === id ? data.reservation : r));
      }
    } catch (err) {
      alert(err.message || 'Error updating status.');
    }
  };

  const handleTableAssign = async (id, tableId) => {
    try {
      const data = await apiRequest(`/reservations/${id}/status`, 'PUT', { tableId });
      if (data.success) {
        setReservations(reservations.map(r => r._id === id ? data.reservation : r));
      }
    } catch (err) {
      alert(err.message || 'Error assigning table.');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      const data = await apiRequest(`/reservations/${id}/cancel`, 'PUT');
      if (data.success) {
        setReservations(reservations.map(r => r._id === id ? data.reservation : r));
      }
    } catch (err) {
      alert(err.message || 'Error cancelling reservation.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('WARNING: Are you sure you want to permanently delete this reservation record?')) return;
    try {
      const data = await apiRequest(`/reservations/${id}`, 'DELETE');
      if (data.success) {
        setReservations(reservations.filter(r => r._id !== id));
      }
    } catch (err) {
      alert(err.message || 'Error deleting reservation.');
    }
  };

  // Filter logic
  const filteredReservations = reservations.filter(res => {
    const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
    const matchesDate = !dateFilter || res.date === dateFilter;
    
    let matchesSearch = true;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const userName = res.user?.name?.toLowerCase() || '';
      const userEmail = res.user?.email?.toLowerCase() || '';
      const reqs = res.specialRequests?.toLowerCase() || '';
      matchesSearch = userName.includes(query) || userEmail.includes(query) || reqs.includes(query);
    }
    
    return matchesStatus && matchesDate && matchesSearch;
  });

  return (
    <div className="reservation-manager">
      <div className="card-header-flex">
        <h2>{user.role === 'customer' ? 'My Dining Reservations' : 'Manage Bookings'}</h2>
        <span className="text-muted">{filteredReservations.length} records found</span>
      </div>

      {/* Filter Ribbon (only for staff/admin, customer just views) */}
      {user.role !== 'customer' && (
        <div className="filters-ribbon mt-3">
          <div className="form-group-flex">
            <label>Search</label>
            <div className="input-with-icon">
              <Search size={16} className="input-icon" />
              <input 
                type="text" 
                placeholder="Name, email, requests..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group-flex">
            <label>Date</label>
            <input 
              type="date" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <div className="form-group-flex">
            <label>Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      )}

      {/* Main Tables Grid */}
      {loading ? (
        <div className="text-center py-4">Loading reservation records...</div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : filteredReservations.length > 0 ? (
        <div className="table-responsive mt-3">
          <table className="data-table">
            <thead>
              <tr>
                {user.role !== 'customer' && <th>Customer</th>}
                <th>Party Size</th>
                <th>Schedule</th>
                <th>Table</th>
                <th>Special Requests</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((res) => (
                <tr key={res._id}>
                  {user.role !== 'customer' && (
                    <td>
                      <div className="customer-info">
                        <strong>{res.user?.name || 'Valued Guest'}</strong>
                        <span>{res.user?.email || ''}</span>
                        <span>{res.user?.phone || ''}</span>
                      </div>
                    </td>
                  )}
                  <td>
                    <span className="party-badge">{res.guestsCount} Guests</span>
                  </td>
                  <td>
                    <strong>{res.date}</strong>
                    <span className="block text-sm text-muted">{res.timeSlot}</span>
                  </td>
                  <td>
                    {user.role === 'customer' ? (
                      res.table?.number || <span className="text-muted">Unassigned</span>
                    ) : (
                      <select
                        value={res.table?._id || res.table || ''}
                        onChange={(e) => handleTableAssign(res._id, e.target.value)}
                        className="select-sm"
                      >
                        <option value="">-- Assign Table --</option>
                        {tables.map(t => (
                          <option key={t._id} value={t._id}>
                            {t.number} (Cap {t.capacity}) - {t.status}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td>
                    <p className="requests-text">{res.specialRequests || <em className="text-muted">None</em>}</p>
                  </td>
                  <td>
                    <span className={`status-badge ${res.status}`}>
                      {res.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {/* Customer Actions */}
                      {user.role === 'customer' && (res.status === 'pending' || res.status === 'confirmed') && (
                        <button 
                          onClick={() => handleCancel(res._id)} 
                          className="btn btn-sm btn-outline-danger"
                          title="Cancel Booking"
                        >
                          Cancel
                        </button>
                      )}

                      {/* Staff/Admin Actions */}
                      {user.role !== 'customer' && (
                        <>
                          {res.status === 'pending' && (
                            <button
                              onClick={() => handleStatusUpdate(res._id, 'confirmed')}
                              className="btn-action-icon confirm"
                              title="Confirm Reservation"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          
                          {res.status === 'confirmed' && (
                            <button
                              onClick={() => handleStatusUpdate(res._id, 'completed')}
                              className="btn-action-icon complete"
                              title="Mark Completed / Finished"
                            >
                              <CheckSquare size={16} />
                            </button>
                          )}

                          {res.status !== 'cancelled' && res.status !== 'completed' && (
                            <button
                              onClick={() => handleStatusUpdate(res._id, 'cancelled')}
                              className="btn-action-icon cancel"
                              title="Cancel Reservation"
                            >
                              <X size={16} />
                            </button>
                          )}

                          {user.role === 'admin' && (
                            <button
                              onClick={() => handleDelete(res._id)}
                              className="btn-action-icon delete"
                              title="Delete Record"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </>
                      )}

                      {/* Fallback info */}
                      {user.role === 'customer' && res.status === 'completed' && (
                        <span className="text-green text-sm">Visited 🎉</span>
                      )}
                      {user.role === 'customer' && res.status === 'cancelled' && (
                        <span className="text-red text-sm">Cancelled</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-5">
          <p>No reservations matching the current filters.</p>
        </div>
      )}
    </div>
  );
};

export default ReservationManager;
