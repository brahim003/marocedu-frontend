import React from "react";
import { useNavigate } from "react-router-dom";
import { schools } from "../data/schools.js";

export default function Ecoles() {
  const navigate = useNavigate();

  // hna knrabohom par order alphabetique
  const sorted = [...schools].sort((a, b) => {
    if (a.isPartner !== b.isPartner) return a.isPartner ? -1 : 1;
    return a.name.localeCompare(b.name, "fr", { sensitivity: "base" });
  });

  return (
    <main className="container py-3">
      {/* Header صغير ومتوازن */}
      <header className="mt-2">
        <div className="bg-white border rounded-4 shadow-sm px-3 py-2">
          <div className="d-flex align-items-center gap-2">

            {/* العنوان وسط تمامًا */}
            <h1 className="h6 mb-0 flex-grow-1 text-center text-truncate">
              Choisir votre école
            </h1>

            {/* placeholder يمين بنفس عرض زر الرجوع لضبط التمركز */}
            <span className="d-inline-block" style={{ width: 36, height: 36 }} aria-hidden="true" />
          </div>
        </div>
      </header>

      {/* Grid ديال الكاردات */}
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
                    {/* Logo أو Placeholder */}
                    {s.logo ? (
                      <img
                        src={s.logo}
                        alt=""
                        width={48}
                        height={48}
                        className="rounded"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="bg-light rounded" style={{ width: 48, height: 48 }} aria-hidden="true" />
                    )}

                    {/* نصوص */}
                    <div className="flex-grow-1">
                      <div className="fw-semibold text-dark" style={{ fontSize: 16 }}>{s.name}</div>
                      <div className="text-secondary small" style={{ fontSize: 13 }}>{s.city}</div>
                    </div>

                    {/* Badge */}
                    {s.isPartner && (
                      <span className="badge rounded-pill bg-success fw-semibold">Partenaire</span>
                    )}

                    <i className="bi bi-chevron-right text-secondary ms-2" aria-hidden="true" />
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Empty state (كيبان غير إلا ماكانت حتى مدرسة) */}
        {sorted.length === 0 && (
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
