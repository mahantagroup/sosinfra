import React from "react";
import "./Mission.css";

const VisionMissionPage = () => {
  return (
    <section className="container-sec">
      <style>{`
        .container-sec {
          padding: 5rem 0;
          background: linear-gradient(180deg, #f6f9ff 0%, #ffffff 100%);
        }

        .section-label {
          display: inline-block;
          background: linear-gradient(135deg, rgba(17, 116, 214, 0.1), rgba(255, 215, 130, 0.1));
          color: #4A97E4;
          padding: 0.5rem 1.2rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 1rem;
          border: 1px solid rgba(17, 116, 214, 0.2);
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: #475569;
          margin-bottom: 3rem;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .value-card {
          background: white;
          border-radius: 20px;
          padding: 2.5rem 2rem;
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(226, 232, 240, 0.6);
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .value-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #4A97E4, #ffd782);
        }

        .value-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 60px rgba(17, 116, 214, 0.15);
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1rem;
        }

        .card-content {
          font-size: 1rem;
          line-height: 1.8;
          color: #475569;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.5rem;
        }

        .value-item {
          text-align: center;
          padding: 2rem 1rem;
          background: white;
          border-radius: 16px;
          border: 1px solid rgba(17, 116, 214, 0.15);
          transition: all 0.3s ease;
        }

        .value-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(17, 116, 214, 0.12);
        }

        .value-letter {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #4A97E4, #ffd782);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .value-text {
          font-weight: 700;
          color: #0f172a;
          font-size: 1.1rem;
        }

        @media (max-width: 900px) {
          .cards-grid {
            grid-template-columns: 1fr;
          }
          
          .values-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .section-title {
            font-size: 2rem;
          }
        }

        @media (max-width: 600px) {
          .section-title {
            font-size: 1.75rem;
          }

          .values-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="container">
        {/* Mission, Vision, Values */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label">Our Core</div>
          <h2 className="section-title">Mission, Vision & Values</h2>
        </div>

        {/* Cards Grid */}
        <div className="cards-grid">
          {/* Mission Card */}
          <div className="value-card">
            <h3 className="card-title">Our Mission</h3>
            <p className="card-content">
              To make everyone's dream of owning a home a reality, by providing easy and hassle-free access to a wide range of real estate options.
            </p>
          </div>

          {/* Vision Card */}
          <div className="value-card">
            <h3 className="card-title">Our Vision</h3>
            <p className="card-content">
              “ To build 10,000 Success stories & 20,000 satisfy client with successful delivery In 2027 ”
            </p>
          </div>

          {/* Values Card */}
          <div className="value-card">
            <h3 className="card-title">Our Value</h3>
            <p className="card-content">
              TRUTH · RESPONSIBLE · UNDERSTANDING · SKILLED · TEAMWORK
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div style={{ marginTop: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>Our Values</h3>
          </div>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-letter">T</div>
              <div className="value-text">RUTH</div>
            </div>
            <div className="value-item">
              <div className="value-letter">R</div>
              <div className="value-text">ESPONSIBLE</div>
            </div>
            <div className="value-item">
              <div className="value-letter">U</div>
              <div className="value-text">NDERSTANDING</div>
            </div>
            <div className="value-item">
              <div className="value-letter">S</div>
              <div className="value-text">KILLED</div>
            </div>
            <div className="value-item">
              <div className="value-letter">T</div>
              <div className="value-text">EAMWORK</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMissionPage;
