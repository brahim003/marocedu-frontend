import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLevels() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/levels/by-school/${slug}`)
      .then((res) => {
        let data = res.data;
        if (typeof data === "string") data = JSON.parse(data);
        setLevels(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="text-center p-5">Chargement...</div>;

  return (
    <div className="container py-4">
      <button className="btn btn-light mb-4 shadow-sm" onClick={() => navigate('/admin/ecoles')}>
        <i className="bi bi-arrow-left"></i> Retour aux écoles
      </button>

      <h3 className="mb-4 fw-bold text-uppercase">Niveaux : <span className="text-primary">{slug}</span></h3>
      
      <div className="row g-3">
        {levels.map((level) => (
          <div className="col-md-3" key={level.id || level.slug}>
            <div 
              className="card border-0 shadow-sm p-4 text-center h-100 level-card"
              onClick={() => navigate(`/admin/ecoles/${slug}/levels/${level.id}/fournitures`, { 
                state: { levelName: level.name, levelId: level.id } 
              })}
              style={{ cursor: "pointer", transition: "0.2s", borderRadius: "12px", background: "#f8f9fa" }}
            >
              <div className="fw-bold text-dark fs-5">{level.name}</div>
              <div className="badge bg-soft-primary text-primary mt-2 text-uppercase" style={{ fontSize: '10px' }}>
                {level.cycle}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        .level-card:hover { background-color: #0d6efd !important; color: white !important; }
        .level-card:hover .text-dark, .level-card:hover .text-primary { color: white !important; }
      `}</style>
    </div>
  );
}