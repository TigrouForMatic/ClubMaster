import React, { useState } from "react";
import { dateFormat, dateToTimeFormat } from "../../js/date";
import ModalCreateEvent from "../Modale/ModalCreateEvent";
import useStore from "../../store/store";
import InfoEvent from "../Event/InfoEvent";

const EventList = React.memo(({ clubId }) => {
    const [modaleCreate, setModaleCreate] = useState(false);
    const [infoEventOpen, setInfoEventOpen] = useState(false);
    const [infoEventId, setInfoEventId] = useState(null);

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
    const filteredEvents = events.filter(event => 
        filteredEventsTypes.some(type => type.id === event.eventtypeid)
    );

    const getEventType = (eventTypeId) => 
        filteredEventsTypes.find(type => type.id === eventTypeId);

    return (
        <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold tracking-tight">Événements</h2>
                <button 
                    onClick={handleOpenCreateModale}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-black text-white hover:bg-gray-800 h-10 px-4 py-2"
                >
                    Ajouter
                </button>
            </div>

            <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
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
            <InfoEvent isOpen={infoEventOpen} onClose={handleCloseInfoEvent} eventId={infoEventId} />
        </div>
    );
});

export default EventList;