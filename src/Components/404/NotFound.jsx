import React from 'react';
import { Link } from 'react-router-dom';
import './Notfound.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      {/* Background Elements */}
      <div className="not-found-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
        <div className="glow-effect glow-1"></div>
        <div className="glow-effect glow-2"></div>
      </div>

      <div className="not-found-container">
        <div className="not-found-content">
          {/* Animated 404 Number */}
          <div className="error-number">
            <span className="digit digit-4">4</span>
            <div className="floating-orbit">
              <div className="orbit-circle"></div>
            </div>
            <span className="digit digit-0">0</span>
            <span className="digit digit-4">4</span>
          </div>

          {/* Main Message */}
          <div className="error-message">
            <h1 className="error-title">Page Not Found</h1>
            <p className="error-description">
              Oops! The page you're looking for seems to have wandered off into 
              the digital universe. Don't worry, even the best properties sometimes 
              need relocation.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="error-actions">
            <Link to="/" className="home-button">
              <span className="button-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M8.33333 15.8333V11.6667H11.6667V15.8333H15V10H17.5L10 2.5L2.5 10H5V15.8333H8.33333Z" fill="currentColor"/>
                </svg>
              </span>
              Return Home
            </Link>
            
            <Link to="/property" className="browse-button">
              <span className="button-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.6667 5.83333L10 1.66667L3.33333 5.83333V15.8333L10 19.1667L16.6667 15.8333V5.83333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.5 10H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              Browse Properties
            </Link>
          </div>

          {/* Additional Help */}
          <div className="error-help">
            <div className="help-item">
              <div className="help-icon">🔍</div>
              <div className="help-text">
                <strong>Search Our Properties</strong>
                <span>Find your dream home from our extensive collection</span>
              </div>
            </div>
            
            <div className="help-item">
              <div className="help-icon">📞</div>
              <div className="help-text">
                <strong>Need Assistance?</strong>
                <span>Contact our support team for immediate help</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Premium Properties</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Client Satisfaction</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </div>

        {/* Decorative Illustration */}
        <div className="error-illustration">
          <div className="illustration-container">
            <div className="house-icon">
              <div className="roof"></div>
              <div className="walls">
                <div className="door"></div>
                <div className="window"></div>
              </div>
            </div>
            <div className="search-icon">
              <div className="magnifier"></div>
            </div>
            <div className="floating-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;