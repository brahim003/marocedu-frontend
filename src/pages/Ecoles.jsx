import React, { useState, useEffect } from "react"; // Added useState and useEffect
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Added axios

// Removed: import { schools } from "../data/schools.js";

export default function Ecoles() {
  const navigate = useNavigate();

  // 1. Create state for schools and loading status
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

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
  }, []); // The empty [] means this runs only once

  // 3. The sort logic now works on the 'schools' state
  // This is the "safe" version
  const sorted = [...schools].sort((a, b) =>
    (a.name || "").localeCompare(b.name || "", "fr", { sensitivity: "base" })
  );

  // 4. Show a loading message while fetching
  // if (isLoading) {
  //   return (
  //     <main className="container py-3 text-center">
  //       <div>Loading schools...</div>
  //     </main>
  //   );
  // }

  // 3. Show a spinner while loading
  // 3. Show a spinner while loading
  if (isLoading) {
    return (
      // Added classes to center the spinner
      <main className="container py-5 d-flex justify-content-center">
        
        {/* Updated to spinner-grow */}
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

      </main>
    );
  }

  // 5. The rest of your component logic remains the same
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
                    {s.logo ? (
                      <img
                        src={s.logo} // Assumes your DTO has a 'logo' field
                        alt=""
                        width={48}
                        height={48}
                        className="rounded"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="bg-light rounded" style={{ width: 48, height: 48 }} aria-hidden="true" />
                    )}

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

        {/* This "empty state" will now only show if loading is finished AND no schools were found */}
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