// Fichier: src/pages/SuppliesList.jsx
import React, { useEffect, useRef, useState } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; 
import ProductCard from "../components/ProductCard";
import "./SuppliesList.css";

// ✅ FONCTION UTILITAIRE POUR RÉCUPÉRER L'ÉTAT DU LOCAL STORAGE
function getInitialRemovedItemIds() {
    try {
        const saved = localStorage.getItem('removedSupplyIds');
        return saved ? JSON.parse(saved).map(Number) : []; 
    } catch (e) {
        return [];
    }
}

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

  // 🎯 ÉTATS PRINCIPAUX
  const [suppliesList, setSuppliesList] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ✅ ÉTAT PERSISTANT : IDs des produits masqués
  const [removedItemIds, setRemovedItemIds] = useState(getInitialRemovedItemIds);
  
  const [productToRemove, setProductToRemove] = React.useState(null);

  // track previous school/level
  const prevSlugRef = useRef(slug);
  const prevLevelRef = useRef(levelSlug);


  // ✅ EFFECT 1: SAUVEGARDER LES ITEMS SUPPRIMÉS
  useEffect(() => {
    localStorage.setItem('removedSupplyIds', JSON.stringify(removedItemIds));
  }, [removedItemIds]); 


  // ✅ EFFECT 2: FETCH DATA
  useEffect(() => {
    if (prevSlugRef.current !== slug || prevLevelRef.current !== levelSlug) {
      setSelectedOptions({});
      localStorage.removeItem('removedSupplyIds');
      setRemovedItemIds([]); 
    }
    prevSlugRef.current = slug;
    prevLevelRef.current = levelSlug;

    const fetchSupplies = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const API_URL = `/api/supplies/by-school/${slug}/level/${levelSlug}`;
            const response = await axios.get(API_URL);
            setSuppliesList(response.data); 
        } catch (err) {
            console.error("Erreur de chargement:", err);
            setError("Impossible de charger les fournitures.");
            setSuppliesList([]); 
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchSupplies();

  }, [slug, levelSlug, setSelectedOptions]); 


  // ✅ EFFECT 3: FILTRAGE DYNAMIQUE
  useEffect(() => {
    if (suppliesList.length === 0) {
        setDisplayItems([]);
        return;
    }

    const itemsInCartForLevel = cart
        .filter(item => item.school === slug && item.level === levelSlug)
        .map(item => Number(item.id)); 
    
    const initialDisplayItems = suppliesList
        .filter(item => !itemsInCartForLevel.includes(Number(item.id)))
        .filter(item => !removedItemIds.includes(Number(item.id)));
    
    setDisplayItems(initialDisplayItems);

  }, [cart, suppliesList, removedItemIds, slug, levelSlug, setDisplayItems]); 


  // --- Les Fonctions Métier ---

  const updateSelection = (productId, optionId, quantity) => {
    setSelectedOptions((prev) => ({
        ...prev,
        [String(productId)]: optionId,
    }));
    
    const product = suppliesList.find((p) => p.id === productId); 
    if (!product) return;

    const option = product.options?.find((o) => o.id === optionId) || product.options?.[0]; 

    const newItem = {
        id: product.id,
        name: product.name,
        price: option?.price,
        image: option?.image,
        quantity,
        optionId: option?.id,
        // 🔥 FIX 1: On vérifie les deux formats possibles (isBook OU is_book)
        isBook: product.isBook || product.is_book || false 
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
    const itemsToAdd = displayItems.map((p) => {
        const optionId = selectedOptions[String(p.id)] || p.options?.[0]?.id;
        const option = p.options?.find((o) => o.id === optionId) || p.options?.[0];

        return {
            id: p.id,
            name: p.name,
            price: option?.price || p.price,
            image: option?.image || "",
            quantity: 1, 
            optionId: option?.id || null,
            school: slug,      
            level: levelSlug,  
            // 🔥 FIX 2: On vérifie ici aussi les deux formats
            isBook: p.isBook || p.is_book || false
        };
    });

    setCart((prevCart) => {
        const updatedCart = [...prevCart];

        itemsToAdd.forEach((newItem) => {
            const exists = updatedCart.find(item => item.id === newItem.id && item.optionId === newItem.optionId);

            if (!exists) {
                updatedCart.push(newItem);
            }
        });

        return updatedCart;
    });

    navigate("/mycart");
  };

  const confirmRemove = () => {
    if (!productToRemove) return;

    const productIdNum = Number(productToRemove); 
    const productIdString = productToRemove; 

    setRemovedItemIds(prev => [...prev, productIdNum]);
    setCart((prev) => prev.filter((item) => item.id !== productIdNum));
    
    setSelectedOptions((prev) => {
      const copy = { ...prev };
      delete copy[productIdString]; 
      return copy;
    });

    setProductToRemove(null);
  };
  
  const resetRemovedItems = () => {
      setRemovedItemIds([]); 
      localStorage.removeItem('removedSupplyIds'); 
  };


  const fmtMAD = (n) =>
    new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(n);

  // --- RENDU ---

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
                ❌ Erreur: <strong>{error}</strong>
            </div>
        </main>
    );
  }

  return (
    <main className="container py-3">
        
        <header className="bg-white border rounded-4 shadow-sm px-3 py-2 mb-3 d-flex align-items-center gap-2">
            <h1 className="h6 mb-0 flex-grow-1 text-center text-truncate">
                Liste des fournitures
            </h1>
            <button className="btn btn-sm btn-outline-secondary me-2" onClick={resetRemovedItems}>
                Afficher tout
            </button>
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
                        {suppliesList.length > 0 
                            ? "Tous les articles ont été ajoutés au panier." 
                            : "Aucune fourniture trouvée pour ce niveau."}
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
                            selectedOptionId={selectedOptions[String(p.id)] || p.options?.[0]?.id} 
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
                        Êtes-vous sûr de supprimer ce produit ?
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