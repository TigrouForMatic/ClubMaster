import React, { useMemo } from "react";
import styles from "../styles/ManageView.module.css";
import useStore from '../store/store';
import { getDisplayFormatedDate } from '../js/date';

function ManageView() {
  const { userClubs, currentUserRoles } = useStore();

  const filteredClubs = useMemo(() => {
    const highLevelClubIds = new Set(
      currentUserRoles
        .filter(role => role.level >= 3)
        .map(role => role.clubid)
    );

    return userClubs.filter(club => highLevelClubIds.has(club.id));
  }, [userClubs, currentUserRoles]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ManageView</h1>
      <ul>
        {filteredClubs.map(club => (
          <li key={club.id}>
            <strong>{club.label}</strong>
            {club.oldlabel && <span> (Ancien nom : {club.oldlabel})</span>}
            <br />
            <small>Créé le : {getDisplayFormatedDate(new Date(club.creationdate))}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageView;