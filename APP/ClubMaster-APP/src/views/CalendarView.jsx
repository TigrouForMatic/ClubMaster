import React, { useState, useMemo, useCallback } from "react";
import DatePicker from "react-datepicker";
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/CalendarView.module.css";
import useStore from '../store/store';
import { dateToTimeFormat } from "../js/date";
import { getColorFromString } from "../js/color";
import { Calendar } from 'iconoir-react';
import InfoEvent from '../components/Event/InfoEvent';
import ModalCreateEvent from '../components/Modale/ModalCreateEvent';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({ value: 0, label: "Tous les lieux" });
  const [selectedClub, setSelectedClub] = useState({ value: 0, label: "Tous les clubs" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { userClubs, addresses,events, typesEvent, inscriptions, user, currentUserRoles } = useStore();
  const updateItems = useStore((state) => state.updateItems);

  const getDataForSelectFromTypeEvent = useMemo(() => 
    typesEvent.map(type => ({ value: type.id, label: type.label })),
  [typesEvent]);

  const locationOptions = useMemo(() => [
    { value: 0, label: "Tous les lieux" },
    ...addresses.map(location => ({
      value: location.id,
      label: `${location.street}, ${location.postalcode} ${location.city}`
    }))
  ], [addresses]);

  const clubOptions = useMemo(() => 
    userClubs.length === 1
      ? [{ value: userClubs[0].id, label: userClubs[0].label }]
      : [
          { value: 0, label: "Tous les clubs" },
          ...userClubs.map(club => ({
            value: club.id,
            label: club.label
          }))
        ],
  [userClubs]);

  const handleTypeChange = useCallback((selectedOptions) => {
    setSelectedTypes(selectedOptions.map(option => option.value));
  }, []);

  const handleClubChange = useCallback((selectedOption) => {
    setSelectedClub(selectedOption);
  }, []);

  const handleLocationChange = useCallback((selectedOption) => {
    setSelectedLocation(selectedOption);
  }, []);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const filteredEvents = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return events.filter(e => {
      if (!e || !e.dd) return false;
      const eventDate = new Date(e.dd);
      return eventDate.getMonth() === month && 
             eventDate.getFullYear() === year &&
             (!selectedTypes.length || selectedTypes.includes(e.eventtypeid)) &&
             (selectedLocation.value === 0 || e.id === addresses.find(add => add.id === selectedLocation.value)?.referenceid) &&
             (selectedClub.value === 0 || e.clubid === selectedClub.value);
    });
  }, [events, currentDate, selectedTypes, selectedLocation, selectedClub, addresses]);

  const renderCalendar = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const eventsForDay = filteredEvents.filter(e => new Date(e.dd).getDate() === day);

      days.push(
        <div key={day} className={styles.day}>
          <span className={styles.dayNumber}>{day}</span>
          {eventsForDay.map((e, index) => (
            <div 
              key={index} 
              className={styles.eventCard}
              style={{ backgroundColor: getColorFromString(e.label) }}
              onClick={() => handleEventClick(e)}
            >
              <div><strong>{e.label}</strong></div>
              {e.dd != e.df && (
                <div>{dateToTimeFormat(e.dd)} à {dateToTimeFormat(e.df)}</div>
              )}
              {e.dd == e.df && (
                <div>{dateToTimeFormat(e.dd)}</div>
                )
              }
            </div>
          ))}
        </div>
      );
    }

    return days;
  }, [currentDate, filteredEvents]);

  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    // Rafraîchissement des événements
    updateItems('events', events);
    setIsModalOpen(false);
    setSelectedEvent(null);
  }, []);

  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  return (
    <div className={styles.calendarContainer}>
      <h1 className={styles.title}>Calendrier</h1>

      {currentUserRoles.some(role => role.level >= 3) && (
        <button onClick={openCreateModal} className={styles.addEventButton}>
          Ajouter un nouvel événement
        </button>
      )}

      <div className={styles.filters}>
        <div className={styles.filterSection}>
          <h3>Type d'événement</h3>
          <Select
            isMulti
            name="types"
            options={getDataForSelectFromTypeEvent}
            className={styles.select}
            onChange={handleTypeChange}
            placeholder="Sélectionner les types"
          />
        </div>

        <div className={styles.filterSection}>
          <h3>Mois</h3>
          <div className={styles.datePickerWrapper}>
            <Calendar className={styles.iconDetail} />
            <DatePicker
              selected={currentDate}
              onChange={setCurrentDate}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className={styles.datePicker}
            />
          </div>
        </div>

        <div className={styles.filterSection}>
          <h3>Lieu</h3>
          <Select
            options={locationOptions}
            className={styles.select}
            onChange={handleLocationChange}
            placeholder="Sélectionner un lieu"
            value={selectedLocation}
          />
        </div>

        <div className={styles.filterSection}>
          <h3>Club</h3>
          <Select
            options={clubOptions}
            className={styles.select}
            onChange={handleClubChange}
            placeholder="Sélectionner un club"
            value={selectedClub}
          />
        </div>
      </div>

      <div className={styles.monthlyCalendar}>
        <div className={styles.weekdays}>
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className={styles.days}>
          {renderCalendar()}
        </div>
      </div>
      
      {selectedEvent && (
        <InfoEvent isOpen={isModalOpen} onClose={closeModal} eventId={selectedEvent.id} />
      )}
      <ModalCreateEvent isOpen={isCreateModalOpen} onClose={closeCreateModal} />
    </div>
  );
};

export default CalendarView;
