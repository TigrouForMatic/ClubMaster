import styles from '../../styles/InfoBannerCard.module.css';
import { useCallback } from 'react';
import { dateFormat } from '../../js/date';
import { EditPencil } from 'iconoir-react';
import useStore from '../../store/store';

const InfoBannerCard = ({ infoBanner, onEdit }) => {
    const { currentUserRoles } = useStore();
    const getDateDisplay = useCallback((date) => dateFormat(date), []);

    const currentRole = currentUserRoles.find(role => role.level >= 3 && role.clubid === infoBanner.clubid);
    
    const handleEdit = useCallback(() => {
        onEdit(infoBanner);
    }, [onEdit, infoBanner]);

    return (
        <div className={styles.infoBannerCard} key={infoBanner.id}>
            {currentRole && (
                <button className={styles.editButton} onClick={handleEdit}>
                    <EditPencil />
                </button>
            )}

            {/* <div className={styles.infoBannerImage}>
                <img src={infoBanner.headerimage} alt={infoBanner.title} />
            </div> */}
            <h2 className={styles.infoBannerTitle}>{infoBanner.title}</h2>
            <p className={styles.infoBannerDescription}>{infoBanner.description}</p>
            <p className={styles.infoBannerClubBadge}> {infoBanner.clublabel}</p>
            <p className={styles.infoBannerCreatedBy}>Créé par : {infoBanner.createdbyname} le {getDateDisplay(infoBanner.dd)}</p>
        </div>
    );
};

export default InfoBannerCard;