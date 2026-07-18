import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { Search, Trash2, ShieldAlert } from 'lucide-react';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      const data = await apiRequest('/auth/users');
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch user list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      const data = await apiRequest(`/auth/users/${id}`, 'PUT', { role });
      if (data.success) {
        setUsers(users.map(u => u._id === id ? { ...u, role: data.user.role } : u));
      }
    } catch (err) {
      alert(err.message || 'Failed to update user role.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this user account?')) return;
    try {
      const data = await apiRequest(`/auth/users/${id}`, 'DELETE');
      if (data.success) {
        setUsers(users.filter(u => u._id !== id));
      }
    } catch (err) {
      alert(err.message || 'Failed to delete user.');
    }
  };

  const filteredUsers = users.filter(u => {
    const query = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      (u.phone && u.phone.includes(query)) ||
      u.role.toLowerCase().includes(query)
    );
  });

  return (
    <div className="user-manager">
      <div className="card-header-flex">
        <h2>Registered Accounts</h2>
        <span className="badge">{users.length} Users</span>
      </div>

      <div className="filters-ribbon mt-3">
        <div className="form-group-flex">
          <label>Search Users</label>
          <div className="input-with-icon">
            <Search size={16} className="input-icon" />
            <input
              type="text"
              placeholder="Search by name, email, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading accounts...</div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : filteredUsers.length > 0 ? (
        <div className="table-responsive mt-3">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Registered On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u._id}>
                  <td>
                    <strong>{u.name}</strong>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.phone || <em className="text-muted">Not provided</em>}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="select-sm"
                    >
                      <option value="customer">Customer</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="btn-action-icon delete"
                      title="Delete User"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-5">
          <p>No user accounts found matching your query.</p>
        </div>
      )}
    </div>
  );
};

export default UserManager;
