import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';
import DashboardOverview from '../components/DashboardOverview';
import ReservationManager from '../components/ReservationManager';
import TableManager from '../components/TableManager';
import MenuManager from '../components/MenuManager';
import UserManager from '../components/UserManager';
import { LayoutDashboard, Calendar, Layers, BookOpen, Users, User, Loader, ShoppingBag } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Decide starting tab based on role
  const [activeTab, setActiveTab] = useState(
    user?.role === 'customer' ? 'reservations' : 'overview'
  );
  const [orders, setOrders] = useState([]);
  
  const [analyticsData, setAnalyticsData] = useState({
    stats: {},
    recentReservations: [],
    trendData: []
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState('');

  const fetchAnalytics = async () => {
    if (user?.role === 'customer') {
      setAnalyticsLoading(false);
      return;
    }

    try {
      setAnalyticsLoading(true);
      const data = await apiRequest('/analytics/dashboard');
      if (data.success) {
        setAnalyticsData({
          stats: data.stats,
          recentReservations: data.recentReservations,
          trendData: data.trendData
        });
      }
    } catch (err) {
      setAnalyticsError(err.message || 'Failed to fetch analytics metrics.');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // Load orders from localStorage
    const saved = JSON.parse(localStorage.getItem('dineease_orders') || '[]');
    setOrders(saved);
  }, [user]);

  // Customer Orders Panel
  const renderOrders = () => (
    <div className="orders-panel">
      {orders.length === 0 ? (
        <div className="orders-empty">
          <ShoppingBag size={56} style={{ opacity: 0.3 }} />
          <h3>No Orders Yet</h3>
          <p>Browse our menu and add items to your cart to place your first order!</p>
          <a href="/menu" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>Browse Menu</a>
        </div>
      ) : (
        orders.map((order, idx) => (
          <div key={idx} className="order-card">
            <div className="order-card-header">
              <div>
                <strong>Order #{order.id}</strong>
                <span className="order-id" style={{ marginLeft: '12px' }}>{order.date}</span>
              </div>
              <span className="status-badge confirmed">Confirmed</span>
            </div>
            <div className="order-items-list">
              {order.items.map((item, i) => (
                <div key={i} className="order-item-row">
                  <strong>{item.name} × {item.qty}</strong>
                  <span>₹{(item.price * item.qty).toFixed(0)}</span>
                </div>
              ))}
            </div>
            <div className="order-card-footer">
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{order.items.length} item(s)</span>
              <span className="order-total">Total: ₹{order.total}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );

  // Handle active tab rendering
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <DashboardOverview
            stats={analyticsData.stats}
            recentReservations={analyticsData.recentReservations}
            onTabChange={(tab) => setActiveTab(tab)}
          />
        );
      case 'reservations':
        return <ReservationManager />;
      case 'tables':
        return <TableManager />;
      case 'menu':
        return <MenuManager />;
      case 'users':
        return <UserManager />;
      case 'orders':
        return renderOrders();
      default:
        return <div>Tab not found</div>;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Executive Analytics Overview';
      case 'reservations': return user?.role === 'customer' ? 'My Table Reservations' : 'Verify & Approve Reservations';
      case 'tables': return 'Manage Table Availability';
      case 'menu': return 'Digital Menu & Dishes Management';
      case 'users': return 'Registered User Roles Configuration';
      case 'orders': return 'My Food Orders';
      default: return 'Dashboard';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Loading state if user auth hasn't fully completed yet
  if (!user) {
    return (
      <div className="loader-container">
        <Loader className="spinner" size={40} />
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Left Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="user-profile-summary">
            <div className="avatar-wrap">
              <User size={32} />
            </div>
            <div className="user-details">
              <h4>{user.name}</h4>
              <p>{user.email}</p>
              <span className={`role-badge ${user.role}`}>{user.role.toUpperCase()}</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            {/* Staff / Admin Only: Overview */}
            {user.role !== 'customer' && (
              <button
                className={`sidebar-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <LayoutDashboard size={18} />
                <span>Overview & Stats</span>
              </button>
            )}

            {/* Universal: Reservations */}
            <button
              className={`sidebar-nav-btn ${activeTab === 'reservations' ? 'active' : ''}`}
              onClick={() => setActiveTab('reservations')}
            >
              <Calendar size={18} />
              <span>{user.role === 'customer' ? 'My Reservations' : 'Reservations'}</span>
            </button>

            {/* Customer Only: My Orders */}
            {user.role === 'customer' && (
              <button
                className={`sidebar-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <ShoppingBag size={18} />
                <span>My Orders</span>
                {orders.length > 0 && (
                  <span style={{ marginLeft: 'auto', background: 'var(--primary)', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '2px 7px', borderRadius: '12px' }}>
                    {orders.length}
                  </span>
                )}
              </button>
            )}

            {/* Staff / Admin Only: Tables */}
            {user.role !== 'customer' && (
              <button
                className={`sidebar-nav-btn ${activeTab === 'tables' ? 'active' : ''}`}
                onClick={() => setActiveTab('tables')}
              >
                <Layers size={18} />
                <span>Restaurant Tables</span>
              </button>
            )}

            {/* Admin Only: Menu Manager */}
            {user.role === 'admin' && (
              <button
                className={`sidebar-nav-btn ${activeTab === 'menu' ? 'active' : ''}`}
                onClick={() => setActiveTab('menu')}
              >
                <BookOpen size={18} />
                <span>Manage Menu</span>
              </button>
            )}

            {/* Admin Only: User Manager */}
            {user.role === 'admin' && (
              <button
                className={`sidebar-nav-btn ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <Users size={18} />
                <span>Manage Users</span>
              </button>
            )}
          </nav>
        </aside>

        {/* Right Main Panel */}
        <main className="dashboard-content-panel">
          <header className="content-panel-header">
            <div>
              <p className="text-muted text-sm" style={{ letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700 }}>
                {getGreeting()}, {user.name} 👋
              </p>
              <h1 style={{ marginTop: '4px' }}>{getTabTitle()}</h1>
            </div>
            {user.role !== 'customer' && (
              <button onClick={fetchAnalytics} className="btn btn-sm btn-outline" title="Refresh Dashboard Stats">
                🔄 Refresh Stats
              </button>
            )}
          </header>

          <div className="content-panel-body">
            {activeTab === 'overview' && analyticsLoading ? (
              <div className="loader-container">
                <Loader className="spinner" size={40} />
                <p>Calculating restaurant metrics...</p>
              </div>
            ) : activeTab === 'overview' && analyticsError ? (
              <div className="alert alert-error">
                {analyticsError}
              </div>
            ) : (
              renderTabContent()
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
