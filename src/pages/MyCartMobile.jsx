// Fichier: src/pages/MyCartMobile.jsx
import React, { useMemo, useState } from "react"; 
import { useNavigate } from "react-router-dom"; 

export default function MyCartMobile({ cart, setCart }) {
    
    // 1. ÉTATS
    const [packagingRequired, setPackagingRequired] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);
    
    // NOUVEL ÉTAT : Pour contrôler l'affichage de la modale d'info packaging
    const [showPackagingModal, setShowPackagingModal] = useState(false); 
    
    const navigate = useNavigate();
    const PACKAGING_COST_PER_ITEM = 5.00; 
    const DELIVERY_FEE = 8.00; 

    // 2. CALCULS
    const subTotalPrice = useMemo(
        () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cart]
    );

    const bookItems = useMemo(() => cart.filter(item => item.isBook === true), [cart]);
    const totalBooksCount = useMemo(() => bookItems.reduce((sum, item) => sum + item.quantity, 0), [bookItems]);

    const packagingFee = useMemo(() => {
        if (!packagingRequired) return 0;
        return totalBooksCount * PACKAGING_COST_PER_ITEM;
    }, [packagingRequired, totalBooksCount]);

    const grandTotal = subTotalPrice + DELIVERY_FEE + packagingFee;


    const fmtMAD = (n) =>
        new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(n);

    // 3. HANDLERS
    const updateQuantity = (id, optionId, newQty) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id && item.optionId === optionId
                    ? { ...item, quantity: Math.max(1, newQty) }
                    : item
            )
        );
    };

    const handleRemoveClick = (id, optionId) => {
        const item = cart.find(i => i.id === id && i.optionId === optionId);
        setItemToRemove(item);
    };

    const confirmRemoval = () => {
        if (itemToRemove) {
            setCart((prev) =>
                prev.filter((item) => !(item.id === itemToRemove.id && item.optionId === itemToRemove.optionId))
            );
        }
        setItemToRemove(null); 
    };

    const handlePackagingCheckbox = (e) => {
        if (e.target.checked) {
            setShowPackagingModal(true);
        } else {
            setPackagingRequired(false);
        }
    };

    const confirmPackaging = () => {
        setPackagingRequired(true);
        setShowPackagingModal(false);
    };

    const cancelPackaging = () => {
        setPackagingRequired(false); 
        setShowPackagingModal(false);
    };
    
    // 🔥 UPDATE : Navigation vers la page Checkout
    const handleCommander = () => {
        navigate("/checkout", {
            state: {
                cartItems: cart,
                totalPrice: grandTotal,
                packaging: packagingRequired
            }
        });
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
                    {/* --- LISTE DES ARTICLES --- */}
                    <div className="mb-3 shadow-sm" style={{ border: "1px solid #eee", borderRadius: 12, overflow: "hidden", backgroundColor: "#fff" }}>
                        <div className="text-center fw-bold py-3" style={{ fontSize: "1.25rem", borderBottom: "1px solid #eee", backgroundColor: "#f8f9fa" }}>
                            Mon Panier
                        </div>
                        <div className="list-group">
                            {cart.map((item, index) => {
                                let borderRadiusStyle = index === 0 ? { borderRadius: 0 } : index === cart.length - 1 ? { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 } : { borderRadius: 0 };
                                return (
                                    <div key={String(item.id) + String(item.optionId)} className="list-group-item d-flex flex-row gap-3 p-3" style={{ position: "relative", boxShadow: "0 2px 6px rgba(0,0,0,0.05)", borderBottom: "1px solid #eee", ...borderRadiusStyle }}>
                                        <button className="btn btn-danger btn-sm d-flex align-items-center justify-content-center" onClick={() => handleRemoveClick(item.id, item.optionId)} style={{ position: "absolute", top: 8, right: 8, width: 32, height: 32, borderRadius: "50%", zIndex: 2 }} data-bs-toggle="modal" data-bs-target="#removeConfirmModal">
                                            <i className="bi bi-trash"></i>
                                        </button>
                                        <div className="d-flex gap-3 flex-grow-1">
                                            {item.image && <img src={item.image} alt={item.name} style={{ width: 90, height: 120, objectFit: "cover", borderRadius: 6 }} />}
                                            <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                                <div>
                                                    <div className="fw-semibold" style={{ fontSize: "14px" }}>{item.name}</div>
                                                    <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>{item.isBook ? "📚 Livre/Cahier" : "✏️ Fourniture"}</div>
                                                    <div className="fw-bold text-warning mt-1">{fmtMAD(item.price)}</div>
                                                    <span className="badge mt-1" style={{ backgroundColor: "#d4edda", color: "#155724", }}>En stock</span>
                                                </div>
                                                <div className="d-flex align-items-center gap-2 mt-2">
                                                    <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <button type="button" onClick={() => updateQuantity(item.id, item.optionId, item.quantity - 1)} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #ccc", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>-</button>
                                                        <input type="number" min={1} value={item.quantity} onChange={(e) => updateQuantity(item.id, item.optionId, parseInt(e.target.value))} className="form-control form-control-sm" style={{ width: 40, textAlign: "center", borderRadius: 6, padding: "4px 0", fontSize: "1rem" }} />
                                                        <button type="button" onClick={() => updateQuantity(item.id, item.optionId, item.quantity + 1)} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #ccc", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>+</button>
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
                    
                    {/* --- CART SUMMARY --- */}
                    <div className="mt-4 p-3 rounded-4 shadow-sm" style={{ 
                            border: "1px solid #eee", 
                            backgroundColor: "#fff",
                            position: "sticky",
                            bottom: "1rem", // Colle au bas de l'écran (avec un peu de marge)
                            zIndex: 100,    // Reste au-dessus du reste
                            boxShadow: "0 -5px 20px rgba(0,0,0,0.1)" // Ombre vers le haut pour le détacher
                        }} >
                        
                        
                        <div className="form-check border-bottom pb-2 mb-3 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    id="packagingCheck"
                                    checked={packagingRequired}
                                    onChange={handlePackagingCheckbox} 
                                    style={{ transform: "scale(1.2)", marginRight: "8px" }}
                                />
                                <label className="form-check-label fw-semibold" htmlFor="packagingCheck">
                                    Ajouter l'emballage des livres
                                </label>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                            <span className="fw-semibold">Total Articles</span>
                            <span className="fw-bold">{fmtMAD(subTotalPrice)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="fw-semibold">Livraison</span>
                            <span className="fw-bold">{fmtMAD(DELIVERY_FEE)}</span>
                        </div>
                        
                        <div className={`d-flex justify-content-between mb-2 ${packagingFee > 0 ? "fw-bold text-success" : "text-muted"}`}>
                            <span className="fw-semibold">Frais d'Emballage</span>
                            <span className="fw-bold">{fmtMAD(packagingFee)}</span>
                        </div>

                        <hr />
                        <div className="d-flex justify-content-between mb-3">
                            <span className="fw-bold">Total TTC</span>
                            <span className="fw-bold text-primary">{fmtMAD(grandTotal)}</span>
                        </div>

                        <button className="btn btn-primary w-100 py-2 fw-bold" onClick={handleCommander} style={{ borderRadius: "12px" }}>
                            COMMANDER
                        </button>
                    </div>
                </>
            )}

            {/* MODALE DE SUPPRESSION */}
            <div className="modal fade" id="removeConfirmModal" tabIndex="-1" aria-labelledby="removeConfirmModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="removeConfirmModalLabel">Confirmer la suppression</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setItemToRemove(null)}></button>
                        </div>
                        <div className="modal-body">
                            Voulez-vous vraiment retirer l'article : <p className="fw-bold mt-2 mb-0">{itemToRemove ? itemToRemove.name : 'cet article'}</p> de votre panier ?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setItemToRemove(null)}>Annuler</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={confirmRemoval}>Supprimer</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALE INFO EMBALLAGE */}
            {showPackagingModal && (
                <>
                    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content border-0 shadow">
                                <div className="modal-header bg-light">
                                    <h5 className="modal-title fw-bold"> Info Emballage</h5>
                                    <button type="button" className="btn-close" onClick={cancelPackaging}></button>
                                </div>
                                <div className="modal-body">
                                    <p>Le service d'emballage (couverture) coûte <strong>5,00 MAD</strong> par livre.</p>
                                    <div className="alert alert-info d-flex justify-content-between align-items-center">
                                        <span>Nombre de livres :</span>
                                        <strong>{totalBooksCount}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center fs-5">
                                        <span>Coût total emballage :</span>
                                        <span className="fw-bold text-primary">{fmtMAD(totalBooksCount * PACKAGING_COST_PER_ITEM)}</span>
                                    </div>
                                </div>
                                <div className="modal-footer border-0">
                                    <button type="button" className="btn btn-outline-secondary" onClick={cancelPackaging}>Non merci</button>
                                    <button type="button" className="btn btn-primary px-4" onClick={confirmPackaging}> J'accepte</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}

        </main>
    );
}