// src/pages/Niveaux.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export const cycles = ["maternelle", "primaire", "college", "lycee"];

export const cycleLabels = {
  maternelle: "Maternelle",
  primaire: "Primaire",
  college: "Collège",
  lycee: "Lycée",
};

export default function Niveaux() {
  const navigate = useNavigate();
  const { slug } = useParams(); // school slug from URL

  const [levels, setLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch levels from backend
  useEffect(() => {
    axios.get(`/api/levels/by-school/${slug}`)
      .then((response) => {
        const raw = response.data;

        let data = [];
        try {
          if (typeof raw === "string" && raw.trim() !== "") {
            data = JSON.parse(raw);
          } else if (Array.isArray(raw)) {
            data = raw;
          }
        } catch (e) {
          console.error("Failed to parse API response (raw):", raw);
        }

        if (!Array.isArray(data)) {
          console.warn("API response is not an array, fallback to empty array");
          data = [];
        }

        setLevels(data);
      })
      .catch((error) => {
        console.error("Error fetching levels:", error);
        setLevels([]);
      })
      .finally(() => setIsLoading(false));
  }, [slug]);




  // Group levels by cycle safely
  const groupedLevels = cycles.reduce((acc, cycle) => {
    acc[cycle] = Array.isArray(levels) ? levels.filter(l => l.cycle === cycle) : [];
    return acc;
  }, {});

  const handleSelectLevel = (level) => {
    navigate(`/ecoles/${slug}/niveaux/${level.slug}/fournitures`);
  };

  if (isLoading) {
    return (
      <main className="container py-5 d-flex justify-content-center">
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-3">
      {/* School welcome card */}
      <section className="card p-3" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
        <div className="fw-semibold" style={{ fontSize: 16 }}>
          Bienvenue à l’école {slug}
        </div>
        <div className="text-secondary small">
          Choisissez votre niveau ci-dessous.
        </div>
      </section>

      {/* Header */}
      <header className="mb-2">
        <div className="bg-white shadow-sm px-3 py-2 mb-3" style={{ borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
          <div className="d-flex align-items-center gap-2">
            <h1 className="h6 mb-0 flex-grow-1 text-center text-truncate">
              Choisissez votre niveau
            </h1>
            <span className="d-inline-block" style={{ width: 36, height: 36 }} aria-hidden="true" />
          </div>
        </div>
      </header>

      {/* Sectioned levels list */}
      <div className="d-flex flex-column gap-3">
        {cycles.map((cycle) => {
          const levelsInCycle = groupedLevels[cycle] ?? [];

          // --- MODIFICATION 1 ---
          // Si ce cycle n'a pas de niveaux, on ne rend rien du tout.
          if (levelsInCycle.length === 0) {
            return null;
          }

          return (
            <section key={cycle} aria-labelledby={`cycle-${cycle}`}>
              {/* Section header */}
              <div
                id={`cycle-${cycle}`}
                className="px-3 py-2"
                style={{ background: "#eaf3ff", borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
              >
                <span className="fw-semibold text-uppercase" style={{ letterSpacing: ".02em" }}>
                  {cycleLabels[cycle]}
                </span>
              </div>

              {/* Levels */}
              <div className="bg-white border rounded-4 shadow-sm">
                
                {/* --- MODIFICATION 2 ---
                    L'ancien bloc "Aucun niveau disponible" a été supprimé d'ici.
                */}

                {levelsInCycle.map((level, idx) => (
                  <button
                    key={level.slug}
                    type="button"
                    onClick={() => handleSelectLevel(level)}
                    className={`w-100 text-start bg-white border-0 px-3 py-3 d-flex align-items-center justify-content-between ${idx < levelsInCycle.length - 1 ? "border-bottom" : ""
                      }`}
                    aria-label={level.name}
                    style={{ borderRadius: idx === levelsInCycle.length - 1 ? "0 0 1rem 1rem" : 0 }}
                  >
                    <span className="fw-semibold">{level.name}</span>
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