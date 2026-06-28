import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Overview() {
  useEffect(() => {
    // Parallax tilt effect
    const tiltItems = document.querySelectorAll(".tilt-card");

    tiltItems.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        card.style.transform = `
          rotateX(${-(y / 12)}deg)
          rotateY(${x / 12}deg)
          scale(1.03)
        `;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0) rotateY(0) scale(1)";
      });
    });

    // Scroll reveal animation
    const revealItems = document.querySelectorAll(".reveal");

    const revealOnScroll = () => {
      revealItems.forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) el.classList.add("visible");
      });
    };

    revealOnScroll();
    window.addEventListener("scroll", revealOnScroll);

    return () => window.removeEventListener("scroll", revealOnScroll);
  }, []);

  return (
    <>
      <style>{`
        /* Reveal animation */
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: 0.9s ease;
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ---------------- HERO SECTION ---------------- */
        .about-hero {
          padding: 4.5rem 0 5rem;
          background: linear-gradient(145deg, #ffffff 0%, #f6f9ff 100%);
        }

        .about-hero__grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        .title {
          color: var(--text-dark);
          font-weight: 800;
          font-size: 2rem;
        }

        .about-hero__content p {
          color: var(--text-light);
          margin-top: 1rem;
          line-height: 1.8;
          font-size: 1.07rem;
        }

        /* CTA Buttons */
        .about-hero__cta {
          margin-top: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
        }

        .about-btn {
          padding: 0.9rem 1.7rem;
          border-radius: 10px;
          font-weight: 700;
          transition: 0.25s ease;
          text-decoration: none;
          font-size: 0.98rem;
        }

        .about-btn.primary {
          background: var(--primary);
          color: #fff;
          box-shadow: 0 6px 20px rgba(17, 116, 214, 0.3);
        }

        .about-btn.primary:hover {
          background: var(--primary-hover);
          transform: translateY(-3px);
        }

        .about-btn.ghost {
          border: 2px solid var(--primary);
          color: var(--primary);
        }

        .about-btn.ghost:hover {
          background: var(--primary-light);
          transform: translateY(-3px);
        }

        /* ---------------- RIGHT CARD ---------------- */
        .about-hero__card {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(16px);
          padding: 2.2rem;
          border-radius: 20px;
          border: 1px solid rgba(17, 116, 214, 0.18);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          transition: 0.4s ease-in-out;
        }

        .card-label {
          background: var(--primary);
          color: var(--primary-dark);
          padding: 0.4rem 0.9rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          display: inline-block;
        }

        .about-hero__card h3 {
          color: var(--text-dark);
          margin-top: 1rem;
          line-height: 1.45;
          font-weight: 700;
          font-size: 1.35rem;
        }

        .about-hero__card ul {
          margin-top: 1.1rem;
          padding-left: 1.2rem;
          color: var(--text-light);
          line-height: 1.7;
          font-size: 0.95rem;
        }

        /* Stats */
        .about-hero__stats {
          margin-top: 2rem;
          display: flex;
          gap: 2.2rem;
        }

        .about-hero__stats div span {
          color: var(--primary);
          font-size: 1.9rem;
          font-weight: 800;
        }

        .about-hero__stats div p {
          margin-top: 0.3rem;
          color: var(--text-light);
        }


        /* ---------------- WHY CHOOSE SECTION ---------------- */
        .about-why {
          margin-top: 5rem;
        }

        .about-why__grid {
          margin-top: 2.8rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .about-why__grid article {
          padding: 1.8rem;
          border: 1px solid rgba(17, 116, 214, 0.18);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.07);
          transition: 0.3s ease;
        }

        .about-why__grid article:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }

        .about-why__grid article h3 {
          color: var(--primary-dark);
          font-weight: 700;
          font-size: 1.22rem;
          margin-bottom: 0.6rem;
        }

        .about-why__grid article p {
          color: var(--text-light);
          line-height: 1.6;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .about-hero__grid {
            grid-template-columns: 1fr;
          }

          .about-hero__card {
            margin-top: 2rem;
          }

          .about-why__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .about-why__grid {
            grid-template-columns: 1fr;
          }
        }
          @media (max-width: 600px) {
  .about-hero__cta {
    flex-direction: column;
    align-items: stretch;
  }
    .about-hero__grid {
    gap: 0rem;
}
    .about-hero__card ul {
    margin-top: 0.5rem;
    padding-left: 0rem;
    
    font-size: 0.9rem;
}
    .title {
    color: var(--text-dark);
    font-weight: 800;
    font-size: 1.7rem;
}



  .about-btn {
    width: 100%;
    text-align: center;
    padding: 1rem;
    font-size: 1rem;
  }
}
@media (max-width: 900px) {
  .about-btn {
    font-size: 1.05rem;
  }
}


      `}</style>

      {/* PAGE CONTENT */}
      <section className="about-hero mt-5">
        <div className="about-hero__grid container">

          {/* LEFT CONTENT - WHO WE ARE */}
          <div className="about-hero__content reveal">
            <div className="box-title ms-0 ps-0">
              <div className="text-subtitle text-primary fs-4 mb-2">Who We Are</div>
              <h3 className="mt-4 title">
                Your trusted partner in real estate.
              </h3>
            </div>

            <p>
              At <strong>SOS Infrabulls International Pvt. Ltd.</strong>, we believe that owning a property is not just an investment, but it's a dream come true for many. Therefore, we are committed to making the process of finding your dream property as hassle-free and easy as possible.
            </p>

            <p>
              Our team of experts understands the complexities of the real estate market, and we use our experience to guide you every step of the way. Whether you are looking for a residential property, commercial property, or industrial land, we have a wide range of options to choose from.
            </p>

            <p>
              We are dedicated to providing exceptional customer service, and our focus is always on ensuring that our clients are satisfied with their purchases. With our fast and easy search process, you can find your dream property quickly and easily.
            </p>

            <div className="about-hero__cta">
              <Link to="/contact" className="about-btn primary">
                Talk to our team
              </Link>

              <Link to="/" className="about-btn ghost">
                Explore portfolio
              </Link>
            </div>

          </div>

          {/* RIGHT CARD */}
          <div className="about-hero__card tilt-card reveal">
            <p className="card-label text-white">Indore First</p>
            <h3>Exclusive projects across the city's fastest growing corridors.</h3>

            <ul>
              <li>Backed by Giants: Nurtured by SOS Infrabulls International Pvt. Ltd.</li>
              <li>Strategic Hub: Exclusive properties in Indore, MP’s economic capital.</li>
              <li>Complete Portfolio: Expert solutions for Residential, Commercial, and Industrial land.</li>
              <li>Secure Future: Dedicated to providing safe investments and high-value resale opportunities.</li>
            </ul>
          </div>

        </div>
      </section>
    </>
  );
}

export default Overview;
