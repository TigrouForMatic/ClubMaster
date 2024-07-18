import React, { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/CalendarView.module.css";
import useStore from '../store/store';
import { dateToTimeFormat } from "../js/date";

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);

  const userClubs = useStore((state) => state.userClubs);
  const addresses = useStore((state) => state.addresses);
  const events = useStore((state) => state.events);
  const typeEvent = useStore((state) => state.typesEvent);

  const getDataForSelectFromTypeEvent = useMemo(() => {
    return typeEvent.map(type => ({ value: type.id, label: type.label }));
  }, [typeEvent]);

  const handleTypeChange = (selectedOptions) => {
    setSelectedTypes(selectedOptions.map(option => option.value));
  };

  const locationOptions = useMemo(() => {
    return [
      { value: 0, label: "Tous les lieux" },
      ...addresses.map(location => ({
        value: location.id,
        label: `${location.street}, ${location.postalcode} ${location.city}`
      }))
    ];
  }, [addresses]);

  const clubOptions = useMemo(() => {
    return [
      { value: 0, label: "Tous les clubs" },
      ...userClubs.map(club => ({
        value: club.id,
        label: club.label
      }))
    ];
  }, [userClubs]);

  const handleClubChange = (selectedOption) => {
    setSelectedClub(selectedOption);
  };

  const handleLocationChange = (selectedOption) => {
    setSelectedLocation(selectedOption);
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const eventsForDay = events.filter(e => {
        const eventDate = new Date(e.dd);
        return eventDate.getDate() === day && 
               eventDate.getMonth() === month && 
               eventDate.getFullYear() === year &&
               (!selectedTypes.length || selectedTypes.includes(e.eventtypeid)) &&
               (!selectedClub || selectedClub.value === 0 || e.clubid === selectedClub.value) &&
               (!selectedLocation || selectedLocation.value === 0 || e.addressid === selectedLocation.value);
      });

      days.push(
        <div key={day} className={styles.day}>
          <span className={styles.dayNumber}>{day}</span>
          {eventsForDay.map((e, index) => (
            <div 
              key={index} 
              className={styles.eventCard}
              style={{ backgroundColor: getEventColor(e.eventtypeid) }}
              onClick={() => handleEventClick(e)}
            >
              <div><strong>{e.label}</strong></div>
              <div>{getTimeDisplay(e.dd)} à {getTimeDisplay(e.df)}</div>
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  const getEventColor = (eventTypeId) => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33F1', '#33FFF1'];
    return colors[eventTypeId % colors.length];
  };

  const handleEventClick = (event) => {
    console.log('Informations de l\'événement :', event);
  };

  const getTimeDisplay = (date) => dateToTimeFormat(date);

  return (
    <div className={styles.calendarContainer}>
      <h1 className={styles.title}>Calendrier du Club</h1>

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
          <DatePicker
            selected={currentDate}
            onChange={date => setCurrentDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            className={styles.datePicker}
          />
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
          <div>Dim</div>
          <div>Lun</div>
          <div>Mar</div>
          <div>Mer</div>
          <div>Jeu</div>
          <div>Ven</div>
          <div>Sam</div>
        </div>
        <div className={styles.days}>
          {renderCalendar()}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;