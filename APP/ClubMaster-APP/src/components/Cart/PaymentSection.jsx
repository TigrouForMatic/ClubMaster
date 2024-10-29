import React, { useState, useEffect } from 'react';
import styles from "../../styles/CartPage.module.css";

function PaymentSection() {
  const [promoCode, setPromoCode] = useState('');
  const [savedCards, setSavedCards] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);

  useEffect(() => {
    // Fetch user's saved cards
    fetchSavedCards();
  }, []);

  const fetchSavedCards = async () => {
    // Implement API call to fetch user's saved cards
    // For now, we'll use dummy data
    setSavedCards([
      { id: 1, last4: '1234', brand: 'Visa' },
      { id: 2, last4: '5678', brand: 'Mastercard' },
    ]);
  };

  const handleApplyPromo = () => {
    console.log("Code promo appliqué:", promoCode);
  };

  const handleAddCard = () => {
    setShowAddCard(true);
  };

  const handlePayWithCard = (cardId) => {
    console.log("Paiement avec la carte:", cardId);
  };

  const handlePayWithPaypal = () => {
    // Implement PayPal redirection
    console.log("Redirection vers PayPal");
  };

  const handlePayWithApplePay = () => {
    // Implement Apple Pay
    console.log("Paiement avec Apple Pay");
  };

  const handlePayWithGooglePay = () => {
    // Implement Google Pay
    console.log("Paiement avec Google Pay");
  };

  return (
    <div className={styles.paymentSection}>
      <h3>Choisir un mode de paiement</h3>
      
      {/* Cartes bancaires sauvegardées */}
      <h4>Cartes bancaires</h4>
      {savedCards.map(card => (
        <div key={card.id} className={styles.paymentOption} onClick={() => handlePayWithCard(card.id)}>
          <img src={`/path-to-${card.brand.toLowerCase()}-icon.png`} alt={card.brand} />
          <span>{card.brand} se terminant par {card.last4}</span>
        </div>
      ))}
      <button onClick={handleAddCard}>Ajouter une nouvelle carte</button>
      
      {showAddCard && (
        <div className={styles.addCardForm}>
          {/* Implement add card form */}
          <input type="text" placeholder="Numéro de carte" />
          <input type="text" placeholder="Date d'expiration" />
          <input type="text" placeholder="CVV" />
          <label>
            <input type="checkbox" /> Sauvegarder cette carte pour de futurs achats
          </label>
          <button>Ajouter la carte</button>
        </div>
      )}

      {/* PayPal */}
      <h4>PayPal</h4>
      <div className={styles.paymentOption} onClick={handlePayWithPaypal}>
        <img src="/path-to-paypal-icon.png" alt="PayPal" />
        <span>Payer avec PayPal</span>
      </div>

      {/* Apple Pay et Google Pay */}
      <h4>Autres modes de paiement</h4>
      <div className={styles.paymentOption} onClick={handlePayWithApplePay}>
        <img src="/path-to-apple-pay-icon.png" alt="Apple Pay" />
        <span>Payer avec Apple Pay</span>
      </div>
      <div className={styles.paymentOption} onClick={handlePayWithGooglePay}>
        <img src="/path-to-google-pay-icon.png" alt="Google Pay" />
        <span>Payer avec Google Pay</span>
      </div>

      {/* Code promo */}
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