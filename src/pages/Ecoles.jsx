import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Ecoles() {
  const navigate = useNavigate();

  // 1. Create state for schools and loading status
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Fetch data from the API when the component loads
  useEffect(() => {
    axios.get("/api/schools") // This uses the proxy from vite.config.js
      .then(response => {
        setSchools(response.data); // Put the API data into state
      })
      .catch(error => {
        console.error("Error fetching schools:", error);
      })
      .finally(() => {
        setIsLoading(false); // Stop loading, even if there was an error
      });
  }, []); 

  // 🔥 3. SMART LOGO FUNCTION (Fixes the broken image issue)
  const getLogoUrl = (logoPath) => {
      if (!logoPath) return "";
      // If it's an old path (already has /logos/), just add the base URL
      if (logoPath.startsWith("/logos/")) {
          return `http://localhost:8080${logoPath}`;
      }
      // If it's a new path (just filename), add the full folder path
      return `http://localhost:8080/logos/${logoPath}`;
  };

  // 4. Sort schools alphabetically
  const sorted = [...schools].sort((a, b) =>
    (a.name || "").localeCompare(b.name || "", "fr", { sensitivity: "base" })
  );

  // 5. Loading Spinner
  if (isLoading) {
    return (
      <main className="container py-5 d-flex justify-content-center">
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </main>
    );
  }

  // 6. Main Render
  return (
    <main className="container py-3">
      <header className="mt-2">
        <div className="bg-white border rounded-4 shadow-sm px-3 py-2">
          <div className="d-flex align-items-center gap-2">
            <h1 className="h6 mb-0 flex-grow-1 text-center text-truncate">
              Choisir votre école
            </h1>
            <span className="d-inline-block" style={{ width: 36, height: 36 }} aria-hidden="true" />
          </div>
        </div>
      </header>

      <section className="mt-3">
        <div className="row g-3 row-cols-1 row-cols-md-2">
          {sorted.map((s) => (
            <div className="col" key={s.id}>
              <button
                type="button"
                className="w-100 text-start btn p-0"
                aria-label={`${s.name}, ${s.city}`}
                onClick={() => navigate(`/ecoles/${s.slug}/niveaux`)}
              >
                <div className="card border-0 shadow-sm rounded-4 p-3" style={{ minHeight: "80px" }}>
                  <div className="d-flex align-items-center gap-3">
                    
                    {/* ✅ UPDATED IMAGE LOGIC */}
                    <div style={{ width: 48, height: 48, flexShrink: 0 }}>
                        {s.logo ? (
                          <img
                            src={getLogoUrl(s.logo)} // Uses the smart function
                            alt={s.name}
                            className="rounded"
                            style={{ objectFit: "cover", width: "100%", height: "100%" }}
                            // Prevents infinite loops if image is missing
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                            }}
                          />
                        ) : (
                          <div className="bg-light rounded w-100 h-100 d-flex align-items-center justify-content-center">
                              <i className="bi bi-building text-secondary"></i>
                          </div>
                        )}
                    </div>

                    <div className="flex-grow-1">
                      <div className="fw-semibold text-dark" style={{ fontSize: 16 }}>{s.name}</div>
                      <div className="text-secondary small" style={{ fontSize: 13 }}>{s.city}</div>
                    </div>

                    <i className="bi bi-chevron-right text-secondary ms-2" aria-hidden="true" />
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {!isLoading && sorted.length === 0 && (
          <div className="text-center text-secondary mt-4" aria-live="polite">
            <div className="fw-medium">Aucune école trouvée</div>
            <button type="button" className="btn btn-outline-secondary btn-sm mt-2">
              Votre école n’apparaît pas ?
            </button>
          </div>
        )}
      </section>
    </main>
  );
}