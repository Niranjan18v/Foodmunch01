import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { Truck, Leaf, Headphones, ArrowRight, CreditCard, Gift } from 'lucide-react';

const Home = () => {
  const [featuredMenu, setFeaturedMenu] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await apiRequest('/menu');
        if (data.success) {
          // Take 4 items for the menu grid
          setFeaturedMenu(data.menuItems.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching home page data:', err);
      }
    };
    fetchMenu();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Get Delicious Food at Anytime</h1>
          <p className="hero-subtitle">
            Eat healthy and delicious food.
          </p>
          <div className="hero-actions">
            <Link to="/book" className="btn btn-primary btn-lg">Book a table</Link>
            <Link to="/menu" className="btn btn-outline-light btn-lg">Explore Menu</Link>
          </div>
        </div>
      </section>

      {/* Services / Features Section */}
      <section className="services-section container">
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon-container">
              <Truck size={36} />
            </div>
            <h3>Fast Delivery</h3>
            <p>We provide the fastest delivery to your doorstep. Fresh and warm food guaranteed.</p>
          </div>
          <div className="service-card">
            <div className="service-icon-container">
              <Leaf size={36} />
            </div>
            <h3>Fresh Food</h3>
            <p>Our food is always prepared with fresh ingredients. Taste the difference in every bite.</p>
          </div>
          <div className="service-card">
            <div className="service-icon-container">
              <Headphones size={36} />
            </div>
            <h3>24/7 Support</h3>
            <p>We are available to assist you anytime. Contact our support team for any queries.</p>
          </div>
        </div>
      </section>

      {/* Our Menu Section */}
      <section className="menu-showcase container">
        <h2 className="section-title">Explore Categories</h2>
        <div className="menu-grid-4">
          <div className="food-card">
            <img src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80" alt="Non Veg" />
            <h4>Non Veg</h4>
            <Link to="/menu" className="btn btn-primary btn-sm">Explore <ArrowRight size={16} /></Link>
          </div>
          <div className="food-card">
            <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80" alt="Veg" />
            <h4>Veg</h4>
            <Link to="/menu" className="btn btn-primary btn-sm">Explore <ArrowRight size={16} /></Link>
          </div>
          <div className="food-card">
            <img src="https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80" alt="Fresh Juices" />
            <h4>Fresh Juices</h4>
            <Link to="/menu" className="btn btn-primary btn-sm">Explore <ArrowRight size={16} /></Link>
          </div>
          <div className="food-card">
            <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80" alt="Main Course" />
            <h4>Main Course</h4>
            <Link to="/menu" className="btn btn-primary btn-sm">Explore <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Soul Food Info Section */}
      <section className="soul-food-section container">
        <div className="soul-food-grid">
          <div className="soul-food-image">
            <img 
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80" 
              alt="Healthy Salad" 
            />
          </div>
          <div className="soul-food-text">
            <h2>Food for the body is not enough. There must be food for the soul.</h2>
            <p>
              We believe that eating should be a holistic experience. Our dishes are crafted not just to satisfy your hunger, but to bring joy and comfort to your soul. Every recipe tells a story of passion and culinary excellence.
            </p>
            <Link to="/about" className="btn btn-primary">Learn More <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Delivery and Payment Section */}
      <section className="delivery-section">
        <div className="container delivery-container">
          <div className="delivery-text">
            <h2>Delivery and Payment</h2>
            <p>
              Enjoy our meals from the comfort of your home. We offer seamless delivery services with secure payment options. Pay online or on delivery—it's completely up to you!
            </p>
            <Link to="/menu" className="btn btn-primary">Order Now</Link>
            <div className="payment-icons">
              <CreditCard size={28} />
              <span style={{ fontWeight: 800, letterSpacing: '-1px' }}>VISA</span>
              <span style={{ fontWeight: 800 }}>mastercard</span>
            </div>
          </div>
          <div className="discount-badge">
            <h3>25%<br/>Off</h3>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '2px' }}>ON FIRST ORDER</span>
          </div>
        </div>
      </section>

      {/* Gift Section */}
      <section className="gift-section">
        <div className="container gift-container">
          <div className="gift-text">
            <h2>Treat yourself or a loved one</h2>
            <p>
              Gift cards available now! Share the joy of delicious food with our exclusive gift cards. Perfect for any occasion.
            </p>
            <Link to="/gift" className="btn btn-primary">Get Gift Card</Link>
          </div>
          <div className="gift-image">
            <Gift size={120} color="#ef4444" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
