import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Subscribed with email:', email);
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { name: 'Facebook', icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>), link: 'https://www.facebook.com/sosinfrabulls/', color: '#1877F2' },
    { name: 'Instagram', icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>), link: 'https://www.instagram.com/official_sosinfrabulls/', color: '#E4405F' },
    { name: 'YouTube', icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 19.5 12 19.5 12 19.5s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"/></svg>), link: 'https://www.youtube.com/@SOS_Infrabulls', color: '#FF0000' },
    { name: 'LinkedIn', icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>), link: 'https://www.linkedin.com/company/sosinfrabulls/', color: '#0A66C2' }
  ];

  return (
    <>
      <footer className="premium-footer">
        <div className="footer-container">
          {/* Brand + Social in one line */}
          <div className="footer-top-row">
            <a href="/" className="footer-logo-link">
              <img src="images/logo/logo@2x.png" alt="SOS Infrabulls" width="160" height="46" />
            </a>
            <div className="footer-social-group">
              <span className="footer-social-label">Connect</span>
              <div className="footer-social-icons">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.link}
                    className="footer-social-icon"
                    aria-label={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ '--social-color': social.color }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Main Grid – 4 compact columns */}
          <div className="footer-main-grid">
            {/* Column 1: Contact */}
            <div className="footer-col">
              <h4 className="footer-col-title">Contact</h4>
              <div className="footer-contact-list">
                <div className="footer-contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1C6.486 1 2 5.486 2 11c0 5.515 10 12 10 12s10-6.485 10-12c0-5.514-4.486-10-10-10zm0 12c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/></svg>
                  <span>405 - Shagun tower, Above Apna Sweets, AB Road, Vijay Nagar, Indore, 452001</span>
                </div>
                <div className="footer-contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  <a href="tel:+916262900000">+91 62629-00000</a>
                </div>
                <div className="footer-contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  <div className="footer-email-links">
                    <a href="mailto:info@sosinfrabulls.com">info@sosinfrabulls.com</a>
                    <a href="mailto:support@sosinfrabulls.com">support@sosinfrabulls.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-col">
              <h4 className="footer-col-title">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/projectgallery">Ongoing Projects</Link></li>
                <li><Link to="/complete">Completed Projects</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
                <li><Link to="/blog">Blog & News</Link></li>
              </ul>
            </div>

            {/* Column 3: About */}
            <div className="footer-col">
              <h4 className="footer-col-title">About</h4>
              <ul className="footer-links">
                <li><Link to="/about">About Company</Link></li>
                <li><Link to="/aboutdirector">Director Message</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms & Conditions</Link></li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className="footer-col footer-col-newsletter">
              <h4 className="footer-col-title">Stay Updated</h4>
              <p className="footer-newsletter-desc">Get latest property insights & exclusive offers.</p>
              <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
                <div className="footer-input-wrapper">
                  <input
                    type="email"
                    className="footer-newsletter-input"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="footer-newsletter-btn">
                    {isSubscribed ? '✓ Done' : 'Subscribe'}
                  </button>
                </div>
                {isSubscribed && (
                  <div className="footer-subscription-success">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                    Thank you for subscribing!
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div className="footer-container footer-bottom-content">
            <p className="footer-copy">© 2025 SOS Infrabulls. All rights reserved.</p>
            <p className="footer-credit">
              Designed by <a href="https://letskillify.com" target="_blank" rel="noopener noreferrer">letskillify.</a>
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <button
        className={`footer-scroll-top ${isVisible ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </button>
    </>
  );
};

export default Footer;