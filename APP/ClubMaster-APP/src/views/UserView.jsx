import React from 'react';
import styles from '../styles/UserView.module.css';
import useStore from '../store/store';
import { SystemShut } from 'iconoir-react';

function UserView() {

  const setShowApp = useStore((state) => state.setShowApp);
  const setItems = useStore((state) => state.setItems);

  const currentUser = {
    name: 'Jules Chassany',
    memberId: 'C80002317',
    memberType: 'Comfort Member',
    country: 'France',
    points: 749,
    level: 1,
  };

  const handleEditProfile = () => {
    // Logique pour éditer le profil
    console.log("Éditer le profil");
  };

  const handleLogout = () => {
      localStorage.setItem('token', null);
      setItems('currentUser',null);
      setItems('login',null);
      setShowApp();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.profilePic}>
          <span>J</span>
        </div>
        <div className={styles.userInfo}>
          <h1>{currentUser.name}</h1>
          <p>{currentUser.country}</p>
        </div>
        <button className={styles.editButton} onClick={handleEditProfile}>Éditer</button>
      </header>

      {/* TODO : Faire une liste de licences --> Afficher un composant licence*/}
      <section className={styles.membershipInfo}>
        <h2>Mon/Mes licences</h2>

        <div className={styles.levelInfo}>
          <p>Role : Coach</p>
          <p>07 sept. 2023</p>
        </div>
        <progress value={900} max="1000"></progress>
        <p>Plus que 1 mois et 10 jours</p>

        <div className={styles.levelInfo}>
          <p>Role : Licencié</p>
          <p>07 sept. 2023</p>
        </div>
        <progress value={900} max="1000"></progress>
        <p>Plus que 1 mois et 10 jours</p>

      </section>

      <section className={styles.badgesSection}>
        <h2>Mon Niveau</h2>

        <div className={styles.levelInfo}>
          <p>Clubmaster LEVEL {currentUser.level}</p>
          <p>CMP à dépenser: {currentUser.points}</p>
        </div>
        <progress value={currentUser.points} max="1000"></progress>
        <p>Encore 251 CMP pour atteindre le Level 2</p>

        <h2>Mes Badges</h2>

        <div className={styles.levelInfo}>
            <div className={styles.badge}>
              <p>Cours</p>
              <p>3 cours / 5</p>
          </div>
          <div className={styles.badge}>
              <p>Rencontre</p>
              <p>7 rencontres / 7</p>
          </div>
          <div className={styles.badge}>
              <p>Tournoi</p>
              <p>1 tournois / 1</p>
          </div>
        </div>
      </section>

      <section className={styles.menuItems}>
        {/* Lorsque on clique, modale ou composant avec informations du club : Label, nb Adherents, Date de création et gallerie Photos ainsi que les membres du bureau et leur role respectif*/}
        <div className={styles.menuItem}>
          <h3>Clubs</h3>
          <span>→</span>
        </div>
        {/* Lorsque on clique, modale ou composant avec informations du moyen de paiement : possibilité d'ajouter un moyen de paiement ou modifier celui deja présent si existant*/}
        <div className={styles.menuItem}>
          <h3>Paiements</h3>
          <span>→</span>
        </div>
        {/* Lorsque on clique, modale ou composant avec informations personnelles : Nom, Prénoms, date de naissance, phone, Adresses :  Modifiable*/}
        <div className={styles.menuItem}>
          <h3>Mes données personnelles</h3>
          <span>→</span>
        </div>
        {/* Lorsque on clique, modale qui permet de partager l'applciation a un ami en echange de point/badge/réductions*/}
        <div className={styles.menuItem}>
          <h3>Inviter un(e) ami(e)</h3>
          {/* <span className={styles.premium}>Premium →</span> */}
          <span>→</span>
        </div>
      </section>

      <button className={styles.chatbotButton}>CHATBOT & SERVICE</button>

      <div className={styles.badgesSection}>
        <section className={styles.badgesSection}>
          <h2>Entrainement</h2>
          <div className={styles.badge}>
            <p>Mon premier entrainement</p>
            <p>0% completé</p>
          </div>
        </section>

        <section className={styles.badgesSection}>
          <h2>Dietetique</h2>
          <div className={styles.badge}>
            <p>5 Recettes pour manger plus sain</p>
          </div>
        </section>
      </div>

      <section className={styles.membershipInfo}>
        <h2>Mes Cartes et Réductions</h2>
        <div className={styles.levelInfo}>
          <p>Adidas - 10%</p>
          <p>Decathlon -30%</p>
        </div>
        <progress value={500} max="1000"></progress>
        <p>Plus que 1 mois pour en profiter</p>
      </section>

      <button className={styles.logoutButton} onClick={handleLogout}>
        <SystemShut className='icon--detail__modal' />
        Se déconnecter
      </button>

    </div>
  );
}

export default UserView;