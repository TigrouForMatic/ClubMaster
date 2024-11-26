import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import api from '../../js/App/Api';
import useStore from '../../store/store';
import styles from "../../styles/ModaleEditpersonnalData.module.css";
import AddressForm from '../User/AdressesForm';

function ModalEditPersonnalData({ isOpen, onClose }) {
  const { currentUser, login, setCurrentUser, setLogin } = useStore();

  const [personnalData, setPersonnalData] = useState({
    name: currentUser.name || '',
    emailaddress: currentUser.emailaddress || '',
    phonenumber: currentUser.phonenumber || '',
    naissancedate: currentUser.naissancedate || '',
  });

  const [loginData, setLoginData] = useState({
    login: login.login,
    pseudo: login.pseudo,
  });

  const handleChangePersonnalData = (e) => {
    const { name, value } = e.target;
    setPersonnalData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    if (name === 'login') {
      setLoginData(prevData => ({ ...prevData, [name]: value }));
      setPersonnalData(prevData => ({ ...prevData, ['emailaddress']: value }));
    } else {
      setLoginData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Mise à jour des données de connexion
      if (loginData.login !== login.login || loginData.pseudo !== login.pseudo) {
        const loginPayload = {
          ...login,
          login: loginData.login,
          pseudo: loginData.pseudo,
        };
        const loginResponse = await api.put(`/login/${login.id}`, loginPayload);
        setLogin(loginResponse);
      }

      // Mise à jour des données personnelles
      if (personnalData.name !== currentUser.name || 
          personnalData.emailaddress !== currentUser.emailaddress || 
          personnalData.phonenumber !== currentUser.phonenumber || 
          personnalData.naissancedate !== currentUser.naissancedate) {

        const personalPayload = {
          ...currentUser,
          name: personnalData.name,
          emailaddress: personnalData.emailaddress,
          phonenumber: personnalData.phonenumber,
          naissancedate: personnalData.naissancedate,
        };

        const personalResponse = await api.put(`/personphysic/${currentUser.id}`, personalPayload);
        setCurrentUser(personalResponse);
      }
      
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la création/modification de l\'utilisateur:', error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const changePassword = () => {
    console.log('changePassword');
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.headerModal}>
        <h2 className={styles.title}>
          Modifier mes informations personnelles
        </h2>
        <button onClick={handleClose} className={styles.closeButton}>&times;</button>
      </div>

      <form onSubmit={handleSubmit} className={styles.content}>
        <h2>Informations personnelles</h2>
        <div>
          <label htmlFor="name">Nom :</label>
          <input
            type="text"
            id="name"
            name="name"
            value={personnalData.name}
            onChange={handleChangePersonnalData}
            required
          />
        </div>

        <div>
          <label htmlFor="pseudo">Pseudo :</label>
          <input
            type="text"
            id="pseudo"
            name="pseudo"
            value={loginData.pseudo}
            onChange={handleChangeLogin}
          />
        </div>

        <div>
          <label htmlFor="naissancedate">Date de naissance :</label>
          <input
            type="date"
            id="naissancedate" 
            name="naissancedate"
            value={personnalData.naissancedate ? new Date(personnalData.naissancedate).toISOString().split('T')[0] : ''}
            onChange={handleChangePersonnalData}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label htmlFor="phonenumber">Téléphone :</label>
          <input
            type="tel"
            id="phonenumber"
            name="phonenumber"
            value={personnalData.phonenumber}
            onChange={handleChangePersonnalData}
          />
        </div>

        <hr />

        <h2>Adresse</h2>

        <AddressForm />

        <hr />

        <h2>Informations de connexion</h2>

        <div>
          <label htmlFor="login">Email :</label>
          <input
            type="text"
            id="login"
            name="login"
            value={loginData.login}
            onChange={handleChangeLogin}
          />
        </div>

        <button type="button" onClick={changePassword} className={styles.changePasswordButton}>
            Changer mon mot de passe
        </button>

        <hr />

        <div className={styles.buttonContainer}>
          <button type="button" onClick={handleClose} className={styles.unregisterButton}>
            Annuler
          </button>
          <button type="submit" className={styles.registerButton}>
            Modifier
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ModalEditPersonnalData;
