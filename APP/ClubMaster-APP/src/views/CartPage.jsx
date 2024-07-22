import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"; 
import useStore from '../store/store';
import styles from "../styles/CartPage.module.css";
import { Bin, Cart } from 'iconoir-react';
import CustomConfirm from '../components/CustomConfirm';

function CartPage() {
  const navigate = useNavigate();
  const panier = useStore((state) => state.panier);
  const deleteItem = useStore((state) => state.deleteItem);
  const updateItemQuantity = useStore((state) => state.updateItemQuantity);
  const [promoCode, setPromoCode] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);

  const total = panier.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    if(panier.length === 0) {
      navigate('/shop');
    } 
  }, [panier, navigate]);

  const handleConfirm = () => {
    if (itemToDelete) {
      deleteItem('panier', itemToDelete);
      setItemToDelete(null);
    }
    setIsConfirmOpen(false);
  };

  const handleCancel = () => {
    setItemToDelete(null);
    setIsConfirmOpen(false);
  };

  const handleRemoveItem = (id) => {
    const labelItem = panier.find(prod => prod.id === id)?.label;
    let confirmLabel = `Êtes-vous sûr de vouloir supprimer ${labelItem} de votre panier ? `;
    if (panier.length === 1) {
      confirmLabel += 'Vous serez redirigé vers la boutique';
    }
    setConfirmMessage(confirmLabel);
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity === 0) {
      handleRemoveItem(id);
    } else {
      updateItemQuantity(id, newQuantity);
    }
  };

  const handleApplyPromo = () => {
    // Logique pour appliquer le code promo
    console.log("Code promo appliqué:", promoCode);
  };

  return (
    <div className={styles.cartPageContainer}>
      <div className={styles.productList}>
        <h2>Votre panier <Cart /></h2>
        {panier.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <img src={item.imageurl} alt={item.label} className={styles.itemImage} />
            <div className={styles.itemInfo}>
              <h3>{item.label}</h3>
              <p>Prix: {item.price.toFixed(2)}€</p>
              {item.stock > 0 && 
                <p className={styles.inStock}>En stock</p>
              }
              <select 
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                className={styles.quantitySelect}
              >
                {[...Array(Math.min(10, item.stock)).keys()].map(i => (
                  <option key={i} value={i}>{i === 0 ? "Retirer" : i}</option>
                ))}
                {item.stock > 10 && <option value={10}>10+</option>}
              </select>
            </div>
            <button onClick={() => handleRemoveItem(item.id)} className={styles.removeButton}>
              <Bin />
            </button>
          </div>
        ))}
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
          <span>Payer avec Bancontact</span>
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
      </div>
      <div className={styles.orderSummary}>
        <h2>Résumé de la commande</h2>
        <p>Total: {total.toFixed(2)}€</p>
        <button className={styles.checkoutButton}>Passer la commande</button>
      </div>
      <CustomConfirm
        isOpen={isConfirmOpen}
        message={confirmMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default CartPage;