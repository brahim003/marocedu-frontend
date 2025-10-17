// src/pages/MyCart.jsx
import React, { useMemo } from "react";

export default function MyCart({ cart, setCart }) {
  //  total
  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  
  const fmtMAD = (n) =>
    new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(n);

  //  quantity
  const updateQuantity = (id, optionId, newQty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.optionId === optionId
          ? { ...item, quantity: Math.max(1, newQty) }
          : item
      )
    );
  };

  // 
  const removeItem = (id, optionId) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.optionId === optionId)));
  };

  return (
    <main className="container py-3">
      <h1 className="mb-3">Mon Panier</h1>

      {cart.length === 0 ? (
        <div className="text-center text-secondary py-4 border rounded-4">
          Votre panier est vide.
        </div>
      ) : (
        <>
          <div className="list-group mb-3">
            {cart.map((item) => (
              <div
                key={item.id + item.optionId}
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
                    <small className="text-muted">Option: {item.optionId}</small>
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
                  <span>{fmtMAD(item.price * item.quantity)}</span>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeItem(item.id, item.optionId)}
                  >
                   <i className="bi bi-trash "></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="d-flex justify-content-between align-items-center border-top pt-3">
            <h5>Total:</h5>
            <h5>{fmtMAD(totalPrice)}</h5>
          </div>
        </>
      )}
    </main>
  );
}
