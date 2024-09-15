import React from "react";
import styles from "../../styles/ManageView.module.css";
import { EditPencil } from 'iconoir-react';

const EventTypeList = React.memo(({ types }) => (
  <div className={styles.section}>
    <div className={styles.sectionHeader}>
      <h2 className={styles.subtitle}>Types d'événements</h2>
      <button className={styles.addButton}>Ajouter</button>
    </div>
    <ul className={styles.list}>
      {types.map(type => (
        <li key={type.id}>
          {type.label}
          <button className={styles.editButton}><EditPencil /></button>
        </li>
      ))}
    </ul>
  </div>
));

export default EventTypeList;
