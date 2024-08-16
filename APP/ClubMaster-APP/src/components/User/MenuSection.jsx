import React, { useState } from 'react';
import useStore from '../../store/store';
import styles from '../../styles/MenuSection.module.css';
import { getDisplayFormatedDate } from "../../js/date";

const MenuItem = ({ title, content, isOpen, toggleItem }) => (
  <div className={styles.menuItemWrapper}>
    <div className={styles.menuItem} onClick={toggleItem}>
      <h3>{title}</h3>
      <span className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`}>
        →
      </span>
    </div>
    {isOpen && <div className={styles.menuItemContent}>{content}</div>}
  </div>
);

const MenuSection = () => {
  const { currentUser, currentUserAddresses, userClubs } = useStore();
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  const menuItems = [
    {
      title: "Club(s)",
      content: (
        <ul>
          {userClubs.map((club, index) => (
            <li key={index}>
              <strong>{club.label}</strong>
              {club.oldlabel && <span> (Ancien nom : {club.oldlabel})</span>}
              <br />
              <small>Créé le : {getDisplayFormatedDate(new Date(club.creationdate))}</small>
            </li>
          ))}
        </ul>
      )
    },
    {
      title: "Paiements",
      content: (
        <div>
          <p>Liste des moyens de paiement :</p>
          {/* Ajoutez ici la liste des moyens de paiement */}
        </div>
      )
    },
    {
      title: "Informations Personnelles",
      content: (
        <div>
          <p><strong>Nom :</strong> {currentUser.name}</p>
          <p><strong>Date de naissance :</strong> {new Date(currentUser.naissancedate).toLocaleDateString()}</p>
          <p><strong>Téléphone :</strong> {currentUser.phonenumber}</p>
          <p><strong>Email :</strong> {currentUser.emailaddress}</p>
          <h4>Adresses :</h4>
          <ul>
            {currentUserAddresses.map((add, index) => (
              <li key={index}>
                {add.street}, {add.city}, {add.state} {add.postalcode}, {add.country}
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      title: "Inviter des amis",
      content: (
        <div>
          <p>Vous souhaitez inviter un ami ?</p>
          {/* Ajoutez ici un formulaire ou un bouton pour inviter des amis */}
        </div>
      )
    }
  ];

  return (
    <section className={styles.menuSection}>
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          title={item.title}
          content={item.content}
          isOpen={openItem === index}
          toggleItem={() => toggleItem(index)}
        />
      ))}
    </section>
  );
};

export default MenuSection;