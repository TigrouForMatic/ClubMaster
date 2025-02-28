import React, { useState, useRef } from "react";
import { dateFormat, dateToTimeFormat } from "../../js/date";
import ModalCreateEvent from "../Modale/ModalCreateEvent";
import useStore from "../../store/store";
import InfoEvent from "../Event/InfoEvent";
import Select from 'react-select';

const EventList = React.memo(({ clubId }) => {
    const [modaleCreate, setModaleCreate] = useState(false);
    const [infoEventOpen, setInfoEventOpen] = useState(false);
    const [infoEventId, setInfoEventId] = useState(null);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [timeFilter, setTimeFilter] = useState('all'); // 'past', 'current', 'all'
    const [searchLabel, setSearchLabel] = useState('');
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const tableRef = useRef(null);

    const { events = [], typesEvent = [] } = useStore();

    const handleOpenCreateModale = () => setModaleCreate(true);
    const handleCloseCreateModale = () => setModaleCreate(false);
    const handleOpenInfoEvent = (eventId) => {
        setInfoEventOpen(true);
        setInfoEventId(eventId);
    };
    const handleCloseInfoEvent = () => {
        setInfoEventOpen(false);
        setInfoEventId(null);
    };

    const filteredEventsTypes = typesEvent.filter(eventType => eventType.clubid === clubId);
    const filteredEvents = events.filter(event => {
        const matchesType = selectedTypes.length === 0 || 
            selectedTypes.includes(event.eventtypeid);
        
        const now = new Date();
        const eventStart = new Date(event.dd);
        const eventEnd = new Date(event.df);
        
        const matchesTime = timeFilter === 'all' ||
            (timeFilter === 'past' && eventEnd < now) ||
            (timeFilter === 'current' && eventStart <= now && eventEnd >= now) ||
            (timeFilter === 'future' && eventStart > now);

        const matchesLabel = event.label.toLowerCase().includes(searchLabel.toLowerCase());

        return filteredEventsTypes.some(type => type.id === event.eventtypeid) 
            && matchesType && matchesTime && matchesLabel;
    });

    const getEventType = (eventTypeId) => 
        filteredEventsTypes.find(type => type.id === eventTypeId);

    const getDataForSelectFromTypeEvent = React.useMemo(() => 
        filteredEventsTypes.map(type => ({
            value: type.id,
            label: type.label
        })),
    [filteredEventsTypes]);

    const handleTypeChange = (selectedOptions) => {
        setSelectedTypes(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    const handleTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe && tableRef.current) {
            tableRef.current.scrollLeft += 200;
        }
        if (isRightSwipe && tableRef.current) {
            tableRef.current.scrollLeft -= 200;
        }
    };

    return (
        <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold tracking-tight">Événements</h2>
                <button 
                    onClick={handleOpenCreateModale}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2"
                >
                    Ajouter
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="space-y-2">
                    <input
                        type="text"
                        placeholder="Rechercher"
                        value={searchLabel}
                        onChange={(e) => setSearchLabel(e.target.value)}
                        className="w-full pl-3 pr-4 py-1.5 bg-white rounded-md cursor-default react-select-container border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div className="space-y-2 relative z-20">
                    <Select
                        isMulti
                        name="types"
                        options={getDataForSelectFromTypeEvent}
                        onChange={handleTypeChange}
                        placeholder="Sélectionner les types"
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />
                </div>

                <div className="space-y-2 relative z-20">
                    <Select
                        value={{ 
                            value: timeFilter, 
                            label: {
                                'all': 'Tous les événements',
                                'current': 'En cours',
                                'future': 'À venir',
                                'past': 'Passés'
                            }[timeFilter]
                        }}
                        onChange={(option) => setTimeFilter(option.value)}
                        options={[
                            { value: 'all', label: 'Tous les événements' },
                            { value: 'current', label: 'En cours' },
                            { value: 'future', label: 'À venir' },
                            { value: 'past', label: 'Passés' }
                        ]}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        styles={{
                            singleValue: (base) => ({
                                ...base,
                                color: '#6B7280', // Couleur grise (gray-500)
                            })
                        }}
                    />
                </div>
            </div>

            <div 
                className="relative w-full overflow-y-auto overflow-x-hidden max-h-[600px] min-h-[600px] scrollbar-hide hide-scrollbar"
                ref={tableRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b sticky top-0 bg-white z-10">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nom</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Horaires</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Max. Participants</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {filteredEvents.map(event => (
                            <tr 
                                key={event.id} 
                                onClick={() => handleOpenInfoEvent(event.id)}
                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                            >
                                <td className="p-4 align-middle">{event.label}</td>
                                <td className="p-4 align-middle">{event.description}</td>
                                <td className="p-4 align-middle">{getEventType(event.eventtypeid)?.label}</td>
                                <td className="p-4 align-middle">{dateFormat(event.dd)}</td>
                                <td className="p-4 align-middle">
                                    {dateToTimeFormat(event.dd)} - {dateToTimeFormat(event.df)}
                                </td>
                                <td className="p-4 align-middle">
                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                                        {event.maxperson || "Illimité"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredEvents.length === 0 && (
                    <p className="text-center text-muted-foreground py-6">Aucun événement trouvé.</p>
                )}
            </div>

            <ModalCreateEvent isOpen={modaleCreate} onClose={handleCloseCreateModale} />
            {infoEventId && (
                <InfoEvent isOpen={infoEventOpen} onClose={handleCloseInfoEvent} eventId={infoEventId} />
            )}
        </div>
    );
});

export default EventList;