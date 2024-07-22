import React from 'react';
import useStore from '../store/store';
import styles from "../styles/CartPage.module.css";

function CartPage() {
  const panier = useStore((state) => state.panier);
  const removeItem = useStore((state) => state.removeItem);

  const total = panier.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleRemoveItem = (id) => {
    removeItem('panier', id);
  };

  return (
    <div className={styles.cartPageContainer}>
      <div className={styles.productList}>
        <h2>Votre panier</h2>
        {panier.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <img src={item.image} alt={item.label} className={styles.itemImage} />
            <div className={styles.itemInfo}>
              <h3>{item.label}</h3>
              <p>Prix: {item.price}€</p>
              <p>Quantité: {item.quantity}</p>
            </div>
            <button onClick={() => handleRemoveItem(item.id)} className={styles.removeButton}>
              Supprimer
            </button>
          </div>
        ))}
      </div>
      <div className={styles.orderSummary}>
        <h2>Résumé de la commande</h2>
        <p>Total: {total.toFixed(2)}€</p>
        <button className={styles.checkoutButton}>Passer la commande</button>
      </div>
    </div>
  );
}

export default CartPage;