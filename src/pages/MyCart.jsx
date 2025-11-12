// Fichier: src/pages/MyCart.jsx
import React, { useMemo, useState } from "react"; 
import { useNavigate } from "react-router-dom"; 

export default function MyCart({ cart, setCart }) {
    
    // ✅ ÉTAT : Pour la case à cocher des frais d'emballage
    const [packagingRequired, setPackagingRequired] = useState(false);
    const navigate = useNavigate(); 
    const PACKAGING_COST_PER_ITEM = 5.00; // 5 MAD par article

    // 1. Calcul du sous-total des articles
    const subTotalPrice = useMemo(
        () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cart]
    );

    // 2. Calcul des Frais d'Emballage (Packaging Fee)
    const packagingFee = useMemo(() => {
        if (!packagingRequired) return 0; // Si ce n'est pas coché, frais = 0

        // ✅ CORRECTION: On utilise la propriété 'isBook' au lieu de chercher le nom
        const bookItems = cart.filter(item => item.isBook === true);

        // Frais : 5 MAD * quantité de chaque livre
        return bookItems.reduce((sum, item) => sum + (item.quantity * PACKAGING_COST_PER_ITEM), 0);
        
    }, [cart, packagingRequired]);

    // 3. Calcul du Grand Total (TTC)
    const grandTotal = subTotalPrice + packagingFee;


    const fmtMAD = (n) =>
        new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(n);

    // Update quantity
    const updateQuantity = (id, optionId, newQty) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id && item.optionId === optionId
                    ? { ...item, quantity: Math.max(1, newQty) }
                    : item
            )
        );
    };

    // Remove item
    const removeItem = (id, optionId) => {
        setCart((prev) => prev.filter((item) => !(item.id === id && item.optionId === optionId)));
    };

    // ⚠️ Fonction Commander (pour le moment une alerte)
    const handleCommander = () => {
        alert(`Commande Lancée! Total: ${grandTotal} MAD. Emballage requis: ${packagingRequired ? 'Oui' : 'Non'}`);
        
        // TODO: C'est ici que nous ajouterons la logique pour rediriger vers le formulaire de paiement
        // navigate("/checkout"); 
    }


    return (
        <main className="container py-3">
            <h1 className="mb-3">Mon Panier</h1>

            {cart.length === 0 ? (
                <div className="text-center text-secondary py-4 border rounded-4">
                    <div className="fw-medium">Votre panier est vide.</div>
                </div>
            ) : (
                <>
                    <div className="list-group mb-3">
                        {cart.map((item) => (
                            <div
                                // Utilisation de String() pour éviter les bugs si les IDs sont des nombres
                                key={String(item.id) + String(item.optionId)}
                                className="list-group-item d-flex align-items-center justify-content-between"
                            >
                                {/* IMAGE + NAME */}
                                <div className="d-flex align-items-center gap-3">
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={{
                                                width: 60,
                                                height: 60,
                                                objectFit: "cover",
                                                borderRadius: 4,
                                            }}
                                        />
                                    )}
                                    <div>
                                        <div className="fw-bold">{item.name}</div>
                                        <small className="text-muted">
                                            {/* Petit indicateur visuel */}
                                            {item.isBook ? "📚 Livre/Cahier" : "✏️ Fourniture"}
                                            {item.optionId ? ` (Ref: ${item.optionId})` : ""}
                                        </small>
                                    </div>
                                </div>

                                {/* QUANTITY + PRICE + DELETE */}
                                <div className="d-flex align-items-center gap-2">
                                    <input
                                        type="number"
                                        min={1}
                                        value={item.quantity}
                                        onChange={(e) =>
                                            updateQuantity(item.id, item.optionId, parseInt(e.target.value))
                                        }
                                        className="form-control form-control-sm"
                                        style={{ width: 60 }}
                                    />
                                    <span style={{ minWidth: "80px", textAlign: "right" }}>
                                        {fmtMAD(item.price * item.quantity)}
                                    </span>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => removeItem(item.id, item.optionId)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* CHECKBOX D'EMBALLAGE */}
                    <div className="form-check border-top pt-3 mb-4">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="packagingCheck"
                            checked={packagingRequired}
                            onChange={(e) => setPackagingRequired(e.target.checked)}
                        />
                        <label className="form-check-label fw-bold" htmlFor="packagingCheck">
                            Ajouter l'emballage des livres (5 DH / article)
                        </label>
                    </div>

                    {/* LIGNES DES TOTAUX */}
                    <div className="border-top pt-3">
                        
                        {/* Sous-total des Articles */}
                        <div className="d-flex justify-content-between">
                            <small className="text-muted">Sous-Total Articles:</small>
                            <small>{fmtMAD(subTotalPrice)}</small>
                        </div>
                        
                        {/* Ligne des Frais d'Emballage */}
                        {packagingFee > 0 && (
                            <div className="d-flex justify-content-between fw-bold text-success mb-2">
                                <small>Frais d'Emballage (Livres):</small>
                                <small>{fmtMAD(packagingFee)}</small>
                            </div>
                        )}

                        {/* Grand Total */}
                        <div className="d-flex justify-content-between align-items-center border-top pt-3">
                            <h5>Total TTC:</h5>
                            <h5>{fmtMAD(grandTotal)}</h5>
                        </div>
                        
                        {/* Bouton Commander */}
                        <button className="btn btn-primary btn-lg w-100 mt-3" onClick={handleCommander}>
                            COMMANDER
                        </button>
                    </div>
                </>
            )}
        </main>
    );
}