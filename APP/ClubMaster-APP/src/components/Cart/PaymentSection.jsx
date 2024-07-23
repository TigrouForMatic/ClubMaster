import React, { useState } from 'react';
import styles from "../../styles/CartPage.module.css";

function PaymentSection() {
  const [promoCode, setPromoCode] = useState('');

  const handleApplyPromo = () => {
    // Logique pour appliquer le code promo
    console.log("Code promo appliqué:", promoCode);
  };

  return (
    <div className={styles.paymentSection}>
      <h3>Ajouter un mode de paiement</h3>
      <div className={styles.paymentOption}>
        <img src="/path-to-credit-card-icon.png" alt="Credit Card" />
        <span>Ajouter une carte de crédit ou de débit</span>
      </div>
      <h4>Autres modes de paiement</h4>
      <div className={styles.paymentOption}>
        <img src="/path-to-sepa-icon.png" alt="SEPA" />
        <span>Ajouter un compte courant</span>
      </div>
      <div className={styles.paymentOption}>
        <img src="/path-to-bancontact-icon.png" alt="Bancontact" />
        <span>Payer avec Paypal</span>
      </div>
      <div className={styles.promoCodeSection}>
        <h4>Codes cartes cadeaux et bons de réduction disponibles</h4>
        <input 
          type="text" 
          placeholder="Saisissez le code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />
        <button onClick={handleApplyPromo}>Appliquer</button>
      </div>
    </div>
  );
}

export default PaymentSection;