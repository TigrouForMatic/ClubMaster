import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
        <div className="w-full max-w-3xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Annonces</h2>
                {currentRole && (
                    <button 
                        onClick={() => setIsModalInfoBannerOpen(true)}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        Créer une annonce
                    </button>
                )}
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow">
                {infoBanners.length === 1 ? (
                    <InfoBannerCard 
                        key={infoBanners[0].id} 
                        infoBanner={infoBanners[0]} 
                        onEdit={handleEditInfoBanner}
                    />
                ) : infoBanners.length > 1 && (
                    <Slider {...settings} className="rounded-lg overflow-hidden">
                        {infoBanners.map((infoBanner) => (
                            <InfoBannerCard 
                                key={infoBanner.id} 
                                infoBanner={infoBanner} 
                                onEdit={handleEditInfoBanner}
                            />
                        ))}
                    </Slider>
                )}
            </div>

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