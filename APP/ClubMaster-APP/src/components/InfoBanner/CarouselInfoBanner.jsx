import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from '../../styles/InfoBannerCard.module.css';
import InfoBannerCard from './InfoBannerCard';

const CarouselInfoBanner = ({ infoBanners }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };

  return (
    <div className={styles.carouselInfoBanner}>
        {infoBanners.length > 1 && (
            <Slider {...settings}>
                {infoBanners.map((infoBanner) => (
                <InfoBannerCard key={infoBanner.id} infoBanner={infoBanner} />
                ))}
            </Slider>
        )}
        {infoBanners.length === 1 && (
            <InfoBannerCard key={infoBanners[0].id} infoBanner={infoBanners[0]} />
        )}
    </div>
  );
};

export default CarouselInfoBanner;