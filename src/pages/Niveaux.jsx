// src/pages/Niveaux.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cycles, cycleLabels, levelsByCycle } from "../data/levels";

export default function Niveaux() {
  const navigate = useNavigate();
  const { slug } = useParams(); // school slug from URL

  // navigate to supplies list for the chosen level
  const handleSelectLevel = (level) => {
    navigate(`/ecoles/${slug}/niveaux/${level.slug}/fournitures`);
  };

  return (
    <main className="container py-3">
      {/* School welcome card */}
      <section className="card  p-3" style={{borderBottomLeftRadius:0,borderBottomRightRadius:0,borderTopLeftRadius:12,borderTopRightRadius:12}}>
        <div className="fw-semibold " style={{ fontSize: 16 }}>
          Bienvenue à l’école {slug}
        </div>
        <div className="text-secondary small">
          Choisissez votre niveau ci-dessous.
        </div>
      </section>

      {/* Back + title */}
      <header className="mb-2">
        <div className="bg-white  shadow-sm px-3 py-2 mb-3" style={{borderBottomLeftRadius:12,borderBottomRightRadius:12}}>
          <div className="d-flex align-items-center gap-2">
            {/* <button
              className="btn btn-light rounded-circle border d-inline-flex align-items-center justify-content-center"
              onClick={() => navigate(-1)}
              aria-label="Retour"
              style={{ width: 36, height: 36 }}
            >
              <i className="bi bi-arrow-left-short fs-5" />
            </button> */}

            <h1 className="h6 mb-0 flex-grow-1 text-center text-truncate">
              Choisissez votre niveau
            </h1>

            <span className="d-inline-block" style={{ width: 36, height: 36 }} aria-hidden="true" />
          </div>
        </div>
      </header>

      {/* SECTIONED LIST (no tabs) */}
      <div className="d-flex flex-column gap-3">
        {cycles.map((cycle) => {
          const levels = levelsByCycle[cycle] ?? [];
          return (
            <section key={cycle} aria-labelledby={`cycle-${cycle}`}>
              {/* Section header */}
              <div
                id={`cycle-${cycle}`}
                className="px-3 py-2"
                
                style={{ background: "#eaf3ff", borderBottomLeftRadius: 0,borderBottomRightRadius: 0,borderTopLeftRadius:12,borderTopRightRadius:12}}
              >
                <span className="fw-semibold text-uppercase" style={{ letterSpacing: ".02em" }}>
                  {cycleLabels[cycle]}
                </span>
              </div>

              {/* Levels list */}
              <div className="bg-white border rounded-4 shadow-sm">
                {levels.length === 0 && (
                  <div className="text-secondary small py-3 px-3" aria-live="polite">
                    Aucun niveau disponible
                  </div>
                )}

                {levels.map((level, idx) => (
                  <button
                    key={level.slug}
                    type="button"
                    onClick={() => handleSelectLevel(level)}
                    className={`w-100 text-start bg-white border-0 px-3 py-3 d-flex align-items-center justify-content-between ${
                      idx < levels.length - 1 ? "border-bottom" : ""
                    }`}
                    aria-label={level.label}
                    style={{ borderRadius: idx === levels.length - 1 ? "0 0 1rem 1rem" : 0 }}
                  >
                    <span className="fw-semibold">{level.label}</span>
                    <i className="bi bi-chevron-right text-secondary" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Helper link */}
      <div className="text-center mt-3">
        <button type="button" className="btn btn-link p-0">
          Je ne trouve pas mon niveau
        </button>
      </div>
    </main>
  );
}
