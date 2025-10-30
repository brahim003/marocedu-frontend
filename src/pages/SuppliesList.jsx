// src/pages/SuppliesList.jsx
import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supplies } from "../data/supplies";
import ProductCard from "../components/ProductCard";
import "./SuppliesList.css";

export default function SuppliesList({
  cart,
  setCart,
  selectedOptions,
  setSelectedOptions,
  displayItems,
  setDisplayItems,
}) {
  const navigate = useNavigate();
  const { slug, levelSlug } = useParams();

  const [productToRemove, setProductToRemove] = React.useState(null);

  // track previous school/level
  const prevSlugRef = useRef(slug);
  const prevLevelRef = useRef(levelSlug);

  useEffect(() => {
    if (displayItems.length === 0) {
      setDisplayItems(
        supplies.filter((p) => p.school === slug && p.level === levelSlug)
      );
    }

    // reset selectedOptions فقط اذا user bdel school/level
    if (prevSlugRef.current !== slug || prevLevelRef.current !== levelSlug) {
      setSelectedOptions({});
      prevSlugRef.current = slug;
      prevLevelRef.current = levelSlug;
    }
  }, [slug, levelSlug, displayItems, setDisplayItems, setSelectedOptions]);

  const updateSelection = (productId, optionId, quantity) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [productId]: optionId,
    }));

    const product = displayItems.find((p) => p.id === productId);
    if (!product) return;

    const option = product.options.find((o) => o.id === optionId) || product.options[0];

    const newItem = {
      id: product.id,
      name: product.name,
      price: option.price,
      image: option.image,
      quantity,
      optionId: option.id,
    };

    setCart((prev) => {
      const newCart = [...prev];
      const index = newCart.findIndex((i) => i.id === newItem.id);
      if (index >= 0) {
        newCart[index] = newItem;
      } else {
        newCart.push(newItem);
      }
      return newCart;
    });
  };

  const addAllToCartAndGo = () => {
    const allItems = displayItems.map((p) => {
      const optionId = selectedOptions[p.id] || p.options[0]?.id;
      const option = p.options.find((o) => o.id === optionId) || p.options[0];

      return {
        id: p.id,
        name: p.name,
        price: option?.price || p.price,
        image: option?.image || "",
        quantity: 1,
        optionId: option?.id || null,
      };
    });

    setCart((prev) => {
      const newCart = [...prev];
      allItems.forEach((ai) => {
        const index = newCart.findIndex((i) => i.id === ai.id);
        if (index >= 0) {
          newCart[index] = ai;
        } else {
          newCart.push(ai);
        }
      });
      return newCart;
    });

    navigate("/mycart");
  };

  const confirmRemove = () => {
    if (!productToRemove) return;

    const productId = productToRemove;

    setDisplayItems((prev) => prev.filter((item) => item.id !== productId));
    setCart((prev) => prev.filter((item) => item.id !== productId));
    setSelectedOptions((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });

    setProductToRemove(null);
  };

  const fmtMAD = (n) =>
    new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(n);

  return (
    <main className="container py-3">
      <header className="bg-white border rounded-4 shadow-sm px-3 py-2 mb-3 d-flex align-items-center gap-2">
        <h1 className="h6 mb-0 flex-grow-1 text-center text-truncate">
          Liste des fournitures
        </h1>
        <button className="btn btn-primary btn-sm" onClick={addAllToCartAndGo}>
          My Cart
        </button>
      </header>

      <div className="mb-2 text-secondary small">
        École: <strong>{slug}</strong> — Niveau: <strong>{levelSlug}</strong>
      </div>

      <div className="row g-4 row-cols-2 row-cols-md-3 row-cols-lg-4">
        {displayItems.length === 0 ? (
          <div className="col-12">
            <div className="text-center text-secondary py-4 border rounded-4">
              Aucune fourniture trouvée pour ce niveau.
            </div>
          </div>
        ) : (
          displayItems.map((p) => (
            <div className="col position-relative" key={p.id}>
              <button
                className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                onClick={() => setProductToRemove(p.id)}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 18,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  zIndex: 2,
                }}
                data-bs-toggle="modal"
                data-bs-target="#confirmModal"
              >
                <i className="bi bi-trash"></i>
              </button>

              <ProductCard
                product={p}
                fmtMAD={fmtMAD}
                selectedOptionId={selectedOptions[p.id] || p.options[0]?.id} // controlled
                onOptionChange={(optionId, quantity) =>
                  updateSelection(p.id, optionId, quantity)
                }
              />
            </div>
          ))
        )}
      </div>

      <div
        className="modal fade"
        id="confirmModal"
        tabIndex="-1"
        aria-labelledby="confirmModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title " id="confirmModalLabel">
                Confirmer la suppression
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Êtes-vous sûr de  supprimer ce produit ?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={confirmRemove}
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
