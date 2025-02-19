import { useCallback } from 'react';
import { dateFormat } from '../../js/date';
import { EditPencil, Trash } from 'iconoir-react';
import useStore from '../../store/store';
import api from '../../js/App/Api';
import { getColorFromString } from '../../js/color';

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
        <div className="relative p-6 bg-card text-card-foreground rounded-lg transition-all min-h-[200px] w-full" key={infoBanner.id}>
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
                {infoBanner.photo && (
                    <div className="absolute inset-0 h-48 rounded-t-lg overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent z-[1]" />
                        <img 
                            src={infoBanner.photo.url} 
                            alt={infoBanner.photo.originalname}
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}

                <div className={`flex-grow ${infoBanner.photo ? 'mt-40' : ''}`}>
                    <h2 className={`text-xl font-bold text-center mb-4 ${infoBanner.photo ? 'text-white relative z-[2]' : ''}`}>
                        {infoBanner.title}
                    </h2>
                    <p className="text-muted-foreground text-center text-base mb-6">{infoBanner.description}</p>
                </div>

                <div className="mt-auto">
                    <div className="absolute bottom-4 left-4">
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
                    
                    <p className="absolute bottom-4 right-4 text-xs text-muted-foreground italic">
                        Créé par : {infoBanner.createdbyname} le {getDateDisplay(infoBanner.dd)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InfoBannerCard;