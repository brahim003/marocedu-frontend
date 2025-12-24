// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); 

  // --- 1. FETCH DATA ---
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios.get("/api/orders")
      .then(response => {
        if (Array.isArray(response.data)) {
            setOrders(response.data);
        } else {
            setOrders([]);
        }
      })
      .catch(err => console.error("❌ ERREUR:", err))
      .finally(() => setIsLoading(false));
  };

  // --- 2. UPDATE STATUS LOGIC (CORRECTED: JSON BODY) ---
  const handleStatusChange = async (orderId, newStatus) => {
      // 1. Keep a copy of the old state (Optimistic UI)
      const previousOrders = [...orders];
      
      // 2. Update UI immediately
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

      try {
          // 🚨 CHANGE: Sending { status: ... } inside the body
          await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
          
          console.log(`✅ Order #${orderId} updated to ${newStatus}`);
      } catch (error) {
          console.error("Failed to update status:", error);
          
          // 3. Show error details
          const errorMsg = error.response?.data?.message || "Erreur de connexion au serveur";
          alert(`Erreur: ${errorMsg}`);
          
          // 4. Revert UI if failed
          setOrders(previousOrders); 
      }
  };

  // --- 3. DOWNLOAD PDF LOGIC ---
  const downloadPdf = async (orderId, type) => {
      const endpoint = type === 'invoice' ? 'invoice' : 'preparation';
      const filename = type === 'invoice' ? `facture_${orderId}.pdf` : `bon_prepa_${orderId}.pdf`;
      
      try {
          const response = await axios.get(`/api/orders/${orderId}/${endpoint}`, {
              responseType: 'blob', 
          });
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          link.remove();
      } catch (error) {
          console.error("Erreur PDF:", error);
          alert(`Document indisponible.`);
      }
  };

  // --- HELPERS ---
  const formatDate = (d) => new Date(d).toLocaleString("fr-MA");
  const fmtMAD = (n) => new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(n);

  // Helper to get color based on status
  const getStatusColor = (status) => {
      switch (status) {
          case 'CONFIRMED': return 'bg-success text-white border-success';
          case 'PENDING': return 'bg-warning text-dark border-warning';
          case 'SHIPPED': return 'bg-info text-white border-info';
          case 'DELIVERED': return 'bg-primary text-white border-primary';
          case 'CANCELLED': return 'bg-danger text-white border-danger';
          default: return 'bg-light text-dark border-secondary';
      }
  };

  if (isLoading) return <div className="p-5 text-center">Chargement...</div>;

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container-fluid px-4">
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-3">
             <button 
                onClick={() => navigate("/admin-panel")} 
                className="btn btn-white border shadow-sm rounded-circle d-flex align-items-center justify-content-center"
                style={{width: 40, height: 40}}
             >
                <i className="bi bi-arrow-left text-dark"></i>
             </button>
             <h1 className="h3 fw-bold text-dark mb-0">📦 Commandes</h1>
          </div>
          <div className="d-flex align-items-center gap-3">
             <span className="badge bg-primary fs-6 rounded-pill px-3 py-2">
               {orders.length} Commandes
             </span>
          </div>
        </div>

        {/* Tableau */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-white border-bottom">
                <tr>
                  <th className="py-3 ps-4">ID</th>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Ville</th>
                  <th>Total</th>
                  <th style={{minWidth: "140px"}}>État</th>
                  <th className="text-end pe-4" style={{ minWidth: "280px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      Aucune commande trouvée.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td className="ps-4 fw-bold text-primary">#{order.id}</td>
                      <td className="text-muted small">
                        {order.orderDate ? formatDate(order.orderDate).split(',')[0] : "-"}
                      </td>
                      
                      <td>
                        <div className="fw-bold text-dark">{order.customerName || "Inconnu"}</div>
                        <div className="small text-muted">{order.customerPhone}</div>
                      </td>

                      <td>
                        <span className="badge bg-light text-dark border">
                            {order.deliveryAddress ? order.deliveryAddress.split(',').pop().trim() : "Maroc"}
                        </span>
                      </td>
                      <td className="fw-bold text-primary">
                        {order.totalAmount ? fmtMAD(order.totalAmount) : "0.00 MAD"}
                      </td>
                      
                      {/* 🔥 NEW DROPDOWN STATUS 🔥 */}
                      <td>
                        <select 
                            className={`form-select form-select-sm fw-bold border-0 ${getStatusColor(order.status || 'PENDING')}`}
                            style={{ 
                                cursor: 'pointer', 
                                appearance: 'none', 
                                textAlign: 'center',
                                paddingRight: '0.5rem', 
                                borderRadius: '20px'
                            }}
                            value={order.status || 'PENDING'}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                            <option value="PENDING" className="bg-white text-dark">⏳ Pending</option>
                            <option value="CONFIRMED" className="bg-white text-dark">✅ Confirmed</option>
                            <option value="SHIPPED" className="bg-white text-dark">🚚 Shipped</option>
                            <option value="DELIVERED" className="bg-white text-dark">🏠 Delivered</option>
                            <option value="CANCELLED" className="bg-white text-dark">❌ Cancelled</option>
                        </select>
                      </td>
                      
                      {/* ACTIONS */}
                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                            <button 
                              onClick={() => downloadPdf(order.id, 'invoice')}
                              className="btn btn-sm btn-primary rounded-pill px-3 fw-bold shadow-sm"
                            >
                              <i className="bi bi-file-earmark-pdf-fill me-1"></i> Facture
                            </button>

                            <button 
                              onClick={() => downloadPdf(order.id, 'preparation')}
                              className="btn btn-sm btn-warning text-dark rounded-pill px-3 fw-bold shadow-sm"
                            >
                              <i className="bi bi-box-seam-fill me-1"></i> Bon Prépa
                            </button>
                        </div>
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