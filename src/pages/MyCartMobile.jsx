// Fichier: src/pages/MyCartMobile.jsx
import React, { useMemo, useState } from "react"; 
import { useNavigate } from "react-router-dom"; 

export default function MyCartMobile({ cart, setCart }) {
    
    // ✅ 1. DÉCLARATION DES ÉTATS ET CONSTANTES
    const [packagingRequired, setPackagingRequired] = useState(false);
    // 🛑 NOUVEL ÉTAT: Pour stocker l'article à supprimer avant confirmation
    const [itemToRemove, setItemToRemove] = useState(null); 
    
    const navigate = useNavigate();
    const PACKAGING_COST_PER_ITEM = 5.00; // 5 MAD par article
    const DELIVERY_FEE = 8.00; // Frais de livraison

    // 2. Calcul du Sous-Total des Articles
    const subTotalPrice = useMemo(
        () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cart]
    );

    // 3. Calcul des Frais d'Emballage (Packaging Fee)
    const packagingFee = useMemo(() => {
        if (!packagingRequired) return 0;

        // 🔥 CORRECTION APPLIQUÉE ICI : On utilise 'isBook'
        // Plus besoin de chercher "cahier" ou "book" dans le nom.
        const bookItems = cart.filter(item => item.isBook === true);

        // Frais : 5 MAD * quantité de chaque livre
        return bookItems.reduce((sum, item) => sum + (item.quantity * PACKAGING_COST_PER_ITEM), 0);
        
    }, [cart, packagingRequired]);

    // 4. Calcul du Grand Total (Total TTC)
    const grandTotal = subTotalPrice + DELIVERY_FEE + packagingFee;


    const fmtMAD = (n) =>
        new Intl.NumberFormat("fr-MA", {
            style: "currency",
            currency: "MAD",
        }).format(n);

    const updateQuantity = (id, optionId, newQty) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id && item.optionId === optionId
                    ? { ...item, quantity: Math.max(1, newQty) }
                    : item
            )
        );
    };

    // Ouvre la modale et prépare l'article à supprimer
    const handleRemoveClick = (id, optionId) => {
        const item = cart.find(i => i.id === id && i.optionId === optionId);
        setItemToRemove(item);
    };

    // Exécute la suppression après la confirmation de la modale
    const confirmRemoval = () => {
        if (itemToRemove) {
            setCart((prev) =>
                prev.filter((item) => !(item.id === itemToRemove.id && item.optionId === itemToRemove.optionId))
            );
        }
        setItemToRemove(null); 
    };
    
    const handleCommander = () => {
        alert(`Commande Lancée! Total: ${grandTotal} MAD. Emballage requis: ${packagingRequired ? 'Oui' : 'Non'}`);
    }


    return (
        <main className="container py-3">
            {cart.length === 0 ? (
                <>
                    <h1 className="mb-3 text-center">Mon Panier</h1>
                    <div className="text-center text-secondary py-4 border rounded-4">
                        Votre panier est vide.
                    </div>
                </>
            ) : (
                <>
                    {/* Header + Cart items container */}
                    <div
                        className="mb-3 shadow-sm"
                        style={{
                            border: "1px solid #eee",
                            borderRadius: 12,
                            overflow: "hidden",
                            backgroundColor: "#fff",
                        }}
                    >
                        {/* Header */}
                        <div
                            className="text-center fw-bold py-3"
                            style={{
                                fontSize: "1.25rem",
                                borderBottom: "1px solid #eee",
                                backgroundColor: "#f8f9fa",
                            }}
                        >
                            Mon Panier
                        </div>

                        {/* Cart Items */}
                        <div className="list-group">
                            {cart.map((item, index) => {
                                let borderRadiusStyle = {};
                                if (index === 0) {
                                    borderRadiusStyle = { borderRadius: 0 };
                                } else if (index === cart.length - 1) {
                                    borderRadiusStyle = { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 };
                                } else {
                                    borderRadiusStyle = { borderRadius: 0 };
                                }

                                return (
                                    <div
                                        key={String(item.id) + String(item.optionId)}
                                        className="list-group-item d-flex flex-row gap-3 p-3"
                                        style={{
                                            position: "relative",
                                            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                            borderBottom: "1px solid #eee",
                                            ...borderRadiusStyle,
                                        }}
                                    >
                                        {/* Bouton Supprimer */}
                                        <button
                                            className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                                            onClick={() => handleRemoveClick(item.id, item.optionId)}
                                            style={{ position: "absolute", top: 8, right: 8, width: 32, height: 32, borderRadius: "50%", zIndex: 2 }}
                                            data-bs-toggle="modal" 
                                            data-bs-target="#removeConfirmModal"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                        
                                        <div className="d-flex gap-3 flex-grow-1">
                                            {item.image && (
                                                <img src={item.image} alt={item.name} style={{ width: 90, height: 120, objectFit: "cover", borderRadius: 6 }} />
                                            )}
                                            <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                                <div>
                                                    <div className="fw-semibold" style={{ fontSize: "14px" }}>{item.name}</div>
                                                    
                                                    

                                                    <div className="fw-bold text-warning mt-1">{fmtMAD(item.price)}</div>
                                                    <span className="badge mt-1" style={{ backgroundColor: "#d4edda", color: "#155724", }}>En stock</span>
                                                </div>

                                                <div className="d-flex align-items-center gap-2 mt-2">
                                                    <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <button type="button" onClick={() => updateQuantity(item.id, item.optionId, item.quantity - 1)}
                                                            style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #ccc", backgroundColor: "#f5f5f5", fontWeight: "bold" }}
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            type="number" min={1} value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.id, item.optionId, parseInt(e.target.value))}
                                                            className="form-control form-control-sm"
                                                            style={{ width: 40, textAlign: "center", borderRadius: 6, padding: "4px 0", fontSize: "1rem" }}
                                                        />
                                                        <button type="button" onClick={() => updateQuantity(item.id, item.optionId, item.quantity + 1)}
                                                            style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #ccc", backgroundColor: "#f5f5f5", fontWeight: "bold" }}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <span className="fw-bold">{fmtMAD(item.price * item.quantity)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* CART SUMMARY */}
                    <div
                        className="mt-4 p-3 rounded-4 shadow-sm"
                        style={{ border: "1px solid #eee", backgroundColor: "#fff" }}
                    >
                        {/* ✅ CHECKBOX D'EMBALLAGE */}
                        <div className="form-check border-bottom pb-2 mb-3 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    id="packagingCheck"
                                    checked={packagingRequired}
                                    onChange={(e) => setPackagingRequired(e.target.checked)}
                                    style={{ transform: "scale(1.2)", marginRight: "8px" }}
                                />
                                <label className="form-check-label fw-semibold" htmlFor="packagingCheck">
                                    Ajouter l'emballage des livres
                                </label>
                            </div>
                        </div>

                        {/* Sous-total des Articles */}
                        <div className="d-flex justify-content-between mb-2">
                            <span className="fw-semibold">Total Articles</span>
                            <span className="fw-bold">{fmtMAD(subTotalPrice)}</span>
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                            <span className="fw-semibold">Livraison</span>
                            <span className="fw-bold">{fmtMAD(DELIVERY_FEE)}</span>
                        </div>
                        
                        {/* Ligne des Frais d'Emballage */}
                        {packagingFee > 0 && (
                            <div className="d-flex justify-content-between mb-2 fw-bold text-success">
                                <span className="fw-semibold">Frais d'Emballage</span>
                                <span className="fw-bold">{fmtMAD(packagingFee)}</span>
                            </div>
                        )}

                        <hr />

                        {/* Grand Total */}
                        <div className="d-flex justify-content-between mb-3">
                            <span className="fw-bold">Total TTC</span>
                            <span className="fw-bold text-primary">
                                {fmtMAD(grandTotal)}
                            </span>
                        </div>

                        <button
                            className="btn btn-primary w-100 py-2 fw-bold"
                            onClick={handleCommander}
                            style={{ borderRadius: "12px" }}
                        >
                            COMMANDER
                        </button>
                    </div>
                </>
            )}

            {/* MODALE DE CONFIRMATION DE SUPPRESSION */}
            <div 
                className="modal fade"
                id="removeConfirmModal" 
                tabIndex="-1" 
                aria-labelledby="removeConfirmModalLabel" 
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="removeConfirmModalLabel">
                                Confirmer la suppression
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setItemToRemove(null)}></button>
                        </div>
                        <div className="modal-body">
                            Voulez-vous vraiment retirer l'article : 
                            <p className="fw-bold mt-2 mb-0">
                                {itemToRemove ? itemToRemove.name : 'cet article'}
                            </p> 
                            de votre panier ?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setItemToRemove(null)}>
                                Annuler
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-bs-dismiss="modal"
                                onClick={confirmRemoval} 
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    );
}