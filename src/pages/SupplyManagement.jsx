// Fichier: src/pages/SupplyManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SupplyManagement() {
    const [supplies, setSupplies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    
    // Helpers
    const fmtMAD = (n) => new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(n);

    // 1. Récupérer toutes les fournitures (READ)
    const fetchSupplies = () => {
        axios.get("/api/supplies")
            .then(response => {
                // S'assurer que la réponse est un tableau
                setSupplies(Array.isArray(response.data) ? response.data : []);
            })
            .catch(err => console.error("Erreur de récupération des fournitures:", err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchSupplies();
    }, []);

    // 2. Fonction pour supprimer (DELETE)
    const handleDelete = async (supplyId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette fourniture ? Cette action est irréversible.")) {
            try {
                // 🚨 Endpoint backend: DELETE /api/supplies/{id}
                await axios.delete(`/api/supplies/${supplyId}`);
                alert("Fourniture supprimée avec succès!");
                // Recharger la liste
                fetchSupplies(); 
            } catch (error) {
                console.error("Erreur lors de la suppression:", error);
                alert("Erreur lors de la suppression de la fourniture. (Vérifiez le backend)");
            }
        }
    };
    
    // Fonction pour naviguer vers le formulaire de création/modification
    const handleEdit = (supplyId) => {
        // Cette route mènera à un formulaire d'édition (prochaine étape)
        navigate(`/admin/supplies/edit/${supplyId}`); 
    };
    
    const handleCreate = () => {
        // Cette route mènera à un formulaire de création (prochaine étape)
        navigate(`/admin/supplies/create`); 
    };


    if (isLoading) return <div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>;
    
    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 fw-bold text-dark">📚 Gestion des Fournitures (CRUD)</h1>
                    
                    {/* Bouton Créer (CREATE) */}
                    <button 
                        onClick={handleCreate} 
                        className="btn btn-primary rounded-pill px-4 shadow-sm"
                    >
                        <i className="bi bi-plus-lg me-2"></i> Ajouter une Fourniture
                    </button>
                </div>
                
                {/* Tableau des fournitures */}
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-white border-bottom">
                                <tr>
                                    <th className="py-3 ps-4">ID</th>
                                    <th>Nom</th>
                                    <th>Prix de Base</th>
                                    <th>Type</th>
                                    <th>Options</th>
                                    <th className="text-end pe-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {supplies.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            Aucune fourniture trouvée. Ajoutez-en une !
                                        </td>
                                    </tr>
                                ) : (
                                    supplies.map(supply => (
                                        <tr key={supply.id}>
                                            <td className="ps-4 fw-bold text-primary">#{supply.id}</td>
                                            <td className="fw-bold text-dark">{supply.name}</td>
                                            <td>{fmtMAD(supply.price)}</td>
                                            <td>
                                                <span className={`badge ${supply.isBook ? 'bg-primary-subtle text-primary border border-primary-subtle' : 'bg-secondary-subtle text-secondary border border-secondary-subtle'}`}>
                                                    {supply.isBook ? 'Livre' : 'Autre'}
                                                </span>
                                            </td>
                                            <td><span className="badge bg-dark text-white rounded-pill">{supply.options?.length || 0}</span></td>
                                            <td className="text-end pe-4">
                                                {/* Bouton Modifier (UPDATE) */}
                                                <button 
                                                    onClick={() => handleEdit(supply.id)}
                                                    className="btn btn-sm btn-outline-success me-2 rounded-pill"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                {/* Bouton Supprimer (DELETE) */}
                                                <button 
                                                    onClick={() => handleDelete(supply.id)}
                                                    className="btn btn-sm btn-outline-danger rounded-pill"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                
            </div>
        </div>
    );
}