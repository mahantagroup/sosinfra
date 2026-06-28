import React, { useEffect, useRef } from "react";

function Director() {
  useEffect(() => {
    // High-performance IntersectionObserver for reveal triggers
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll(".dir-reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,400&display=swap');

        :root {
          --brand-blue: #4A97E4;
          --brand-gold: #ffd782;
          --brand-gold-dark: #d4af37;
          --slate-900: #0f172a;
          --slate-700: #334155;
          --slate-500: #64748b;
          --slate-100: #f1f5f9;
        }

        .dir-section {
          padding: 6rem 0;
          background: #fafbfc;
          font-family: 'Plus Jakarta Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }

        .dir-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* --- Performance Scroll Animation --- */
        .dir-reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }

        .dir-reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* --- Compact Executive Card Architecture --- */
        .dir-card {
          display: grid;
          grid-template-columns: 42% 52%;
          gap: 6%;
          align-items: center;
          margin-bottom: 6rem;
        }

        .dir-card:last-child {
          margin-bottom: 0;
        }

        .dir-card:nth-child(even) .dir-media-box {
          order: 2;
        }
        .dir-card:nth-child(even) .dir-info-box {
          order: 1;
        }

        /* --- Premium Media Framing --- */
        .dir-media-box {
          position: relative;
          z-index: 2;
        }

        .dir-img-wrapper {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          background: var(--slate-100);
          box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08);
          transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
          transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .dir-img-wrapper:hover {
          transform: perspective(1000px) scale(1.02) translateY(-4px);
        }

        .dir-img-wrapper img {
          width: 100%;
          height: 480px;
          object-fit: cover;
          object-position: top;
          display: block;
        }

        /* Luxury Border Frame Accent */
        .dir-geometric-frame {
          position: absolute;
          inset: -12px;
          border: 1px solid rgba(17, 116, 214, 0.15);
          border-radius: 20px;
          z-index: -1;
          pointer-events: none;
          transition: inset 0.4s ease;
        }

        .dir-img-wrapper:hover ~ .dir-geometric-frame {
          inset: -6px;
          border-color: var(--brand-blue);
        }

        .dir-badge {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: var(--brand-gold);
          padding: 0.5rem 1.2rem;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          border: 1px solid rgba(255, 215, 130, 0.2);
        }

        /* --- Info & Editorial Content Blocks --- */
        .dir-info-box {
          display: flex;
          flex-direction: column;
        }

        .dir-name {
          font-family: 'Playfair Display', serif;
          font-size: 2.75rem;
          font-weight: 600;
          color: var(--slate-900);
          margin: 0 0 0.25rem 0;
          letter-spacing: -0.01em;
        }

        .dir-role {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--brand-blue);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dir-role::after {
          content: '';
          height: 1px;
          width: 40px;
          background: var(--brand-gold);
          display: inline-block;
        }

        .dir-bio-text {
          color: var(--slate-700);
          font-size: 1rem;
          line-height: 1.7;
          margin: 0 0 1.5rem 0;
          font-weight: 400;
        }

        /* Elite Blockquote Typography */
        .dir-quote-card {
          background: #ffffff;
          border-left: 3px solid var(--brand-blue);
          padding: 1.5rem 1.75rem;
          border-radius: 0 16px 16px 0;
          margin: 0.5rem 0 1.75rem 0;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
          position: relative;
        }

        .dir-quote-card p {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          color: var(--slate-900);
          font-size: 1.15rem;
          line-height: 1.6;
          margin: 0;
        }

        /* --- Responsive Fluid Adaptive Breakpoints --- */
        @media (max-width: 1024px) {
          .dir-card {
            grid-template-columns: 45% 50%;
            gap: 5%;
          }
          .dir-name { font-size: 2.25rem; }
          .dir-img-wrapper img { height: 420px; }
        }

        @media (max-width: 768px) {
          .dir-section { padding: 4rem 0; }
          .dir-card {
            grid-template-columns: 1fr;
            gap: 3rem;
            margin-bottom: 5rem;
          }
          .dir-card:nth-child(even) .dir-media-box,
          .dir-card:nth-child(even) .dir-info-box {
            order: initial;
          }
          .dir-img-wrapper img { height: 450px; }
          .dir-geometric-frame { display: none; }
        }

        @media (max-width: 480px) {
          .dir-name { font-size: 1.85rem; }
          .dir-img-wrapper img { height: 360px; }
          .dir-quote-card { padding: 1.25rem; }
          .dir-quote-card p { font-size: 1.05rem; }
        }
      `}</style>

      <section className="dir-section">
        <div className="dir-container">

          {/* Pawan Tilve Profile */}
          <div className="dir-card dir-reveal">
            <div className="dir-media-box">
              <div className="dir-img-wrapper">
                <span className="dir-badge">Founder & MD</span>
                <img src="https://res.cloudinary.com/dlsbj8nug/image/upload/v1782555501/01_1_bb0dgs.png" alt="MD Pawan Tilve" />
              </div>
              <div className="dir-geometric-frame"></div>
            </div>

            <div className="dir-info-box">
              <h2 className="dir-name">Mr. Pawan Tilve</h2>
              <div className="dir-role">Founder & Managing Director</div>

              <p className="dir-bio-text">
                Leading with purpose and precision, Mr. Pawan Tilve brings transformative vision to SOS Infrabulls. His leadership is rooted in deep industry expertise and an unwavering commitment to excellence.
              </p>

              <div className="dir-quote-card">
                <p>
                  "एक नए कल की शुरुआत, हमारी प्राथमिकता मध्यवर्गीय परिवार की मेहनत से एकत्र की गई जमापूँजी को एक सही जगह निवेश कराना है, ताकि वह अपने सपनों का आशियाना वहाँ बना पाएं..."
                </p>
              </div>

              <p className="dir-bio-text" style={{ margin: 0 }}>
                Under his guidance, SOS Infrabulls has redefined real estate standards, focusing on sustainable growth, innovative solutions, and creating lasting value for stakeholders.
              </p>
            </div>
          </div>

          {/* Vikas Garg Profile */}
          <div className="dir-card dir-reveal">
            <div className="dir-media-box">
              <div className="dir-img-wrapper">
                <span className="dir-badge">CMD</span>
                <img src="https://res.cloudinary.com/dlsbj8nug/image/upload/v1782555487/01_2_hoyhjx.png" alt="CMD Vikas Garg" />
              </div>
              <div className="dir-geometric-frame"></div>
            </div>

            <div className="dir-info-box">
              <h2 className="dir-name">Mr. Vikas Garg</h2>
              <div className="dir-role">Chief Managing Director</div>

              <p className="dir-bio-text">
                With strategic foresight and decades of experience, Mr. Vikas Garg shapes the future of real estate development. His philosophy centers on trust, transparency, and creating spaces that inspire.
              </p>

              <div className="dir-quote-card">
                <p>
                  "सर्वप्रथम हम आपको धन्यवाद देते हैं कि आपने हमसे संपर्क किया और हमारे बारे में जानने के लिए उत्सुक हैं। हम कौन हैं? हम भी बिल्कुल आप ही की तरह हैं... आप और मैं तभी तो कहलायेंगे 'हम'"
                </p>
              </div>

              <p className="dir-bio-text" style={{ margin: 0 }}>
                His approach combines meticulous planning with empathetic understanding of client needs, ensuring every project exceeds expectations while maintaining the highest ethical standards.
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

export default Director;