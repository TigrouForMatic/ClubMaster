import React from 'react';
import useStore from '../../store/store';
import styles from '../../styles/ShopView.module.css';
import { Cart } from 'iconoir-react';

const CartBar = () => {
  const { panier } = useStore();
  const lastAddedProduct = panier[0];

  const calculateTotalCost = () => panier.reduce((total, product) => total + product.quantity * product.price, 0);
  const calculateItemCount = () => panier.reduce((count, product) => count + product.quantity, 0);

  const totalCost = calculateTotalCost();
  const itemCount = calculateItemCount();

  return (
    <div className={styles.cartBar}>
      <div className={styles.lastAdded}>
        Dernier ajout : {lastAddedProduct?.label || 'Aucun'}
      </div>
      <div className={styles.totalCost}>
        <div className={styles.cartIconWrapper}>
          <Cart />
          <span className={styles.itemCountBubble}>{itemCount}</span>
        </div>
        {totalCost.toFixed(2)} €
      </div>
    </div>
  );
};

export default CartBar;