import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    axios.get("/api/orders")
      .then(response => {
        console.log("✅ DATA REÇUE:", response.data);
        if (Array.isArray(response.data)) {
            setOrders(response.data);
        } else {
            setOrders([]);
        }
      })
      .catch(err => console.error("❌ ERREUR:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Helpers
  const formatDate = (d) => new Date(d).toLocaleString("fr-MA");
  const fmtMAD = (n) => new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(n);

  if (isLoading) return <div className="p-5 text-center">Chargement...</div>;

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        
        {/* Header (MODIFIÉ) */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 fw-bold text-dark">📦 Tableau de Bord Commandes</h1>
          <div className="d-flex align-items-center gap-3">
             
             {/* 🚨 NOUVEAU: Bouton pour naviguer vers le CRUD des fournitures */}
             <button 
                onClick={() => navigate("/admin/supplies")} 
                className="btn btn-warning rounded-pill px-4 fw-bold text-dark border-0 shadow-sm"
             >
                 <i className="bi bi-gear-fill me-2"></i> Gérer les Fournitures
             </button>

             <span className="badge bg-primary fs-6 rounded-pill px-3 py-2">
               {orders.length} Commandes
             </span>
          </div>
        </div>

        {/* Tableau des commandes (inchangé) */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-white border-bottom">
                <tr>
                  <th className="py-3 ps-4">ID</th>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Tél</th>
                  <th>Ville</th>
                  <th>Total</th>
                  <th>État</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted">
                      Aucune commande trouvée.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td className="ps-4 fw-bold text-primary">#{order.id}</td>
                      <td className="text-muted small">
                        {order.orderDate ? formatDate(order.orderDate) : "-"}
                      </td>
                      
                      {/* Colonne Nom */}
                      <td>
                        <div className="fw-bold text-dark">{order.customerName || "Inconnu"}</div>
                      </td>

                      {/* Colonne Téléphone (Séparée) */}
                      <td>
                        <span className="font-monospace text-secondary bg-light px-2 py-1 rounded border">
                            {order.customerPhone || "-"}
                        </span>
                      </td>

                      <td>
                        <span className="badge bg-light text-dark border">
                            {order.deliveryAddress ? order.deliveryAddress.split(',').pop().trim() : "Maroc"}
                        </span>
                      </td>
                      <td className="fw-bold text-primary">
                        {order.totalAmount ? fmtMAD(order.totalAmount) : "0.00 MAD"}
                      </td>
                      <td>
                        <span className="badge bg-warning text-dark rounded-pill">
                          {order.status || "EN ATTENTE"}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <button 
                          onClick={() => navigate(`/admin/order/${order.id}`)} 
                          className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold"
                        >
                          Détails
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