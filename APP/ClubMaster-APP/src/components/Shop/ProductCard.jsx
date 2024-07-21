import React from 'react';
import styles from '../../styles/ShopView.module.css';
import ComingSoonImage from "../../assets/photos/comming_soon.jpg";

const ProductCard = ({ product, onAddToCart }) => (
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
        <button 
            className={styles.addToCartButton}
            onClick={() => onAddToCart(product)} >
            Ajouter au panier
        </button>
    </div>
);

export default ProductCard;