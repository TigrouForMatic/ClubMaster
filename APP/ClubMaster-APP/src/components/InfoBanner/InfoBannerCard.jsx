import styles from '../../styles/InfoBannerCard.module.css';
import { useCallback } from 'react';
import { dateFormat } from '../../js/date';
import { EditPencil, Trash } from 'iconoir-react';
import useStore from '../../store/store';
import api from '../../js/App/Api';

const InfoBannerCard = ({ infoBanner, onEdit }) => {
    const { currentUserRoles, deleteItem } = useStore();
    const getDateDisplay = useCallback((date) => dateFormat(date), []);

    const currentRole = currentUserRoles.find(role => role.level >= 3 && role.clubid === infoBanner.clubid);
    
    const handleEdit = useCallback(() => {
        onEdit(infoBanner);
    }, [onEdit, infoBanner]);

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const response = await api.delete(`/infobanner/${infoBanner.id}`);
            deleteItem('infoBanners', response.id);
        } catch (error) {
          console.error('Erreur lors de la création/modification de l\'infoBanner:', error);
        }
      };

    return (
        <div className={styles.infoBannerCard} key={infoBanner.id}>
            {currentRole && (
                <>
                    <button className={styles.editButton} onClick={handleEdit}>
                        <EditPencil />
                    </button>
                    <button className={styles.deleteButton} onClick={handleDelete}>
                        <Trash />
                    </button>
                </>
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