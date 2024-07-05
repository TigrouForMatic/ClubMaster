import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import styles from "../styles/ShopView.module.css";

const ProductCard = ({ product }) => (
  <div className={styles.productCard}>
    <img src={product.image || "placeholder.jpg"} alt={product.label} className={styles.productImage} />
    <h3 className={styles.productName}>{product.label}</h3>
    <p className={styles.productDescription}>{product.description}</p>
    <p className={styles.productPrice}>{product.price.toFixed(2)} €</p>
    <p className={styles.productStock}>En stock: {product.stock}</p>
    <button className={styles.addToCartButton}>Ajouter au panier</button>
  </div>
);

const useShopData = (clubId) => {
  const [typeShop, setTypeShop] = useState([]);
  const [produit, setProduit] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typeShopResponse, produitResponse] = await Promise.all([
          axios.get(`http://localhost:3200/produitType?clubid=${clubId}`),
          axios.get("http://localhost:3200/produit"),
        ]);
        setTypeShop(typeShopResponse.data);
        setProduit(produitResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setError(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [clubId]);

  return { typeShop, produit, isLoading, error };
};

function ShopView() {
  const { typeShop, produit, isLoading, error } = useShopData(1);
  const [selectedType, setSelectedType] = useState("all");

  const filteredProducts = useMemo(() => {
    if (selectedType === "all") {
      return produit.filter(prod =>
        typeShop.some(type => prod.produittypeid === type.id)
      );
    }
    return produit.filter(prod => prod.produittypeid === selectedType);
  }, [produit, typeShop, selectedType]);

  if (isLoading) return <div className={styles.loading}>Chargement...</div>;
  if (error) return <div className={styles.error}>Une erreur est survenue : {error.message}</div>;

  return (
    <div className={styles.shopContainer}>
      <h1 className={styles.shopTitle}>Boutique du Club</h1>

      <div className={styles.categoryFilter}>
        <button
          className={`${styles.filterButton} ${selectedType === "all" ? styles.active : ""}`}
          onClick={() => setSelectedType("all")}
        >
          Tous
        </button>
        {typeShop.map((type) => (
          <button
            key={type.id}
            className={`${styles.filterButton} ${selectedType === type.id ? styles.active : ""}`}
            onClick={() => setSelectedType(type.id)}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className={styles.productGrid}>
        {filteredProducts.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  );
}

export default ShopView;