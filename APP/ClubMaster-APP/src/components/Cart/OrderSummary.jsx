import React from 'react';
import styles from "../../styles/CartPage.module.css";

function OrderSummary({ panier }) {
  const total = panier.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className={styles.stickyOrderSummary}>
      <div className={styles.orderSummary}>
        <h2>Résumé de la commande</h2>
        <table className={styles.orderTable}>
          <thead>
            <tr>
              <th>Prix unitaire</th>
              <th>Article</th>
              <th>Quantité</th>
              <th>Sous-total</th>
            </tr>
          </thead>
          <tbody>
            {panier.map((item) => (
              <tr key={item.id}>
                <td>{item.price.toFixed(2)}€</td>
                <td>{item.label}</td>
                <td>{item.quantity}</td>
                <td>{(item.price * item.quantity).toFixed(2)}€</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className={styles.totalSeparator}></td>
            </tr>
            <tr>
              <td colSpan="3" className={styles.totalLabel}>Total :</td>
              <td className={styles.totalAmount}>{total.toFixed(2)}€</td>
            </tr>
          </tfoot>
        </table>
        <button className={styles.checkoutButton}>Passer la commande</button>
      </div>
    </div>
  );
}

export default OrderSummary;