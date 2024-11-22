import styles from '../../styles/InfoBannerCard.module.css';
import { useCallback } from 'react';
import { dateFormat } from '../../js/date';

const InfoBannerCard = ({ infoBanner }) => {

    const getDateDisplay = useCallback((date) => dateFormat(date), []);

  return (
    <div className={styles.infoBannerCard} key={infoBanner.id}>
        {/* <img src={infoBanner.headerimage} alt={infoBanner.title} /> */}
        <h2 className={styles.infoBannerTitle}>{infoBanner.title}</h2>
        <p className={styles.infoBannerDescription}>{infoBanner.description}</p>
        <p className={styles.infoBannerClubBadge}> {infoBanner.clublabel}</p>
        <p className={styles.infoBannerCreatedBy}>Créé par : {infoBanner.createdbyname} le {getDateDisplay(infoBanner.dd)}</p>
    </div>
  );
};

export default InfoBannerCard;