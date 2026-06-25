import React, { useEffect, useState } from "react";

const FloatingWhatsApp = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const whatsappNumber = "916262900000";
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
          background: rgba(37, 211, 102, 0.25);
          border-radius: 18px;
          backdrop-filter: blur(14px);
          border: 1px solid rgba(37, 211, 102, 0.4);
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
          filter: drop-shadow(0 0 6px rgba(255,255,255,0.8));
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
          <img
            className="whatsapp-icon"
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
          />

          <div className="whatsapp-tooltip">Chat with us</div>
        </a>
      </div>
    </>
  );
};

export default FloatingWhatsApp;
