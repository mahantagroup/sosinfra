import React, { useEffect, useState } from 'react';
import './CustomCursor.css';

const isInteractive = (el) => {
  if (!el) return false;
  const selectable = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
  if (selectable.includes(el.tagName)) return true;
  if (el.getAttribute && (el.getAttribute('role') === 'button' || el.getAttribute('data-cursor') === 'hover')) return true;
  if (el.classList) {
    return (
      el.classList.contains('btn') ||
      el.classList.contains('premium-nav-link') ||
      el.classList.contains('premium-cta-btn') ||
      el.classList.contains('premium-mobile-cta-btn')
    );
  }
  return false;
};

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const handleMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    const handleOver = (e) => setHover(isInteractive(e.target));
    const handleOut = (e) => setHover(false);

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
    };
  }, []);

  return (
    <div
      className={`custom-cursor ${hover ? 'hover' : ''}`}
      style={{ left: pos.x + 'px', top: pos.y + 'px' }}
      aria-hidden
    />
  );
}
