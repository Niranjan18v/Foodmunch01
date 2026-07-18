import React from 'react';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-top container">
        <h3>FOLLOW US</h3>
        <div className="social-links">
          <a href="#" className="social-icon">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.557z"/></svg>
          </a>
          <a href="#" className="social-icon">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="#" className="social-icon">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/></svg>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="footer-bottom-logo" style={{ justifyContent: 'center', marginBottom: '10px' }}>
            <img
              src="https://ik.imagekit.io/w3efjbdfv/FOOD%20STORE%20PROJECT/food-munch-img.webp?updatedAt=1756443677939"
              alt="FoodMunch Logo"
              style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover', marginRight: '8px' }}
            />
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>FoodMunch</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '6px' }}>FoodMunch - Premium Table Reservations</p>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '4px' }}>
            foodmunch@gmail.com &nbsp;|&nbsp;  123 Mannargudi, TamilNadu, India
          </p>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '8px' }}>
            &copy; {new Date().getFullYear()} FoodMunch. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
