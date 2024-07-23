import React from 'react';
import { Cart } from 'iconoir-react';
import styles from "../../styles/CartPage.module.css";
import CartItem from './CartItem';

function CartItemList({ panier, onRemoveItem, onQuantityChange }) {
  return (
    <>
      <h2 className={styles.cartTitle}>
        Votre panier <Cart className={styles.cartIcon} />
      </h2>
      {panier.map((item) => (
        <CartItem 
          key={item.id}
          item={item}
          onRemove={() => onRemoveItem(item.id)}
          onQuantityChange={(newQuantity) => onQuantityChange(item.id, newQuantity)}
        />
      ))}
    </>
  );
}

export default CartItemList;