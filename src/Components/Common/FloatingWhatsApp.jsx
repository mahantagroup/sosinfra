import React, { useEffect, useState } from "react";

const FloatingWhatsApp = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const whatsappNumber = "916262962629";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello%20SOS%20Infrabulls`;

  return (
    <>
      <style>{`
        .floating-whatsapp {
          position: fixed;
          bottom: 26px;
          left: 28px;
          z-index: 999;
          opacity: 0;
          transform: translateY(40px) scale(0.6);
          transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .floating-whatsapp.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .whatsapp-button {
          width: 68px;
          height: 68px;
          background: rgba(37, 211, 102, 0.85); /* Increased opacity for better visibility */
          border-radius: 18px;
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.4); /* White border for contrast */
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          box-shadow:
            0 8px 25px rgba(37, 211, 102, 0.4),
            inset 0 0 20px rgba(255,255,255,0.1),
            0 0 40px rgba(37, 211, 102, 0.8);
          cursor: pointer;
          transition: all 0.35s ease;
          position: relative;
        }

        .whatsapp-button:hover {
          transform: scale(1.12) translateY(-6px);
          box-shadow:
            0 15px 40px rgba(37, 211, 102, 0.6),
            0 0 60px rgba(37, 211, 102, 1);
        }

        /* REAL WHATSAPP SVG ICON */
        .whatsapp-icon {
          width: 38px;
          height: 38px;
          fill: white;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }

        .whatsapp-tooltip {
          position: absolute;
          left: 80px;
          background: rgba(0, 0, 0, 0.75);
          padding: 10px 16px;
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
          opacity: 0;
          transform: translateX(10px);
          transition: all 0.35s ease;
          backdrop-filter: blur(8px);
          box-shadow: 0 5px 20px rgba(0,0,0,0.4);
        }

        .whatsapp-button:hover .whatsapp-tooltip {
          opacity: 1;
          transform: translateX(0);
        }

        @media (max-width: 768px) {
          .floating-whatsapp {
            bottom: 20px;
            right: 20px;
          }
          .whatsapp-button {
            width: 60px;
            height: 60px;
          }
          .whatsapp-tooltip {
            display: none;
          }
        }
      `}</style>

      <div className={`floating-whatsapp ${isVisible ? "visible" : ""}`}>
        <a href={whatsappUrl} className="whatsapp-button" target="_blank" rel="noopener noreferrer">

          {/* ORIGINAL WHATSApp ICON */}
          <svg 
            className="whatsapp-icon" 
            viewBox="0 0 448 512" 
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.8 69.4 27.2 106.2 27.2 122.4 0 222-99.6 222-222 0-59.3-23-115.1-65-157.1zM223.9 445.5c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.7-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.5-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.3-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.6-.3-8.6 2.5-11.3 2.5-2.5 5.6-6.5 8.3-9.7 2.8-3.3 3.7-5.6 5.6-9.3 1.9-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.7 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>

          <div className="whatsapp-tooltip">Chat with us</div>
        </a>
      </div>
    </>
  );
};

export default FloatingWhatsApp;
