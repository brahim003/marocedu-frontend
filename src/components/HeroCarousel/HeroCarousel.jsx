// src/components/HeroCarousel/HeroCarousel.jsx
import React from 'react';
import './HeroCarousel.css';

const slides = [
  { src: '/banners/slide1-desktop.png', alt: 'Slide 1' },
  { src: '/banners/slide2-desktop.png', alt: 'Slide 2' },
];

export default function HeroCarousel() {
  return (
    // بغيتو غير فالديسكتوب دابا
    <div className="d-none d-lg-block">
      <div
        id="heroCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="5000"
        data-bs-touch="true"
        aria-label="Homepage carousel"
      >
        <div className="carousel-indicators">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to={i}
              className={i === 0 ? 'active' : ''}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="carousel-inner">
          {slides.map((s, i) => (
            <div className={`carousel-item ${i === 0 ? 'active' : ''}`} key={s.src}>
              <img
                className="d-block w-100 hero-img"
                src={s.src}
                alt={s.alt}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
