import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { Plus, Trash2, Edit2, Check, X, ShieldAlert } from 'lucide-react';

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Non Veg',
    image: '',
    availability: true
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchMenu = async () => {
    try {
      const data = await apiRequest('/menu');
      if (data.success) {
        setMenuItems(data.menuItems);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch menu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleEditClick = (item) => {
    setIsEditing(true);
    setEditId(item._id);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image || '',
      availability: item.availability
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Non Veg',
      image: '',
      availability: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price || !formData.description.trim()) return;

    setFormLoading(true);
    setFormError('');

    const parsedData = {
      ...formData,
      price: parseFloat(formData.price)
    };

    try {
      if (isEditing) {
        // Update menu item
        const data = await apiRequest(`/menu/${editId}`, 'PUT', parsedData);
        if (data.success) {
          setMenuItems(menuItems.map(item => item._id === editId ? data.menuItem : item));
          handleCancelEdit();
        }
      } else {
        // Create menu item
        const data = await apiRequest('/menu', 'POST', parsedData);
        if (data.success) {
          setMenuItems([...menuItems, data.menuItem]);
          setFormData({
            name: '',
            description: '',
            price: '',
            category: 'Non Veg',
            image: '',
            availability: true
          });
        }
      }
    } catch (err) {
      setFormError(err.message || 'Failed to save menu item.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      const data = await apiRequest(`/menu/${item._id}`, 'PUT', {
        ...item,
        availability: !item.availability
      });
      if (data.success) {
        setMenuItems(menuItems.map(m => m._id === item._id ? data.menuItem : m));
      }
    } catch (err) {
      alert(err.message || 'Failed to update availability.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this menu item?')) return;
    try {
      const data = await apiRequest(`/menu/${id}`, 'DELETE');
      if (data.success) {
        setMenuItems(menuItems.filter(item => item._id !== id));
      }
    } catch (err) {
      alert(err.message || 'Error deleting item.');
    }
  };

  return (
    <div className="menu-manager">
      <div className="manager-grid">
        {/* Left Side: Create/Edit Form */}
        <div className="menu-form-column card shadow-sm">
          <h3>{isEditing ? 'Modify Menu Item' : 'Create New Menu Item'}</h3>
          {formError && (
            <div className="alert alert-error">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="manager-form mt-3">
            <div className="form-group">
              <label htmlFor="name">Item Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Crispy Chicken Wings"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group col">
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 12.99"
                  required
                />
              </div>

              <div className="form-group col">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="Non Veg">Non Veg</option>
                  <option value="Veg">Veg</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Fish & Sea Foods">Fish & Sea Foods</option>
                  <option value="Fresh Juices">Fresh Juices</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="image">Image URL (Optional)</label>
              <textarea
                id="image"
                name="image"
                rows="2"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://unsplash.com/... or leave blank"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Briefly describe the ingredients and taste..."
                required
              ></textarea>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="availability"
                  checked={formData.availability}
                  onChange={handleInputChange}
                />
                <span>Available to Order</span>
              </label>
            </div>

            <div className="form-actions mt-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={formLoading}
              >
                <Plus size={16} className="inline-icon" />
                <span>{isEditing ? 'Save Changes' : 'Create Item'}</span>
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-outline ml-2"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side: Menu Items Table/List */}
        <div className="menu-list-column">
          <div className="card-header-flex">
            <h2>Digital Menu List</h2>
            <span className="badge">{menuItems.length} Items</span>
          </div>

          {loading ? (
            <div className="text-center py-4">Loading menu items...</div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : menuItems.length > 0 ? (
            <div className="table-responsive mt-3">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map(item => (
                    <tr key={item._id} className={!item.availability ? 'row-disabled' : ''}>
                      <td>
                        <img 
                          src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=60&q=80'} 
                          alt={item.name} 
                          className="table-thumbnail img-rounded"
                        />
                      </td>
                      <td>
                        <div className="menu-item-info">
                          <strong>{item.name}</strong>
                          <span className="desc-truncated">{item.description}</span>
                        </div>
                      </td>
                      <td>
                        <span className="category-pill">{item.category}</span>
                      </td>
                      <td>
                        <strong>₹{item.price.toFixed(0)}</strong>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleAvailability(item)}
                          className={`status-toggle-btn ${item.availability ? 'in-stock' : 'out-of-stock'}`}
                          title="Click to toggle availability"
                        >
                          {item.availability ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="btn-action-icon edit"
                            title="Edit Item"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="btn-action-icon delete"
                            title="Delete Item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <p>No dishes on the menu yet. Add one using the form!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuManager;
