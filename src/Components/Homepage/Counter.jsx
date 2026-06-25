import React, { useState, useEffect, useRef } from "react";
import "./Counter.css";

const CounterCard = ({ item, index, delay }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp = null;
    const endValue = item.value;
    const duration = 2500; // Smooth 2.5s duration

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing out quad function for smooth luxury ending
      const easeProgress = progress * (2 - progress); 
      
      setCount(Math.floor(easeProgress * endValue));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [hasStarted, item.value]);

  // Determine which card receives the special highlight
  const isHighlighted = index === 1 || index === 2; 

  return (
    <div 
      className={`pc-card ${hasStarted ? "pc-visible" : ""} ${isHighlighted ? "pc-highlight-card" : ""}`} 
      ref={cardRef}
      style={{ "--pc-delay": `${delay}s` }}
    >
      {/* Animated Conic Border Edge */}
      <div className="pc-border-glow"></div>
      
      <div className="pc-card-inner">
        {/* Floating Icon Base */}
        <div className="pc-icon-container">
          <div className="pc-icon-box">
            <i className={`fas fa-${item.icon}`}></i>
          </div>
          <div className="pc-icon-pulse"></div>
        </div>

        {/* Counter Typography */}
        <div className="pc-content">
          <h3 className="pc-number">
            {count.toLocaleString()}<span>+</span>
          </h3>
          <p className="pc-label">{item.label}</p>
        </div>
      </div>
    </div>
  );
};

export default function Counter() {
  const data = [
    { icon: "handshake", value: 10000, label: "Success Stories" },
    { icon: "users", value: 20000, label: "Satisfied Clients" },
    { icon: "award", value: 6, label: "Years Experience" },
    { icon: "building", value: 27, label: "Total Projects" }
  ];

  return (
    <section className="pc-wrapper">
      {/* Background Mesh Glow Ambient Art */}
      <div className="pc-ambient-glow pc-ambient-1"></div>
      <div className="pc-ambient-glow pc-ambient-2"></div>

      <div className="pc-container">
        <div className="pc-header">
          <span className="pc-badge">Performance Metrics</span>
          <h2 className="pc-main-title">
            Driving growth with <br />
            <span className="pc-gradient-text">Precision & Scale</span>
          </h2>
          <p className="pc-subtitle">
            Empowering real estate investments across generations with validated market dominance.
          </p>
        </div>

        <div className="pc-grid">
          {data.map((item, index) => (
            <CounterCard key={index} index={index} item={item} delay={index * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}