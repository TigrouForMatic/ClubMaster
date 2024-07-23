// CartPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import useStore from '../store/store';
import styles from "../styles/CartPage.module.css";
import CustomConfirm from '../components/CustomConfirm';
import CartHeader from '../components/Cart/CartHeader';
import CartItemList from '../components/Cart/CartItemList';
import AddressSection from '../components/Cart/AddressSection';
import PaymentSection from '../components/Cart/PaymentSection';
import OrderSummary from '../components/Cart/OrderSummary';

function CartPage() {
  const navigate = useNavigate();
  const panier = useStore((state) => state.panier);
  const currentUserAddresses = useStore((state) => state.currentUserAddresses);
  const currentUser = useStore((state) => state.currentUser);
  const deleteItem = useStore((state) => state.deleteItem);
  const updateItem = useStore((state) => state.updateItem);
  const addItem = useStore((state) => state.addItem);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

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

  return (
    <div className={styles.cartPageContainer}>
      <CartHeader onUndo={() => navigate('/shop')} />
      <div className={styles.productList}>
        <CartItemList 
          panier={panier}
          onRemoveItem={handleRemoveItem}
          onQuantityChange={(id, newQuantity) => {
            if (newQuantity === 0) {
              handleRemoveItem(id);
            } else {
              updateItem('panier', id, { quantity: newQuantity });
            }
          }}
        />
        <hr className={styles.separator} />
        <AddressSection 
          currentUserAddresses={currentUserAddresses}
          selectedAddressId={selectedAddressId}
          onAddressSelect={setSelectedAddressId}
          currentUser={currentUser}
          addItem={addItem}
        />
        <hr className={styles.separator} />
        <PaymentSection />
      </div>
      <OrderSummary panier={panier} />
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