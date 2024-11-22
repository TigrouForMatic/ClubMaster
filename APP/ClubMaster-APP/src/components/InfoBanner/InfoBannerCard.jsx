import styles from '../../styles/InfoBannerCard.module.css';
import { useCallback, useState } from 'react';
import { dateFormat } from '../../js/date';
import { EditPencil } from 'iconoir-react';
import useStore from '../../store/store';
import ModaleInfoBanner from '../Modale/ModaleInfoBanner';

const InfoBannerCard = ({ infoBanner }) => {
    const { currentUserRoles } = useStore();
    const getDateDisplay = useCallback((date) => dateFormat(date), []);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const currentRole = currentUserRoles.find(role => role.level >= 3 && role.clubid === infoBanner.clubid);
    
    const handleEdit = useCallback(() => {
        setIsModalOpen(true);
    }, []);
    
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    return (
        <>
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

            <ModaleInfoBanner isOpen={isModalOpen} onClose={closeModal} infoBanner={infoBanner}/>
        </>
    );
};

export default InfoBannerCard;