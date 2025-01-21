import React, { useState, useEffect } from "react";
import styles from "../../styles/ManageView.module.css";
import { dateFormat, dateToTimeFormat } from "../../js/date";
import ModalCreateEvent from "../Modale/ModalCreateEvent";
import useStore from "../../store/store";
import InfoEvent from "../Event/InfoEvent";

const EventList = React.memo(({ clubId }) => {
    const [modaleCreate, setModaleCreate] = useState(false);
    const [infoEventOpen, setInfoEventOpen] = useState(false);
    const [infoEventId, setInfoEventId] = useState(null);

    const { events = [], typesEvent = [] } = useStore();

    const handleOpenCreateModale = () => {
        setModaleCreate(true);
    }

    const handleCloseCreateModale = () => {
        setModaleCreate(false);
    }

    const handleOpenInfoEvent = (eventId) => {
        setInfoEventOpen(true);
        setInfoEventId(eventId);
    }

    const handleCloseInfoEvent = () => {
        setInfoEventOpen(false);
        setInfoEventId(null);
    }

    const filteredEventsTypes = typesEvent.filter(eventType => eventType.clubid === clubId);
    const filteredEvents = events.filter(event => filteredEventsTypes.some(type => type.id === event.eventtypeid));

    const getEventType = (eventTypeId) => {
        return filteredEventsTypes.find(type => type.id === eventTypeId);
    }

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.subtitle}>Événements</h2>
                <button className={styles.addButton} onClick={handleOpenCreateModale}>Ajouter</button>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Horaires</th>
                        <th>Max. Participants</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEvents.map(event => (
                        <tr key={event.id} onClick={() => handleOpenInfoEvent(event.id)}>
                            <td>{event.label}</td>
                            <td>{event.description}</td>
                            <td>{getEventType(event.eventtypeid)?.label}</td>
                            <td>{dateFormat(event.dd)}</td>
                            <td>
                                {dateToTimeFormat(event.dd)} - {dateToTimeFormat(event.df)}
                            </td>
                            <td>{event.maxperson || "Illimité"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ModalCreateEvent isOpen={modaleCreate} onClose={handleCloseCreateModale} />

            <InfoEvent isOpen={infoEventOpen} onClose={handleCloseInfoEvent} eventId={infoEventId} />
        </div>
    );
});

export default EventList;