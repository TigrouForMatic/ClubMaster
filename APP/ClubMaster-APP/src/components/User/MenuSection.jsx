import React from 'react';
import styles from '../../styles/MenuSection.module.css';

const MenuSection = () => {
  const menuItems = [
    { title: 'Clubs', premium: false },
    { title: 'Payments', premium: false },
    { title: 'My Personal Data', premium: false },
    { title: 'Invite a Friend', premium: true }
  ];

  return (
    <section className={styles.menuSection}>
      {menuItems.map((item, index) => (
        <div key={index} className={styles.menuItem}>
          <h3>{item.title}</h3>
          <span className={item.premium ? styles.premium : ''}>→</span>
        </div>
      ))}
    </section>
  );
};

export default MenuSection;