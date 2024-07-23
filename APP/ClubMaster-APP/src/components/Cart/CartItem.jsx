import React from 'react';
import { Bin } from 'iconoir-react';
import styles from "../../styles/CartPage.module.css";
import ComingSoonImage from "../../assets/photos/comming_soon.jpg";

function CartItem({ item, onRemove, onQuantityChange }) {
  return (
    <div className={styles.cartItem}>
      <img 
        src={item.imageurl || ComingSoonImage}  
        alt={item.imageurl ? item.label : "Image à venir"} 
        className={styles.itemImage} 
      />
      <div className={styles.itemInfo}>
        <h3>{item.label}</h3>
        <p>Prix: {item.price.toFixed(2)}€</p>
        {item.stock > 0 && <p className={styles.inStock}>En stock</p>}
      </div>
      <div className={styles.editItem}>
        <select 
          value={item.quantity}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          className={styles.quantitySelect}
        >
          {[...Array(Math.min(10, item.stock)).keys()].map(i => (
            <option key={i} value={i + 1}>{i + 1}</option>
          ))}
          {item.stock > 10 && <option value={10}>10+</option>}
        </select>
        <button onClick={onRemove} className={styles.removeButton}>
          <Bin />
        </button>
      </div>
    </div>
  );
}

export default CartItem;