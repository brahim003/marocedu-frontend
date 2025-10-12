import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({
  product,
  fmtMAD,
  selectedOptionId, // ← controlled prop
  onOptionChange,
}) {
  const navigate = useNavigate();

  // find index of selected option from props
  const selectedOptionIndex = product.options
    ? product.options.findIndex((o) => o.id === selectedOptionId)
    : 0;

  const option =
    product.options && selectedOptionIndex >= 0
      ? product.options[selectedOptionIndex]
      : { image: product.image, price: product.price, id: product.id };

  const nextOption = () => {
    if (!product.options) return;
    const newIndex = (selectedOptionIndex + 1) % product.options.length;
    onOptionChange && onOptionChange(product.options[newIndex].id, 1); // default quantity 1
  };

  const prevOption = () => {
    if (!product.options) return;
    const newIndex =
      (selectedOptionIndex - 1 + product.options.length) % product.options.length;
    onOptionChange && onOptionChange(product.options[newIndex].id, 1);
  };

  // remove local useState + useEffect for first load
  // because selection is now controlled by parent

  return (
    <article className="product-card card h-100 border-0 shadow rounded-4 overflow-hidden small-tile position-relative">
      {/* arrows */}
      {product.options && product.options.length > 1 && (
        <>
          <button
            onClick={prevOption}
            style={{
              position: "absolute",
              top: "35%",
              left: "8px",
              transform: "translateY(-50%)",
              background: "white",
              border: "1px solid #ddd",
              fontSize: "1.4rem",
              cursor: "pointer",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            ‹
          </button>

          <button
            onClick={nextOption}
            style={{
              position: "absolute",
              top: "35%",
              right: "8px",
              transform: "translateY(-50%)",
              background: "white",
              border: "1px solid #ddd",
              fontSize: "1.4rem",
              cursor: "pointer",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            ›
          </button>
        </>
      )}

      {/* Image */}
      <div className="product-img ratio ratio-4x4 bg-white">
        <img
          src={option.image}
          alt={product.name}
          className="w-100 h-100 object-fit-contain"
          style={{ cursor: "pointer" }}
          onClick={() =>
            navigate(`/product/${product.id}?option=${option.id}`)
          }
        />
      </div>

      {/* Content */}
      <div className="card-body p-0">
        <h3
          className="product-title h6 fw-400 text-uppercase mb-1 text-truncate-2"
          style={{ color: "#0d47a1" }}
        >
          {product.name}
        </h3>

        <div className="product-price fw-bold mb-1">{fmtMAD(option.price)}</div>

        <div className="d-flex align-items-center gap-1 mb-2">
          <i
            className={`bi ${
              product.inStock
                ? "bi-check-circle-fill text-success"
                : "bi-exclamation-circle-fill text-warning"
            }`}
          />
          <span className="xsmall text-secondary">
            {product.inStock ? "En stock" : "Sur commande"}
          </span>
        </div>
      </div>
    </article>
  );
}
