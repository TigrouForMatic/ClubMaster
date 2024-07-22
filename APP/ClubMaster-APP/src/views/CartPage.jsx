import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import useStore from '../store/store';
import api from '../js/App/Api';
import styles from "../styles/CartPage.module.css";
import { Bin, Cart } from 'iconoir-react';
import CustomConfirm from '../components/CustomConfirm';
import ComingSoonImage from "../assets/photos/comming_soon.jpg";

function CartPage() {
  const navigate = useNavigate();

  const panier = useStore((state) => state.panier);
  const currentUserAddresses = useStore((state) => state.currentUserAddresses);
  const currentUser = useStore((state) => state.currentUser);
  const deleteItem = useStore((state) => state.deleteItem);
  const updateItem = useStore((state) => state.updateItem);
  const addItem = useStore((state) => state.addItem);

  const [promoCode, setPromoCode] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalcode: '',
    country: ''
  });
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const total = panier.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    if (panier.length === 0) {
      navigate('/shop');
    }
  }, [panier, navigate]);

  useEffect(() => {
    if (panier.length === 0) {
      navigate('/shop');
    }
    
    if (currentUserAddresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(currentUserAddresses[0].id);
    }
  }, [panier, navigate, currentUserAddresses, selectedAddressId]);

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
      updateItem('panier', id, { quantity: newQuantity });
    }
  };

  const handleApplyPromo = () => {
    // Logique pour appliquer le code promo
    console.log("Code promo appliqué:", promoCode);
  };

  const handleAddAddress = () => {
    setShowAddressForm(!showAddressForm);
  };

  const handleAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleAddressSelect = (id) => {
    setSelectedAddressId(id);
  };

  const handleSubmitAddress = async(e) => {
    e.preventDefault();

    try {
      const addressResponse = await api.post('/address/', {
        ...newAddress,
        referenceid: currentUser.id,
        private: true,
        validate: true
      });

      addItem('currentAddressesPerson', addressResponse);

      handleAddressSelect(addressResponse.id);

      handlePersonalInformationSet();
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setShowAddressForm(false);
    }
  };

  return (
    <div className={styles.cartPageContainer}>
      <div className={styles.productList}>
        <h2 className={styles.cartTitle}>
          Votre panier <Cart className={styles.cartIcon} />
        </h2>
        {panier.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <img 
              src={item.imageurl || ComingSoonImage}  
              alt={item.imageurl ? item.label : "Image à venir"} 
              className={styles.itemImage} />
            <div className={styles.itemInfo}>
              <h3>{item.label}</h3>
              <p>Prix: {item.price.toFixed(2)}€</p>
              {item.stock > 0 && 
                <p className={styles.inStock}>En stock</p>
              }
            </div>
            <div className={styles.editItem}>
              <select 
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                className={styles.quantitySelect}
              >
                {[...Array(Math.min(10, item.stock)).keys()].map(i => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
                {item.stock > 10 && <option value={10}>10+</option>}
              </select>
              <button onClick={() => handleRemoveItem(item.id)} className={styles.removeButton}>
                <Bin />
              </button>
            </div>
          </div>
        ))}
        <hr className={styles.separator} />
        <div className={styles.paymentSection}>
          <h3>Adresse de facturation</h3>
          {currentUserAddresses.map((add) => (
            <div 
              key={add.id} 
              className={`${styles.addressOption} ${selectedAddressId === add.id ? styles.selectedAddress : ''}`}
              onClick={() => handleAddressSelect(add.id)}
            >
              <p>{add.street}</p>
              <p>{add.postalcode} {add.city}</p>
              <p>{add.state}, {add.country}</p>
            </div>
          ))}
          <button onClick={handleAddAddress} className={styles.addButton}>Ajouter une adresse</button>
          {showAddressForm && (
            <form onSubmit={handleSubmitAddress} className={styles.addressForm}>
              <input type="text" name="street" value={newAddress.street} onChange={handleAddressChange} placeholder="Rue" required />
              <input type="text" name="city" value={newAddress.city} onChange={handleAddressChange} placeholder="Ville" required />
              <input type="text" name="state" value={newAddress.state} onChange={handleAddressChange} placeholder="État/Région" required />
              <input type="text" name="postalcode" value={newAddress.postalcode} onChange={handleAddressChange} placeholder="Code postal" required />
              <input type="text" name="country" value={newAddress.country} onChange={handleAddressChange} placeholder="Pays" required />
              <button type="submit">Ajouter</button>
            </form>
          )}
        </div>
        <hr className={styles.separator} />
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