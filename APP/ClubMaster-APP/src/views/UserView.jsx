import React, { useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../js/App/Api';
import useStore from '../store/store';
import styles from '../styles/UserView.module.css';
import { SystemShut } from 'iconoir-react';

import UserImage from '../components/UserImage';
import LicenceList from '../components/User/LicenceList';
import BadgeSection from '../components/User/BadgeSection';
import MenuSection from '../components/User/MenuSection';
import ProgressBar from '../components/ProgressBar';

function UserView() {
  const navigate = useNavigate();
  const { currentUser, currentUserAddresses, userClubs, licences, licenceTypes, roles, setItems, setShowApp } = useStore();

  const user = useMemo(() => {
    const { postalcode = '', city = '' } = currentUserAddresses[0] || {};
  
    const addressLabel = postalcode && city ? `${postalcode} ${city}` : 'Aucune Adresse';
  
    return {
      ...currentUser,
      address: addressLabel
    };
  }, [currentUserAddresses, currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setItems('currentUser', null);
    setItems('login', null);
    navigate('/');
    setShowApp();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <UserImage name={user.name} />
        <div className={styles.userInfo}>
          <h1>{user.name}</h1>
          <p>{user.address}</p>
        </div>
      </header>

      <LicenceList />

      {/* <section className={styles.levelSection}>
        <h2>My Level</h2>
        <div className={styles.levelInfo}>
          <p>Clubmaster LEVEL {currentUser.level}</p>
          <p>CMP to spend: {currentUser.points}</p>
        </div>
        <ProgressBar value={currentUser.points} max={1000} />
        <p>251 CMP more to reach Level 2</p>
      </section>

      <BadgeSection /> */}

      <MenuSection />

      <button className={styles.chatbotButton}>CHATBOT & SERVICE</button>

      <section className={styles.membershipInfo}>
        <h2>My Cards and Discounts</h2>
        <div className={styles.levelInfo}>
          <p>Adidas - 10%</p>
          <p>Decathlon -30%</p>
        </div>
        <ProgressBar value={500} max={1000} />
        <p>1 month left to enjoy</p>
      </section>

      <button className={styles.logoutButton} onClick={handleLogout}>
        <SystemShut className='icon--detail__modal' />
        Deconnexion
      </button>
    </div>
  );
}

export default UserView;