import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../Firebase/Firebase';

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = collection(db, 'team');
    const q = query(ref, orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const rec = snap.docs.map((d) => ({ firebaseDocId: d.id, ...d.data() }));
      const sorted = rec.sort((a, b) => {
        const idA = a.id?.toString() || '';
        const idB = b.id?.toString() || '';
        const numA = parseFloat(idA);
        const numB = parseFloat(idB);
        return (!isNaN(numA) && !isNaN(numB)) ? numA - numB : idA.localeCompare(idB);
      });
      setMembers(sorted);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, []);

  return (
    <>
      <style>{`:root {
  --primary-gold: #4A97E4;
  --deep-navy: #0A2540;
  --soft-gray: #f8fafc;
  --glass-bg: rgba(255, 255, 255, 0.88);
}

/* =========================
   SECTION
========================= */
.team-premium-section {
  padding: 120px 0;
  background-color: #ffffff;
  font-family: 'Inter', -apple-system, sans-serif;
}

.team-header {
  text-align: center;
  margin-bottom: 80px;
}

.team-subtitle {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: var(--primary-gold);
  margin-bottom: 12px;
}

.team-title {
  font-size: 3rem;
  color: var(--deep-navy);
  font-weight: 300;
  letter-spacing: -1px;
}

.team-title strong {
  font-weight: 700;
}

/* =========================
   CARD WRAPPER
========================= */
.member-card-wrapper {
  padding: 8px; /* reduced padding */
  perspective: 1000px;
}

/* =========================
   CARD
========================= */
.premium-member-card {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  aspect-ratio: 4 / 5.5;
  background: #fff;
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  cursor: pointer;
}

.premium-member-card:hover {
  transform: translateY(-6px);
}

/* =========================
   IMAGE
========================= */
.team-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.8s ease;
}

.premium-member-card:hover .team-img {
  transform: scale(1.1);
}

/* =========================
   IMAGE OVERLAY
========================= */
.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 40%,
    rgba(10, 37, 64, 0.85) 100%
  );
  opacity: 0.65;
  transition: opacity 0.4s ease;
  z-index: 1;
}

.premium-member-card:hover .image-overlay {
  opacity: 0.9;
}

/* =========================
   INFO FLOATING CARD
========================= */
.member-info-floating {
  position: absolute;
  bottom: 18px;
  left: 16px;
  right: 16px;
  padding: 20px 16px;
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.3);

  text-align: center;

  transform: translateY(12px);
  opacity: 0;
  transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
}

.premium-member-card:hover .member-info-floating {
  transform: translateY(0);
  opacity: 1;
}

/* =========================
   NAME & ROLE (CENTERED)
========================= */
.member-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--deep-navy);
  margin: 0;
  text-align: center;
  letter-spacing: -0.3px;
}

.member-role {
  font-size: 0.8rem;
  color: var(--primary-gold);
  font-weight: 600;
  text-transform: capitalize;
  margin-top: 6px;
  letter-spacing: 1px;
  text-align: center;
}

/* =========================
   SWIPER
========================= */
.premium-swiper {
  padding-bottom: 80px !important;
}

.swiper-pagination-bullet {
  background: var(--deep-navy) !important;
  opacity: 0.15;
}

.swiper-pagination-bullet-active {
  width: 28px !important;
  border-radius: 6px !important;
  background: var(--primary-gold) !important;
  opacity: 1;
}

/* =========================
   LOADING SKELETON
========================= */
.skeleton-card {
  width: 100%;
  aspect-ratio: 4 / 5.5;
  background: #eee;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
}

.skeleton-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: loading-shimmer 1.5s infinite;
}

@keyframes loading-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* =========================
   MOBILE FIX
========================= */
@media (max-width: 768px) {
  .team-title {
    font-size: 2.2rem;
  }

  .member-info-floating {
    opacity: 1;
    transform: translateY(0);
    padding: 16px;
  }
}
`}</style>

      <section className="team-premium-section">
        <div className="container">
          <div className="team-header m-0">
            <span className="team-subtitle">Meet the Visionaries</span>
            <h2 className="team-title">Our <strong>Core Team</strong></h2>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={10}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              576: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            className="premium-swiper"
          >
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <SwiperSlide key={i}>
                  <div className="member-card-wrapper">
                    <div className="skeleton-card"></div>
                  </div>
                </SwiperSlide>
              ))
            ) : members.map((m) => (
              <SwiperSlide key={m.firebaseDocId}>
                <div className="member-card-wrapper">
                  <div className="premium-member-card">
                    <img
                      src={m.image || 'https://via.placeholder.com/400x550'}
                      alt={m.name}
                      className="team-img"
                    />
                    <div className="image-overlay"></div>

                    <div className="member-info-floating">
                      <h3 className="member-name">{m.name}</h3>
                      <p className="member-role text-center mt-0 pt-0">{m.role.toLowerCase()}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default Team;