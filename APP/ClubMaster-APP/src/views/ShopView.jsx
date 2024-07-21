import React, { useState, useEffect, useMemo } from "react";
import useStore from '../store/store';
import api from '../js/App/Api';
import styles from "../styles/ShopView.module.css";
import ComingSoonImage from "../assets/photos/comming_soon.jpg";

const ProductCard = ({ product }) => (
  <div className={styles.productCard}>
    <img 
      src={product.imageurl || ComingSoonImage} 
      alt={product.imageurl ? product.label : "Image à venir"} 
      className={styles.productImage} 
    />
    <h3 className={styles.productName}>{product.label}</h3>
    <p className={styles.productDescription}>{product.description}</p>
    <p className={styles.productPrice}>{product.price.toFixed(2)} €</p>
    <p className={styles.productStock}>En stock: {product.stock}</p>
    <button className={styles.addToCartButton}>Ajouter au panier</button>
  </div>
);

const useShopData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userClubs = useStore((state) => state.userClubs);
  const setItems = useStore((state) => state.setItems);
  const productTypes = useStore((state) => state.productTypes);
  const products = useStore((state) => state.products);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const arrayClubId = userClubs.map(club => club.id);

        const typeShopData = await api.get("/productType", { params: { arrayClubId: JSON.stringify(arrayClubId) } });
        setItems('productTypes', typeShopData);

        const arrayTypeProductId = typeShopData.map(type => type.id);
        const productData = await api.get("/product", { params: { arrayTypeProductId: JSON.stringify(arrayTypeProductId) } });
        setItems('products', productData);

        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setError(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setItems, userClubs]);

  return { productTypes, products, isLoading, error };
};

function ShopView() {
  const { productTypes, products, isLoading, error } = useShopData();
  const [selectedType, setSelectedType] = useState("all");

  const filteredProducts = useMemo(() => {
    if (selectedType === "all") {
      return products;
    }
    return products.filter(prod => prod.producttypeid == selectedType);
  }, [products, selectedType]);

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
        {productTypes.map((type) => (
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