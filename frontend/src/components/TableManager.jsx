import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit2, RotateCcw, AlertTriangle } from 'lucide-react';

const TableManager = () => {
  const { user } = useAuth();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [newTable, setNewTable] = useState({ number: '', capacity: 2, status: 'available' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchTables = async () => {
    try {
      const data = await apiRequest('/tables');
      if (data.success) {
        setTables(data.tables);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch tables.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const data = await apiRequest(`/tables/${id}`, 'PUT', { status });
      if (data.success) {
        setTables(tables.map(t => t._id === id ? data.table : t));
      }
    } catch (err) {
      alert(err.message || 'Error updating status.');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTable.number.trim()) return;

    setFormLoading(true);
    setFormError('');

    try {
      const data = await apiRequest('/tables', 'POST', {
        ...newTable,
        capacity: parseInt(newTable.capacity, 10)
      });
      if (data.success) {
        setTables([...tables, data.table]);
        setNewTable({ number: '', capacity: 2, status: 'available' });
      }
    } catch (err) {
      setFormError(err.message || 'Failed to create table.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this table?')) return;
    try {
      const data = await apiRequest(`/tables/${id}`, 'DELETE');
      if (data.success) {
        setTables(tables.filter(t => t._id !== id));
      }
    } catch (err) {
      alert(err.message || 'Error deleting table.');
    }
  };

  return (
    <div className="table-manager">
      <div className="manager-grid">
        {/* Left Side: Tables Grid */}
        <div className="tables-list-column">
          <div className="card-header-flex">
            <h2>Restaurant Tables</h2>
            <span className="badge">{tables.length} Tables</span>
          </div>

          {loading ? (
            <div className="text-center py-4">Loading tables...</div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : tables.length > 0 ? (
            <div className="table-cards-grid mt-3">
              {tables.map(table => (
                <div key={table._id} className={`table-card-item shadow-sm ${table.status}`}>
                  <div className="table-card-top">
                    <span className="table-number">{table.number}</span>
                    <span className="table-capacity">{table.capacity} Seats</span>
                  </div>
                  
                  <div className="table-status-selector mt-3">
                    <label>Current Status</label>
                    <select
                      value={table.status}
                      onChange={(e) => handleStatusChange(table._id, e.target.value)}
                      className="select-sm"
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="occupied">Occupied</option>
                    </select>
                  </div>

                  {user.role === 'admin' && (
                    <div className="table-card-actions mt-3">
                      <button
                        onClick={() => handleDelete(table._id)}
                        className="btn btn-sm btn-outline-danger btn-block"
                      >
                        <Trash2 size={14} className="inline-icon" />
                        <span>Delete Table</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <p>No tables configured. Please add some tables to enable bookings.</p>
            </div>
          )}
        </div>

        {/* Right Side: Create Table Form (Admin only) */}
        {user.role === 'admin' && (
          <div className="table-form-column card shadow-sm">
            <h3>Add New Table</h3>
            {formError && (
              <div className="alert alert-error">
                {formError}
              </div>
            )}
            <form onSubmit={handleCreate} className="manager-form mt-3">
              <div className="form-group">
                <label htmlFor="number">Table Name / Number</label>
                <input
                  type="text"
                  id="number"
                  placeholder="e.g., Table 9, Booth A"
                  value={newTable.number}
                  onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="capacity">Seating Capacity</label>
                <input
                  type="number"
                  id="capacity"
                  min="1"
                  max="20"
                  value={newTable.capacity}
                  onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Initial Status</label>
                <select
                  id="status"
                  value={newTable.status}
                  onChange={(e) => setNewTable({ ...newTable, status: e.target.value })}
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="occupied">Occupied</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block mt-3"
                disabled={formLoading}
              >
                <Plus size={18} className="inline-icon" />
                <span>{formLoading ? 'Adding...' : 'Add Table'}</span>
              </button>
            </form>


          </div>
        )}
      </div>
    </div>
  );
};

export default TableManager;
