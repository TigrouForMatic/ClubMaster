import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Home, ArcheryMatch, Calendar, Shop } from 'iconoir-react';
import styles from '../../styles/MenuBarMobile.module.css';

function MenuBarMobile() {
  return (
    <div className={styles.menuBar}>
      <div className={styles.menuItems}>
        <NavLink to="/" exact className={({ isActive }) => isActive ? styles.activeLink : ''}>
          <div className={styles.menuItem}>
            <Home className={styles.iconDetail} />
            <p>News</p>
          </div>
        </NavLink>
        <NavLink to="/match" className={({ isActive }) => isActive ? styles.activeLink : ''}>
          <div className={styles.menuItem}>
            <ArcheryMatch className={styles.iconDetail} />
            <p>Matchs</p>
          </div>
        </NavLink>
        <NavLink to="/calendar" className={({ isActive }) => isActive ? styles.activeLink : ''}>
          <div className={styles.menuItem}>
            <Calendar className={styles.iconDetail} />
            <p>Calendrier</p>
          </div>
        </NavLink>
        <NavLink to="/shop" className={({ isActive }) => isActive ? styles.activeLink : ''}>
          <div className={styles.menuItem}>
            <Shop className={styles.iconDetail} />
            <p>Shop</p>
          </div>
        </NavLink>
        <NavLink to="/user" className={({ isActive }) => isActive ? styles.activeLink : ''}>
          <div className={styles.menuItem}>
            <User className={styles.iconDetail} />
            <p>Profil</p>
          </div>
        </NavLink>
      </div>
    </div>
  );
}

export default MenuBarMobile;