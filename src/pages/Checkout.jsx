// Fichier: src/pages/Checkout.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ IMPORTE AXIOS

export default function Checkout({ clearCart }) {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Récupérer les données
  const { cartItems, totalPrice, packaging } = location.state || { cartItems: [], totalPrice: 0, packaging: false };

  // 2. État du formulaire
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "Casablanca",
    address: "",
    notes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 3. Protection Panier Vide
  if (!location.state || cartItems.length === 0) {
    return (
      <div className="container py-5 text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="bg-light rounded-circle p-4 mb-3">
            <i className="bi bi-cart-x text-secondary" style={{ fontSize: "3rem" }}></i>
        </div>
        <h3 className="fw-bold text-dark">Votre panier est vide</h3>
        <button className="btn btn-primary rounded-pill px-5 py-2 fw-bold mt-3" onClick={() => navigate("/")}>
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderPayload = {
      customerName: formData.fullName,
      customerPhone: formData.phone,
      deliveryAddress: `${formData.address}, ${formData.city}`,
      notes: formData.notes,
      packagingRequested: packaging,
      totalAmount: totalPrice,
      items: cartItems.map(item => ({
        supplyId: item.id,
        quantity: item.quantity,
        optionId: item.optionId
      }))
    };

    console.log("🚀 Envoi Commande (Réel)...", orderPayload);

    try {
        // 🔥 CONNEXION SERVER RÉELLE
        await axios.post("/api/orders/create", orderPayload);
        setShowSuccessModal(true); // Afficher le succès
    } catch (error) {
        console.error("Erreur:", error);
        alert("❌ Erreur de connexion. Vérifiez que le serveur est allumé.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
      if (clearCart) clearCart(); 
      navigate("/"); 
  };

  const fmtMAD = (n) => new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(n);

  return (
    <div className="bg-light min-vh-100"> 
        <main className="container py-3" style={{ maxWidth: "600px" }}> 
        
        {/* Header */}
        <div className="d-flex align-items-center mb-4 pt-2">
            <button 
                className="btn btn-white border rounded-circle shadow-sm me-3 d-flex align-items-center justify-content-center" 
                style={{width: 40, height: 40, backgroundColor: 'white'}} 
                onClick={() => navigate(-1)}
            >
                <i className="bi bi-chevron-left text-dark"></i>
            </button>
            <h1 className="h5 mb-0 fw-bold">Finaliser la commande</h1>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
            
            {/* 🔥 THE BIG SINGLE CARD 🔥 */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-5">
                
                {/* --- PARTIE 1 : RÉSUMÉ --- */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <div className="text-secondary small fw-bold text-uppercase" style={{letterSpacing: '1px'}}>Total à payer</div>
                        <div className="fw-bold text-primary" style={{ fontSize: "1.8rem" }}>{fmtMAD(totalPrice)}</div>
                    </div>
                    <div className="text-end">
                        <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                            {cartItems.length} articles
                        </span>
                        {packaging && (
                            <div className="mt-1">
                                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                                    📦 Emballage inclus
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <hr className="my-4" style={{ borderTop: "1px solid #e0e0e0", opacity: 1 }} />

                {/* --- PARTIE 2 : CONTACT --- */}
                <h2 className="h6 fw-bold mb-3 text-dark d-flex align-items-center">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-2 d-flex align-items-center justify-content-center" style={{width: 32, height: 32}}>
                        <i className="bi bi-person-fill text-primary" style={{ fontSize: "1rem" }}></i>
                    </div>
                    Informations
                </h2>
                
                <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Nom Complet</label>
                    <input type="text" className="form-control bg-light border-0 py-2 rounded-3" name="fullName" required placeholder="Ex: Mohammed Alami" value={formData.fullName} onChange={handleChange} />
                </div>

                <div className="mb-0">
                    <label className="form-label small fw-bold text-secondary">Téléphone</label>
                    <input type="tel" className="form-control bg-light border-0 py-2 rounded-3" name="phone" required placeholder="06 00 00 00 00" value={formData.phone} onChange={handleChange} />
                </div>

                <hr className="my-4" style={{ borderTop: "1px solid #e0e0e0", opacity: 1 }} />

                {/* --- PARTIE 3 : LIVRAISON --- */}
                <h2 className="h6 fw-bold mb-3 text-dark d-flex align-items-center">
                    <div className="rounded-circle bg-warning bg-opacity-10 p-2 me-2 d-flex align-items-center justify-content-center" style={{width: 32, height: 32}}>
                        <i className="bi bi-geo-alt-fill text-warning" style={{ fontSize: "1rem" }}></i>
                    </div>
                    Livraison
                </h2>
                
                <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Ville</label>
                    <select className="form-select bg-light border-0 py-2 rounded-3" name="city" value={formData.city} onChange={handleChange}>
                        <option value="Casablanca">Casablanca</option>
                        <option value="Rabat">Rabat</option>
                        <option value="Marrakech">Marrakech</option>
                        <option value="Tanger">Tanger</option>
                        <option value="Agadir">Agadir</option>
                        <option value="Fès">Fès</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Adresse Exacte</label>
                    <textarea className="form-control bg-light border-0 p-3 rounded-3" name="address" required rows="2" placeholder="Quartier, Rue, N° Immeuble..." value={formData.address} onChange={handleChange}></textarea>
                </div>

                <div className="mb-0">
                    <label className="form-label small fw-bold text-secondary">Note (Optionnel)</label>
                    <input type="text" className="form-control bg-light border-0 py-2 rounded-3" name="notes" placeholder="Ex: Sonnez à l'interphone..." value={formData.notes} onChange={handleChange} />
                </div>
            </div>

            {/* SPACER */}
            <div style={{ height: "140px" }}></div>

            {/* 🔥 BOUTON FIXE CENTRÉ + CORNER RADIUS 🔥 */}
            <div 
                className="fixed-bottom bg-white shadow-lg" 
                style={{ 
                    width: "95%",
                    maxWidth: "600px",
                    padding: "20px",
                    left: "50%",
                    bottom: "20px",
                    transform: "translateX(-50%)",
                    borderRadius: "24px", // ✅ VERSION OPTIMISÉE
                    zIndex: 1000 
                }}
            >
                <div className="container" style={{ maxWidth: "600px", padding: 0 }}>
                    <button 
                        type="submit" 
                        className="btn btn-primary w-100 py-3 rounded-4 shadow-sm d-flex justify-content-between align-items-center px-4 fw-bold"
                        style={{ fontSize: '1.1rem', letterSpacing: '0.5px' }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="w-100 text-center">
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Envoi...
                            </div>
                        ) : (
                            <>
                                <span>CONFIRMER</span>
                                <span>{fmtMAD(totalPrice)}</span>
                            </>
                        )}
                    </button>
                    <div className="text-center mt-2 text-muted small">
                        <i className="bi bi-check-circle-fill text-success me-1"></i> Paiement à la livraison
                    </div>
                </div>
            </div>

        </form>

        {/* 🔥 MODALE SUCCÈS 🔥 */}
        {showSuccessModal && (
            <>
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4 p-4 text-center">
                            <div className="mb-3">
                                <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                                    <i className="bi bi-check-lg text-success" style={{ fontSize: "3rem" }}></i>
                                </div>
                            </div>
                            <h3 className="fw-bold mb-2">Commande Validée !</h3>
                            <p className="text-muted mb-4">
                                Merci <strong>{formData.fullName}</strong>.<br/>
                                Nous avons bien reçu votre commande.<br/>
                                Nous vous contacterons au <strong>{formData.phone}</strong> pour la livraison.
                            </p>
                            <button className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm" onClick={handleCloseSuccess}>
                                Retour à l'accueil
                            </button>
                        </div>
                    </div>
                </div>
                <div className="modal-backdrop fade show"></div>
            </>
        )}

        </main>
    </div>
  );
}