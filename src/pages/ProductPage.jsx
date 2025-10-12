import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { productOptions } from "../data/productData";

export default function ProductPage() {
    const { id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const optionId = queryParams.get("option");

    // find option based on URL
    const option = productOptions.find(opt => opt.id === optionId);
    if (!option) return <div>Produit non trouvé</div>;

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    return (
        <main style={{ padding: "20px" }}>

            {/* Main image */}
            <div style={{ maxWidth: "400px", marginBottom: "20px" }}>
                <img
                    src={option.images[selectedImageIndex]}
                    alt={`${option.productName} image ${selectedImageIndex + 1}`}
                    style={{ width: "100%", objectFit: "contain", borderRadius: "30px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                />
            </div>

            {/* Thumbnails */}
            <div style={{ display: "flex", gap: "10px" }}>
                {option.images.map((img, idx) => (
                    <img
                        key={idx}
                        src={img}
                        alt={`${option.productName} thumb ${idx + 1}`}
                        style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            border: selectedImageIndex === idx ? "2px solid blue" : "1px solid #ccc",
                            cursor: "pointer",
                            transition: "all 0.3s ease"
                        }}

                        onClick={() => setSelectedImageIndex(idx)}
                    />
                ))}
            </div>

            <div style={{ fontWeight: "bold", fontSize: "1.5rem", marginTop: "20px", color: "#0b3f8dff" }}>{option.productName}</div>

            {/* Price */}
            <div style={{ fontWeight: "", fontSize: "1.7rem", marginTop: "15px", color: "#000000ff" }}>
                {option.price} {option.currency}
            </div>
            <div style={{
                fontSize: "29px",
                color: "gray",
                textDecoration: "line-through",
                // marginTop: "1px",
            }}>{option.oldPrice} {option.currency} </div>

            <div style={{ fontSize: "29px",marginTop: "10px", color: option.inStock ? "black" : "red" }}>
                {option.inStock ? " 🟢 En stock" : " ⚠️ Sur commande"}
            </div>

        </main>
    );
}
