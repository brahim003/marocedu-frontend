// src/components/FindListCTA/FindListCTA.jsx
import React from 'react';
import './FindListCTA.css';

export default function FindListCTA({
  title = 'Votre liste de fournitures, validée par les enseignants',
  subtitle = 'Choisissez votre école et votre niveau pour obtenir votre liste.',
  primaryLabel = 'Commencer',
  onPrimary,
  showTrustLine = true,
  className = '',
}) {
  const handleClick = () => {
    if (typeof onPrimary === 'function') {
      onPrimary();
    } else {
      // fallback: scroll to schools section if it exists
      const el = document.getElementById('schools');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      className={`findlist-cta card border-0 shadow-sm mx-auto ${className}`}
      role="region"
      aria-labelledby="findlist-cta-title"
    >
      <div className="card-body p-1">
        <h2 id="findlist-cta-title" className="h5 fw-bold mb-2">
          {title}
        </h2>

        <p className="text-muted small mb-3">
          {subtitle}
        </p>

        <button
          type="button"
          className="btn btn-primary w-100 rounded-pill py-3"
          onClick={handleClick}
          aria-label={primaryLabel}
        >
          {primaryLabel}
        </button>

        {/* {showTrustLine && (
          <div className="text-muted text-center small mt-3">
            Livraison partout au Maroc · Paiement sécurisé · Retours faciles
          </div>
        )} */}
      </div>
    </div>
  );
}
