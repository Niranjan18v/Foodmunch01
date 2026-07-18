import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Search, Loader, ShoppingCart, Plus, Minus, X, CheckCircle, ShoppingBag } from 'lucide-react';

const Menu = () => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Cart state
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await apiRequest('/menu');
        if (data.success) setMenuItems(data.menuItems);
        else setError('Failed to fetch menu items');
      } catch (err) {
        setError(err.message || 'Error connecting to server.');
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const categories = [
    { id: 'all', label: 'Full Menu' },
    { id: 'non-veg', label: 'Non-Veg' },
    { id: 'veg', label: 'Veg' },
    { id: 'main-course', label: 'Main Course' },
    { id: 'seafood', label: 'Fish & Sea Foods' },
    { id: 'fresh-juices', label: 'Fresh Juices' },
    { id: 'desserts', label: 'Desserts' }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart helpers
  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(c => c._id === item._id);
      if (exists) return prev.map(c => c._id === item._id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(prev =>
      prev.map(c => c._id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c)
    );
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(c => c._id !== id));
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  const handlePlaceOrder = () => {
    // Save order to localStorage for dashboard
    const newOrder = {
      id: Date.now().toString().slice(-6),
      date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })),
      total: cartTotal.toFixed(0)
    };
    const existing = JSON.parse(localStorage.getItem('dineease_orders') || '[]');
    localStorage.setItem('dineease_orders', JSON.stringify([newOrder, ...existing]));

    setOrderPlaced(true);
    setCart([]);
    setTimeout(() => {
      setOrderPlaced(false);
      setCartOpen(false);
    }, 3000);
  };

  return (
    <div className="menu-page container">
      {/* Header */}
      <div className="menu-header text-center">
        <span className="section-label">OUR DIGITAL MENU</span>
        <h2>Explore Culinary Masterpieces</h2>
        <p>Browse our chef-curated selection of fresh, seasonal creations.</p>
      </div>

      {/* Search + Cart on top, Category Filters below */}
      <div className="menu-controls">
        {/* Row 1: Search + Cart Button */}
        <div className="menu-search-row">
          <div className="search-box">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search dishes, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Cart button beside search */}
          {user && (
            <button className="cart-fab" onClick={() => setCartOpen(true)}>
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
            </button>
          )}
        </div>

        {/* Row 2: Category Pill Tabs */}
        <div className="menu-filters-row">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="loader-container">
          <Loader className="spinner" size={40} />
          <p>Preparing menu delicacies...</p>
        </div>
      ) : error ? (
        <div className="alert alert-error text-center">{error}</div>
      ) : filteredItems.length > 0 ? (
        <div className="menu-grid">
          {filteredItems.map(item => (
            <div key={item._id} className={`menu-card ${!item.availability ? 'sold-out' : ''}`}>
              <div className="menu-card-image">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                  alt={item.name}
                />
                <span className="menu-card-tag">{item.category}</span>
                {!item.availability && (
                  <div className="sold-out-overlay"><span>Sold Out</span></div>
                )}
              </div>
              <div className="menu-card-body">
                <div className="menu-card-header">
                  <h3>{item.name}</h3>
                  <span className="menu-card-price">₹{item.price.toFixed(0)}</span>
                </div>
                <p className="menu-card-description">{item.description}</p>
                <div className="menu-card-footer">
                  {item.availability ? (
                    user ? (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => addToCart(item)}
                      >
                        <Plus size={16} /> Add to Cart
                      </button>
                    ) : (
                      <Link to="/login" className="btn btn-outline btn-sm">
                        Login to Order
                      </Link>
                    )
                  ) : (
                    <span className="status-pill unavailable">Not Available</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center" style={{ padding: '60px 0', color: 'var(--text-muted)' }}>
          <ShoppingBag size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
          <p>No dishes found. Try adjusting your filters or search.</p>
        </div>
      )}

      {/* Cart Drawer Overlay */}
      {user && cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h3><ShoppingCart size={22} /> Your Order</h3>
              <button className="cart-close" onClick={() => setCartOpen(false)}>
                <X size={22} />
              </button>
            </div>

            {orderPlaced ? (
              <div className="cart-success">
                <CheckCircle size={56} color="var(--color-success)" />
                <h3>Order Placed!</h3>
                <p>Your order has been sent to the kitchen. Enjoy!</p>
              </div>
            ) : cart.length === 0 ? (
              <div className="cart-empty">
                <ShoppingCart size={56} style={{ opacity: 0.3, marginBottom: '16px' }} />
                <p>Your cart is empty.</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Add items from the menu!
                </p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item._id} className="cart-item">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80'}
                        alt={item.name}
                        className="cart-item-img"
                      />
                      <div className="cart-item-info">
                        <span className="cart-item-name">{item.name}</span>
                        <span className="cart-item-price">₹{item.price} × {item.qty}</span>
                      </div>
                      <div className="cart-item-controls">
                        <button className="qty-btn" onClick={() => updateQty(item._id, -1)}>
                          <Minus size={14} />
                        </button>
                        <span className="qty-display">{item.qty}</span>
                        <button className="qty-btn" onClick={() => updateQty(item._id, 1)}>
                          <Plus size={14} />
                        </button>
                        <button className="qty-btn remove" onClick={() => removeFromCart(item._id)}>
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total ({cartCount} items)</span>
                    <strong>₹{cartTotal.toFixed(0)}</strong>
                  </div>
                  <button className="btn btn-primary btn-block btn-lg" onClick={handlePlaceOrder}>
                    Place Order
                  </button>
                  <Link to="/book" className="btn btn-outline btn-block" style={{ marginTop: '10px' }}>
                    + Reserve a Table
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
