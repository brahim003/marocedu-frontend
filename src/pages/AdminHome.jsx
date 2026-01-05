import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminHome() {
    const navigate = useNavigate();

    const adminActions = [
        {
            title: "Gérer les Commandes",
            icon: "bi bi-box-seam-fill",
            color: "text-primary",
            bg: "bg-primary-subtle",
            description: "Visualiser, valider et gérer l'expédition de toutes les commandes clients.",
            route: "/admin/orders" 
        },
        {
            title: "Gérer Écoles & Niveaux",
            icon: "bi bi-building-fill",
            color: "text-info",
            bg: "bg-info-subtle",
            description: "Ajouter, modifier ou supprimer les écoles et leur structure de niveaux.",
            route: "/admin/schools" 
        },
        {
            title: "Gérer les Fournitures",
            icon: "bi bi-book-fill",
            color: "text-warning",
            bg: "bg-warning-subtle",
            description: "Mettre à jour le catalogue, les prix des produits et leurs options.",
            // ✅ تم التعديل ليتوافق مع Route في App.jsx
            route: "/admin/ecoles" 
        },
        {
            title: "Rapports & Stats",
            icon: "bi bi-bar-chart-line-fill",
            color: "text-success",
            bg: "bg-success-subtle",
            description: "Consulter les statistiques de vente et l'état du stock.",
            route: "/admin/reports" 
        },
    ];

    return (
        <div className="bg-white min-vh-100 py-5">
            <div className="container">
                <h1 className="display-5 fw-bold text-dark mb-5 border-bottom pb-3">
                    Panneau de Configuration Admin
                </h1>
                
                <div className="row g-4">
                    {adminActions.map((action, index) => (
                        <div key={index} className="col-lg-6 col-xl-4">
                            <div 
                                className={`card h-100 border-0 shadow-lg rounded-4 overflow-hidden ${action.bg}`}
                                style={{cursor: 'pointer', transition: 'transform 0.2s'}}
                                onClick={() => navigate(action.route)}
                            >
                                <div className="card-body p-4 d-flex align-items-center">
                                    <i className={`${action.icon} ${action.color} fs-2 me-4`}></i>
                                    <div>
                                        <h5 className={`card-title fw-bolder ${action.color}`}>{action.title}</h5>
                                        <p className="card-text small text-dark mt-1 mb-0">{action.description}</p>
                                    </div>
                                </div>
                                <div className={`position-absolute end-0 top-0 m-3 ${action.color}`}>
                                    <i className="bi bi-arrow-right-circle-fill fs-4"></i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}