// Fichier: src/pages/ProductDetail.jsx

import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductDetail() {
    
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Récupère l'option ID de l'URL (Ex: 14)
    const queryParams = new URLSearchParams(location.search);
    const optionIdFromUrl = queryParams.get("option"); 

    // --- ÉTATS DYNAMIQUES ---
    const [supplyDTO, setSupplyDTO] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null); 
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- LOGIQUE D'APPEL API ---
    useEffect(() => {
        const fetchProductDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const API_URL = `/api/supplies/${id}`; 
                const response = await axios.get(API_URL);
                const fetchedSupply = response.data;

                setSupplyDTO(fetchedSupply);

                // 1. Trouver l'option correcte (par l'URL ou la première par défaut)
                let initialOption;
                if (optionIdFromUrl) {
                    initialOption = fetchedSupply.options.find(
                        opt => opt.id === Number(optionIdFromUrl)
                    );
                }
                
                // 2. Prendre la première option si l'ID de l'URL est invalide
                if (!initialOption && fetchedSupply.options.length > 0) {
                    initialOption = fetchedSupply.options[0];
                }

                setSelectedOption(initialOption);

            } catch (err) {
                console.error("Erreur de chargement du produit:", err);
                // Si l'API retourne 404
                if (err.response && err.response.status === 404) {
                    setError("Le produit demandé n'existe pas.");
                } else {
                    setError("Erreur serveur lors du chargement des détails.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductDetails();
    }, [id, optionIdFromUrl]); 
    
    // --- RENDU CONDITIONNEL ---

    if (isLoading) {
        return <main className="container py-5 text-center">Chargement...</main>;
    }

    if (error || !selectedOption) {
        return (
            <main className="container py-5 alert alert-danger">
                ❌ {error || "Produit non trouvé"}
                <button onClick={() => navigate(-1)} className="btn btn-sm btn-link">
                    Retour
                </button>
            </main>
        );
    }

    // --- RENDU PRINCIPAL ---
    
    // 1. Détermine les images à afficher (List<ImageDTO.path> ou image principale)
    const imagesToDisplay = selectedOption.images && selectedOption.images.length > 0
        ? selectedOption.images.map(img => img.path) 
        : [selectedOption.image]; 
    
    // 2. Extraction des données
    const productName = supplyDTO.name; 
    const price = selectedOption.price; 
    const currency = selectedOption.currency;
    
    return (
        <main className="container py-4 product-detail-page">
            <button onClick={() => navigate(-1)} className="btn btn-sm btn-outline-secondary mb-3">
                ← Retour
            </button>
            
            {/* Conteneur principal (vous pouvez le diviser en deux colonnes ici) */}
            <div className="card shadow-sm"> 
                <div className="card-body row">

                    {/* COLONNE 1: Images */}
                    <div className="col-md-6 mb-4 mb-md-0 text-center">
                        {/* Image Principale (Affichage en grand) */}
                        <div style={{ maxWidth: "400px", marginBottom: "20px", margin: 'auto' }}>
                            <img
                                src={imagesToDisplay[selectedImageIndex]}
                                alt={`${productName} image ${selectedImageIndex + 1}`}
                                className="img-fluid rounded" 
                                style={{ width: "100%", maxHeight: '400px', objectFit: 'contain' }}
                            />
                        </div>

                        {/* Thumbnails (Images multiples) */}
                        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                            {imagesToDisplay.map((path, idx) => (
                                <img
                                    key={idx}
                                    src={path}
                                    alt={`${productName} thumb ${idx + 1}`}
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        objectFit: "cover",
                                        borderRadius: "10px",
                                        border: selectedImageIndex === idx ? "2px solid blue" : "1px solid #ccc",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setSelectedImageIndex(idx)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* COLONNE 2: Détails et Actions */}
                    <div className="col-md-6">
                        <h1 style={{ fontSize: "1.5rem", marginTop: "20px", color: "#0b3f8dff" }}>
                            {productName} - {selectedOption.name}
                        </h1>

                        <p className="text-muted">Marque: {selectedOption.marque}</p>

                        {/* Prix */}
                        <div style={{ fontSize: "1.7rem", marginTop: "15px", fontWeight: "bold" }}>
                            {price.toFixed(2)} {currency}
                        </div>
                        
                        {/* Statut Stock */}
                        <div style={{ fontSize: "29px", marginTop: "10px", color: selectedOption.inStock ? "green" : "red" }}>
                            {selectedOption.inStock ? "🟢 En stock" : "⚠️ Sur commande"}
                        </div>

                        <hr />
                        
                        {/* TODO: AJOUTER LE SÉLECTEUR D'OPTIONS (si plus d'une option existe) */}
                        
                        <div className="d-grid gap-2 mt-4">
                            <button className="btn btn-lg btn-success" disabled={!selectedOption.inStock}>
                                Ajouter au Panier
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}