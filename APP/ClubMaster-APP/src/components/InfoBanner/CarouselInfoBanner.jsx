import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from '../../styles/InfoBannerCard.module.css';
import InfoBannerCard from './InfoBannerCard';
import useStore from '../../store/store';
import { useState } from 'react';
import ModaleInfoBanner from '../Modale/ModaleInfoBanner';

const CarouselInfoBanner = () => {

    const [isModalInfoBannerOpen, setIsModalInfoBannerOpen] = useState(false);
    const [selectedInfoBanner, setSelectedInfoBanner] = useState(null);

    const { infoBanners, currentUserRoles } = useStore();

    const currentRole = currentUserRoles.find(role => role.level >= 3);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000
    };

    const handleEditInfoBanner = (infoBanner) => {
        setSelectedInfoBanner(infoBanner);
        setIsModalInfoBannerOpen(true);
    };

  return (
    <div className={styles.carouselInfoBanner}>
        <div className={styles.headerCarouselInfoBanner}>
            <h2>Annonces</h2>
            {currentRole && (
                <button className={styles.createInfoBannerButton} onClick={() => setIsModalInfoBannerOpen(true)}>Créer une annonce</button>
            )}
        </div>
        {infoBanners.length === 1 && (
            <InfoBannerCard 
                key={infoBanners[0].id} 
                infoBanner={infoBanners[0]} 
                onEdit={handleEditInfoBanner}
            />
        )}
        {infoBanners.length > 1 && (
            <Slider {...settings}>
                {infoBanners.map((infoBanner) => (
                    <InfoBannerCard 
                        key={infoBanner.id} 
                        infoBanner={infoBanner} 
                        onEdit={handleEditInfoBanner}
                    />
                ))}
            </Slider>
        )}

        <ModaleInfoBanner 
            isOpen={isModalInfoBannerOpen} 
            onClose={() => {
                setIsModalInfoBannerOpen(false);
                setSelectedInfoBanner(null);
            }} 
            infoBanner={selectedInfoBanner}
        />
    </div>
  );
};

export default CarouselInfoBanner;