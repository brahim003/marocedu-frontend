import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// ✅ Import الصحيح للسرفيس
import { createSchool } from '../../../services/SchoolService';

export default function AddSchool() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // States
    const [name, setName] = useState('');
    const [city, setCity] = useState('Casablanca');
    const [slug, setSlug] = useState('');
    const [logo, setLogo] = useState(null);

    // Slug Generator
    const handleNameChange = (e) => {
        const val = e.target.value;
        setName(val);
        const autoSlug = val.toLowerCase()
                            .replace(/ /g, '-')
                            .replace(/[^\w-]+/g, '');
        setSlug(autoSlug);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await createSchool({ name, city, slug }, logo);
            alert("✅ École ajoutée avec succès !");
            navigate('/admin/schools');
        } catch (error) {
            console.error(error);
            alert("❌ Erreur serveur (Vérifiez le Backend).");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container">
                <div className="card border-0 shadow-sm rounded-4 p-4 mx-auto bg-white" style={{ maxWidth: "600px" }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="h4 fw-bold mb-0">Ajouter une École</h2>
                        <button onClick={() => navigate(-1)} className="btn btn-sm btn-outline-secondary rounded-pill px-3">
                            <i className="bi bi-arrow-left me-1"></i> Annuler
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="mb-3">
                            <label className="form-label fw-bold small text-secondary">Nom de l'école</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={name} 
                                onChange={handleNameChange} 
                                placeholder="Ex: Groupe Scolaire Al-Amal"
                                required 
                            />
                        </div>

                        {/* Slug */}
                        <div className="mb-3">
                            <label className="form-label fw-bold small text-secondary">Slug (Généré auto)</label>
                            <input type="text" className="form-control bg-light text-muted" value={slug} readOnly />
                        </div>

                        {/* City */}
                        <div className="mb-3">
                            <label className="form-label fw-bold small text-secondary">Ville</label>
                            <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)}>
                                <option value="Casablanca">Casablanca</option>
                                <option value="Rabat">Rabat</option>
                                <option value="Marrakech">Marrakech</option>
                                <option value="Tanger">Tanger</option>
                                <option value="Fès">Fès</option>
                                <option value="Agadir">Agadir</option>
                            </select>
                        </div>

                        {/* Logo */}
                        <div className="mb-4">
                            <label className="form-label fw-bold small text-secondary">Logo (Image)</label>
                            <input 
                                type="file" 
                                className="form-control" 
                                onChange={(e) => setLogo(e.target.files[0])} 
                                accept="image/*" 
                            />
                            <div className="form-text small">Formats acceptés : JPG, PNG, JPEG</div>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm" disabled={isLoading}>
                            {isLoading ? (
                                <span><span className="spinner-border spinner-border-sm me-2"></span>Enregistrement...</span>
                            ) : (
                                "Enregistrer l'École"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}