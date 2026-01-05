import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminSchools() {
  const [schools, setSchools] = useState([]);
  const navigate = useNavigate();

  // تأكد أن هذا هو عنوان السيرفر ديالك
  const API_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    // جلب المدارس من الباكند
    axios.get("/api/schools")
      .then((res) => setSchools(res.data))
      .catch(err => console.error("Erreur schools:", err));
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold text-dark">Gestion des Fournitures</h2>
      <p className="text-muted">Sélectionnez une école pour gérer ses articles scolaires.</p>
      
      <div className="row g-4">
        {schools.map((school) => (
          <div className="col-md-4" key={school.id}>
            <div 
              className="card shadow-sm border-0 p-4 text-center h-100"
              onClick={() => navigate(`/admin/ecoles/${school.slug}/levels`)}
              style={{ cursor: "pointer", transition: "0.3s", borderRadius: "15px" }}
            >
              <div className="mb-3 d-flex justify-content-center">
                <img 
                  // ✅ استعملنا الرابط الكامل مع الـ Endpoint الجديد اللي زدنا فـ SchoolController
                  src={school.logo ? `${API_BASE_URL}/api/schools/logo/${school.logo}` : "/placeholder-school.png"} 
                  alt={school.name} 
                  // جرب تزيد هادي باش تتأكد أن الصورة مابانتش بسبب خطأ فالمسار
                  onError={(e) => { e.target.src = "/placeholder-school.png"; }}
                  style={{ height: "100px", width: "100px", objectFit: "contain" }} 
                />
              </div>
              <h5 className="fw-bold mb-1">{school.name}</h5>
              <p className="text-muted small mb-3">{school.city}</p>
              <button className="btn btn-primary btn-sm w-100 rounded-pill">Gérer les niveaux</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}