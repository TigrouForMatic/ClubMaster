import React from 'react';
import { Undo } from 'iconoir-react';
import styles from "../../styles/CartPage.module.css";

function CartHeader({ onUndo }) {
  return (
    <button onClick={onUndo} className={styles.undoButton}>
      <Undo /> Retour à la boutique
    </button>
  );
}

export default CartHeader;