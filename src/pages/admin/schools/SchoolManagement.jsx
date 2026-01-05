import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSchools, deleteSchool } from "../../../services/SchoolService";

export default function SchoolManagement() {
    const [schools, setSchools] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchSchools = async () => {
        try {
            const response = await getAllSchools();
            setSchools(response.data);
        } catch (error) {
            console.error("Erreur chargement écoles:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette école ?")) {
            try {
                await deleteSchool(id);
                setSchools(schools.filter(s => s.id !== id));
            } catch (error) {
                alert("Erreur lors de la suppression.");
            }
        }
    };

    // 🔥 دالة ذكية لإصلاح رابط الصورة
    const getLogoUrl = (logoPath) => {
        if (!logoPath) return "";
        // إذا كان الرابط القديم فيه ديجا /logos/، كنخلوه كما هو مع السيرفر
        if (logoPath.startsWith("/logos/")) {
            return `http://localhost:8080${logoPath}`;
        }
        // إذا كان جديد (فيه غير السمية)، كنزيدو ليه /logos/
        return `http://localhost:8080/logos/${logoPath}`;
    };

    if (isLoading) return <div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold text-dark">🏫 Gestion des Écoles</h2>
                    <button 
                        className="btn btn-primary rounded-pill px-4 shadow-sm"
                        onClick={() => navigate("/admin/schools/create")}
                    >
                        <i className="bi bi-plus-lg me-2"></i> Nouvelle École
                    </button>
                </div>

                <div className="row g-4">
                    {schools.length === 0 ? (
                        <div className="col-12 text-center text-muted py-5 border rounded-4 bg-white">
                            Aucune école trouvée.
                        </div>
                    ) : (
                        schools.map((school) => (
                            <div className="col-md-6 col-lg-4 col-xl-3" key={school.id}>
                                <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-4">
                                    <div className="mx-auto mb-3 d-flex align-items-center justify-content-center bg-white border rounded-circle shadow-sm" style={{width: 90, height: 90, overflow: 'hidden'}}>
                                        {school.logo ? (
                                            <img 
                                                // ✅ استعمال الدالة الذكية
                                                src={getLogoUrl(school.logo)} 
                                                alt={school.name}
                                                style={{width: '100%', height: '100%', objectFit: 'cover'}} 
                                                // ✅ STOP LOOP: إصلاح مشكل التكرار اللانهائي
                                                onError={(e) => {
                                                    e.target.onerror = null; 
                                                    e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                                                }}
                                            />
                                        ) : (
                                            <i className="bi bi-building fs-3 text-secondary"></i>
                                        )}
                                    </div>
                                    <h5 className="fw-bold mb-1 text-truncate">{school.name}</h5>
                                    <p className="text-muted small mb-3">{school.city}</p>
                                    
                                    <div className="mt-auto pt-3 border-top">
                                        <button className="btn btn-sm btn-outline-danger rounded-pill px-3 w-100" onClick={() => handleDelete(school.id)}>
                                            <i className="bi bi-trash me-2"></i> Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}