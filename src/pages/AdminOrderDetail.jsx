// Fichier: src/pages/AdminOrderDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminOrderDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const DELIVERY_FEE = 8.00;
  const PACKAGING_PRICE = 5.00;

  useEffect(() => {
    axios.get(`/api/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [id]);

  // 🔥 NOUVELLE FONCTION DE TÉLÉCHARGEMENT (Facture & Bon Prépa) 🔥
  const downloadPdf = async (type) => {
      const endpoint = type === 'invoice' ? 'invoice' : 'preparation';
      const filename = type === 'invoice' ? `facture_${id}.pdf` : `bon_prepa_${id}.pdf`;
      
      try {
          const response = await axios.get(`/api/orders/${id}/${endpoint}`, {
              responseType: 'blob', // Important pour recevoir le fichier
          });
          
          // Déclencher le téléchargement
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          link.remove();
      } catch (error) {
          console.error("Erreur de téléchargement du PDF:", error);
          alert(`Impossible de générer le ${type === 'invoice' ? 'Facture' : 'Bon de Préparation'}.`);
      }
  };

  // --- Helpers ---
  const fmtMAD = (n) => new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(n);
  const formatDate = (d) => new Date(d).toLocaleString("fr-MA");

  // 🔥 FONCTION CRUCIALE : TROUVER LE VRAI PRIX (OPTION) 🔥
  const getItemPrice = (item) => {
      const selectedOption = item.supply.options.find(opt => opt.id === item.optionId);
      return selectedOption ? selectedOption.price : item.supply.price;
  };

  // FONCTION POUR AFFICHER LE NOM DE L'OPTION
  const getItemOptionName = (item) => {
      const selectedOption = item.supply.options.find(opt => opt.id === item.optionId);
      return selectedOption ? selectedOption.name : "";
  };

  // 🧮 CALCULS MIS À JOUR (Pour affichage)
  const totalBooks = order?.items
    ?.filter(item => item.supply.isBook) 
    ?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const packagingCost = order?.packagingRequested ? (totalBooks * PACKAGING_PRICE) : 0;
  
  if (isLoading) return <div className="d-flex justify-content-center align-items-center min-vh-100"><div className="spinner-border text-primary"></div></div>;
  if (!order) return <div className="container py-5 text-center"><h3 className="text-danger">Commande introuvable.</h3></div>;


  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
      
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex gap-2 align-items-center">
                <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={() => navigate("/admin-panel")}>
                    <i className="bi bi-arrow-left me-2"></i> Retour
                </button>
                
                {/* 1. BOUTON FACTURE */}
                <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={() => downloadPdf('invoice')}>
                    <i className="bi bi-file-earmark-pdf-fill me-2"></i> Facture
                </button>

                {/* 2. BOUTON BON DE PRÉPARATION */}
                <button className="btn btn-sm btn-warning text-dark rounded-pill px-3" onClick={() => downloadPdf('preparation')}>
                    <i className="bi bi-box-seam me-2"></i> Bon Prépa
                </button>
            </div>
            <div className="d-flex align-items-center gap-3">
                <h2 className="fw-bold mb-0 text-dark h4">Commande #{order.id}</h2>
                <span className={`badge ${order.status === 'PENDING' ? 'bg-warning text-dark' : 'bg-success'} fs-6 px-3 py-2 rounded-pill`}>
                    {order.status || "EN ATTENTE"}
                </span>
            </div>
        </div>

        <div className="row g-4">
            {/* Carte Client */}
            <div className="col-md-4">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4">
                        <h5 className="card-title fw-bold text-primary mb-4">👤 Client</h5>
                        <p className="mb-2"><strong>Nom:</strong> {order.customerName}</p>
                        <p className="mb-2"><strong>Tél:</strong> {order.customerPhone}</p>
                        <p className="mb-2"><strong>Adresse:</strong> {order.deliveryAddress}</p>
                        <p className="mb-0 text-muted small">📅 {formatDate(order.orderDate)}</p>
                        
                        {order.packagingRequested && (
                            <div className="mt-3 p-2 bg-success bg-opacity-10 text-success rounded border border-success text-center fw-bold">
                                📦 Emballage Demandé
                            </div>
                        )}
                        {order.notes && <div className="alert alert-warning mt-3 py-2 small">📝 {order.notes}</div>}
                    </div>
                </div>
            </div>

            {/* Carte Articles */}
            <div className="col-md-8">
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4 py-3">Produit & Option</th>
                                    <th className="text-center">Qté</th>
                                    <th className="text-end pe-4">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => {
                                    const realPrice = getItemPrice(item);
                                    const optionName = getItemOptionName(item);

                                    return (
                                        <tr key={item.id}>
                                            <td className="ps-4 py-3">
                                                <div className="fw-bold text-dark">{item.supply.name}</div>
                                                <div className="small text-muted d-flex align-items-center gap-2 mt-1">
                                                     {optionName && <span className="badge bg-secondary bg-opacity-10 text-secondary border">{optionName}</span>}
                                                    {item.supply.isBook && <span className="badge bg-primary-subtle text-primary border border-primary-subtle me-2">Livre</span>}
                                                </div>
                                            </td>
                                            <td className="text-center"><span className="badge bg-dark text-white px-3 rounded-pill">x{item.quantity}</span></td>
                                            <td className="text-end pe-4 fw-bold">{fmtMAD(realPrice * item.quantity)}</td>
                                        </tr>
                                    );
                                })}
                                
                                {/* Livraison */}
                                <tr className="bg-light">
                                    <td className="ps-4 py-3 fw-bold text-secondary">🚚 Livraison</td>
                                    <td className="text-center fw-bold text-secondary">-</td>
                                    <td className="text-end pe-4 fw-bold text-secondary">{fmtMAD(DELIVERY_FEE)}</td>
                                </tr>

                                {/* Emballage */}
                                {order.packagingRequested && (
                                    <tr className="bg-success bg-opacity-10">
                                        <td className="ps-4 py-3">
                                            <div className="fw-bold text-success">📦 Service Emballage</div>
                                        </td>
                                        <td className="text-center text-success fw-bold">-</td>
                                        <td className="text-end pe-4 fw-bold text-success">{fmtMAD(packagingCost)}</td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-light border-top">
                                <tr>
                                    <td colSpan="2" className="text-end py-4 fw-bold text-uppercase text-secondary">Total à payer</td>
                                    <td className="text-end pe-4 py-4 fw-bold text-dark fs-4">
                                        {fmtMAD(order.totalAmount)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}