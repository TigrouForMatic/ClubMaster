import { useCallback, useState } from 'react';
import { dateFormat } from '../../js/date';
import { EditPencil, Trash } from 'iconoir-react';
import useStore from '../../store/store';
import api from '../../js/App/Api';
import { getColorFromString } from '../../js/color';
import { getImageUrl } from '../../js/photo';

const InfoBannerCard = ({ infoBanner, onEdit, onEventClick }) => {
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
        <div 
            className="relative p-6 bg-card text-card-foreground rounded-lg transition-all min-h-[400px] w-full" 
            key={infoBanner.id}
            style={{ pointerEvents: 'none' }}
        >
            <div style={{ pointerEvents: 'auto' }}>
                {currentRole && (
                    <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
                        <button 
                            onClick={handleEdit}
                            className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors bg-white/80"
                        >
                            <EditPencil className="h-4 w-4 text-blue-500" />
                        </button>
                        <button 
                            onClick={handleDelete}
                            className="p-2 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors bg-white/80"
                        >
                            <Trash className="h-4 w-4 text-red-500" />
                        </button>
                    </div>
                )}

                <div className="flex flex-col h-full">
                    {infoBanner.photo ? (
                        <>
                            <div className="absolute inset-0 h-48 rounded-t-lg overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-[1]" />
                                <img 
                                src={getImageUrl(infoBanner.photo)}
                                alt={infoBanner.photo?.originalname || 'Banner image'}
                                className="object-cover w-full h-full"
                                crossOrigin="anonymous"
                                />
                            </div>
                            <div className="absolute -top-20 inset-0 flex items-center justify-center">
                                <div className="text-white text-2xl font-bold z-10 text-center p-2 bg-black/50 rounded-lg">
                                    {infoBanner.title.toUpperCase()}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="absolute inset-0 h-48 rounded-t-lg overflow-hidden">
                                <div 
                                    className="absolute inset-0" 
                                style={{
                                    background: `linear-gradient(135deg, ${getColorFromString(infoBanner.clublabel)}80, ${getColorFromString(infoBanner.clublabel)}20)`
                                    }}
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-b to-transparent z-[1]" />
                            <div className="absolute h-48 inset-0 flex items-center justify-center">
                                <div className="text-white text-2xl font-bold z-10 text-center p-2 bg-black/50 rounded-lg">
                                    {infoBanner.title.toUpperCase()}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex-grow mt-52 min-h-[70px] flex items-center justify-center">
                        <p className="text-muted-foreground text-center text-base mb-6">{infoBanner.description}</p>
                    </div>

                    <div className="relative h-12 bottom-0">
                        <div className="absolute left-4 bottom-0">
                            <span 
                                className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                                style={{
                                    backgroundColor: `${getColorFromString(infoBanner.clublabel)}20`,
                                    color: getColorFromString(infoBanner.clublabel),
                                    borderColor: `${getColorFromString(infoBanner.clublabel)}40`
                                }}
                            >
                                {infoBanner.clublabel}
                            </span>
                        </div>
                        
                        {infoBanner.event && (
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-0" style={{ pointerEvents: 'auto' }}>
                                <button
                                    onClick={() => onEventClick(infoBanner)}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    Voir l'événement →
                                </button>
                            </div>
                        )}
                        
                        <p className="absolute right-4 bottom-0 text-xs text-muted-foreground italic">
                            Créé par : {infoBanner.createdbyname} le {getDateDisplay(infoBanner.dd)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoBannerCard;