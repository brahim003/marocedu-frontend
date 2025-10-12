// src/pages/MyCartMobile.jsx
import React, { useMemo } from "react";

export default function MyCartMobile({ cart, setCart }) {
    const totalPrice = useMemo(
        () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cart]
    );

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

    const removeItem = (id, optionId) => {
        setCart((prev) =>
            prev.filter((item) => !(item.id === id && item.optionId === optionId))
        );
    };

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
                                borderBottomLeftRadius: 0,
                                borderBottomRightRadius: 0,
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
                                    // First item → flat top corners
                                    borderRadiusStyle = {
                                        borderTopLeftRadius: 0,
                                        borderTopRightRadius: 0,
                                        borderBottomLeftRadius: 0,
                                        borderBottomRightRadius: 0,
                                    };
                                } else if (index === cart.length - 1) {
                                    // Last item → rounded bottom corners
                                    borderRadiusStyle = {
                                        borderTopLeftRadius: 0,
                                        borderTopRightRadius: 0,
                                        borderBottomLeftRadius: 12,
                                        borderBottomRightRadius: 12,
                                    };
                                } else {
                                    // Middle items → flat edges
                                    borderRadiusStyle = {
                                        borderRadius: 0,
                                    };
                                }

                                return (
                                    <div
                                        key={item.id + item.optionId}
                                        className="list-group-item d-flex flex-row gap-3 p-3"
                                        style={{
                                            position: "relative",
                                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                            border: "1px solid #eee",
                                            ...borderRadiusStyle,
                                        }}
                                    >
                                        {/* TRASH BUTTON */}
                                        <button
                                            className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                                            onClick={() => removeItem(item.id, item.optionId)}
                                            style={{
                                                position: "absolute",
                                                top: 8,
                                                right: 8,
                                                width: 32,
                                                height: 32,
                                                borderRadius: "50%",
                                                zIndex: 2,
                                            }}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>

                                        {/* IMAGE */}
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                style={{
                                                    width: 90,
                                                    height: 120,
                                                    objectFit: "cover",
                                                    borderRadius: 6,
                                                }}
                                            />
                                        )}

                                        {/* DETAILS */}
                                        <div className="flex-grow-1 d-flex flex-column justify-content-between">
                                            <div>
                                                <div className="fw-semibold" style={{ fontSize: "14px" }}>
                                                    {item.name}
                                                </div>
                                                <div className="fw-bold text-warning mt-1">
                                                    {fmtMAD(item.price)}
                                                </div>
                                                <span
                                                    className="badge mt-1"
                                                    style={{
                                                        backgroundColor: "#d4edda",
                                                        color: "#155724",
                                                    }}
                                                >
                                                    En stock
                                                </span>
                                            </div>

                                            {/* QUANTITY + PRICE */}
                                            <div className="d-flex align-items-center gap-2 mt-2">
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1,
                                                    }}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.optionId,
                                                                item.quantity - 1
                                                            )
                                                        }
                                                        style={{
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: 6,
                                                            border: "1px solid #ccc",
                                                            backgroundColor: "#f5f5f5",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        -
                                                    </button>

                                                    <input
                                                        type="number"
                                                        min={1}
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.optionId,
                                                                parseInt(e.target.value)
                                                            )
                                                        }
                                                        className="form-control form-control-sm"
                                                        style={{
                                                            width: 50,
                                                            textAlign: "center",
                                                            borderRadius: 6,
                                                            padding: "4px 0",
                                                            fontSize: "1rem",
                                                        }}
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.optionId,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                        style={{
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: 6,
                                                            border: "1px solid #ccc",
                                                            backgroundColor: "#f5f5f5",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <span className="fw-bold">
                                                    {fmtMAD(item.price * item.quantity)}
                                                </span>
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
                        style={{
                            border: "1px solid #eee",
                            backgroundColor: "#fff",
                        }}
                    >
                        <div className="d-flex justify-content-between mb-2">
                            <span className="fw-semibold">{cart.length} articles</span>
                            <span className="fw-bold">{fmtMAD(totalPrice)}</span>
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                            <span className="fw-semibold">Livraison</span>
                            <span className="fw-bold">{fmtMAD(8)}</span>
                        </div>

                        <hr />

                        <div className="d-flex justify-content-between mb-3">
                            <span className="fw-bold">Total TTC</span>
                            <span className="fw-bold text-primary">
                                {fmtMAD(totalPrice + 8)}
                            </span>
                        </div>

                        <button
                            className="btn btn-primary w-100 py-2 fw-bold"
                            style={{ borderRadius: "12px" }}
                        >
                            COMMANDER
                        </button>
                    </div>
                </>
            )}
        </main>
    );
}
