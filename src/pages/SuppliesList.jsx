// Fichier: src/pages/SuppliesList.jsx
import React, { useEffect, useRef, useState } from "react"; // ✅ Ajout de useState
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Ajout d'axios
// ❌ SUPPRIMER L'IMPORTATION STATIQUE: import { supplies } from "../data/supplies"; 
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

  // 🎯 NOUVEAUX ÉTATS POUR GÉRER L'APPEL API
  const [suppliesList, setSuppliesList] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // ------------------------------

  const [productToRemove, setProductToRemove] = React.useState(null);

  // track previous school/level
  const prevSlugRef = useRef(slug);
  const prevLevelRef = useRef(levelSlug);

  useEffect(() => {
    // Si l'école ou le niveau change, on réinitialise les options 
    if (prevSlugRef.current !== slug || prevLevelRef.current !== levelSlug) {
      setSelectedOptions({});
    }
    prevSlugRef.current = slug;
    prevLevelRef.current = levelSlug;


    // ✅ LA NOUVELLE FONCTION ASYNCHRONE POUR APPELER L'API
    const fetchSupplies = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // L'URL de l'API que nous avons développée
            const API_URL = `/api/supplies/by-school/${slug}/level/${levelSlug}`;
            const response = await axios.get(API_URL);

            const fetchedSupplies = response.data; // La liste des SupplyDTO

            setSuppliesList(fetchedSupplies);
            
            // Logique existante: filtre les articles déjà dans le panier
            const itemsInCartForLevel = cart
                .filter(item => item.school === slug && item.level === levelSlug)
                .map(item => item.id);
            
            const initialDisplayItems = fetchedSupplies.filter(
                item => !itemsInCartForLevel.includes(item.id)
            );
            
            // Met à jour la liste affichée
            setDisplayItems(initialDisplayItems);

        } catch (err) {
            console.error("Erreur de chargement des fournitures:", err);
            // Gère les erreurs réseau ou 500
            setError("Impossible de charger les fournitures. Vérifiez le serveur.");
            
            setSuppliesList([]); 
            setDisplayItems([]); 
        } finally {
            setIsLoading(false);
        }
    };
    
    // ❌ Suppression du filtre statique ici
    fetchSupplies();

  }, [slug, levelSlug, cart, setDisplayItems, setSelectedOptions]); 
  
  // --- Le reste du code (updateSelection, addAllToCartAndGo, confirmRemove) est CONSERVÉ ---

  const updateSelection = (productId, optionId, quantity) => {
    // ... (Logique existante : inchangée) ...
    setSelectedOptions((prev) => ({
        ...prev,
        [productId]: optionId,
    }));
    
    // Utilise displayItems qui vient maintenant de l'API
    const product = displayItems.find((p) => p.id === productId); 
    if (!product) return;

    // ... (Le reste de la logique du panier) ...
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
    // ... (Logique existante : inchangée) ...
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
    // ... (Logique existante : inchangée) ...
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

  // --- RENDU CONDITIONNEL (Loading et Erreur) ---

  if (isLoading) {
    return (
        <main className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-2">Chargement des fournitures scolaires...</p>
        </main>
    );
  }

  if (error) {
    return (
        <main className="container py-5">
            <div className="alert alert-danger" role="alert">
                ❌ Erreur: **{error}**
            </div>
        </main>
    );
  }

  // --- RENDU PRINCIPAL ---

  return (
    <main className="container py-3">
        {/* ... (Le reste du JSX reste inchangé, car il utilise displayItems) ... */}
        
        <header className="bg-white border rounded-4 shadow-sm px-3 py-2 mb-3 d-flex align-items-center gap-2">
            <h1 className="h6 mb-0 flex-grow-1 text-center text-truncate">
                Liste des fournitures
            </h1>
            <button className="btn btn-primary btn-sm" onClick={addAllToCartAndGo}>
                My Cart
            </button>
        </header>

        <div className="mb-2 text-secondary small">
            École: **{slug}** — Niveau: **{levelSlug}**
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
                        {/* ... (Bouton de suppression) ... */}
                        
                        <ProductCard
                            product={p} // Vient de l'API
                            fmtMAD={fmtMAD}
                            selectedOptionId={selectedOptions[p.id] || p.options[0]?.id} 
                            onOptionChange={(optionId, quantity) =>
                                updateSelection(p.id, optionId, quantity)
                            }
                        />
                    </div>
                ))
            )}
        </div>
        
        {/* ... (Modal de confirmation) ... */}

    </main>
  );
}