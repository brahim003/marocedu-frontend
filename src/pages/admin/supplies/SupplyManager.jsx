import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SupplyManager() {
  const { levelId, slug } = useParams();
  const location = useLocation();
  const [supplies, setSupplies] = useState([]);

  useEffect(() => {
    fetchSupplies();
  }, [levelId]);

  const fetchSupplies = () => {
    // استعمال الـ Endpoint اللي زدنا فالبكند بـ ID
    axios.get(`/api/supplies/level/${levelId}`)
      .then((res) => setSupplies(res.data))
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet article ?")) {
      axios.delete(`/api/supplies/${id}`)
        .then(() => {
          setSupplies(supplies.filter(s => s.id !== id));
        })
        .catch(err => alert("Erreur lors de la suppression"));
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Gestion des Fournitures</h4>
          <span className="badge bg-light text-dark border">{location.state?.levelName} - {slug.toUpperCase()}</span>
        </div>
        <button className="btn btn-success d-flex align-items-center gap-2 shadow-sm rounded-pill px-4">
          <i className="bi bi-plus-circle"></i> Ajouter un Article
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-dark text-white">
            <tr>
              <th className="ps-4">Produit</th>
              <th>Marque</th>
              <th>Prix</th>
              <th className="text-center pe-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {supplies.length > 0 ? supplies.map((s) => (
              <tr key={s.id}>
                <td className="ps-4">
                  <div className="d-flex align-items-center gap-3 py-1">
                    <img 
                      src={s.image ? `/api/supplies/image/${s.image}` : "/placeholder-product.png"} 
                      width="45" height="45" className="rounded-3 border object-fit-cover" alt="" 
                    />
                    <span className="fw-semibold">{s.name}</span>
                  </div>
                </td>
                <td className="text-muted small">{s.marque || "N/A"}</td>
                <td className="fw-bold text-primary">{s.price} {s.currency || 'DH'}</td>
                <td className="text-center pe-4">
                  <button className="btn btn-outline-danger btn-sm rounded-3" onClick={() => handleDelete(s.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="text-center p-5 text-muted">
                  <i className="bi bi-box2 mb-2 d-block fs-1"></i>
                  Aucune fourniture trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}