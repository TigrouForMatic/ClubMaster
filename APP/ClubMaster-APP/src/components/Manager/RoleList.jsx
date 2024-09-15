import React from "react";
import styles from "../../styles/ManageView.module.css";
import { EditPencil } from 'iconoir-react';

const RoleList = React.memo(({ roles }) => (
  <div className={styles.section}>
    <div className={styles.sectionHeader}>
      <h2 className={styles.subtitle}>Rôles</h2>
      <button className={styles.addButton}>Ajouter</button>
    </div>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Label</th>
          <th>Niveau</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {roles.map(role => (
          <tr key={role.id}>
            <td>{role.label}</td>
            <td>{role.level}</td>
            <td>
              <button className={styles.editButton}><EditPencil /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

export default RoleList;
