import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/CalendarView.module.css";

const CalendarView = () => {
  const [typeEvent, setTypeEvent] = useState([]);
  const [event, setEvent] = useState([]);
  const [locations, setLocations] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: typeEventData }, { data: eventData }, { data: locationData }] = await Promise.all([
          axios.get("http://localhost:3200/eventType?clubid=1"),
          axios.get("http://localhost:3200/event"),
          axios.get("http://localhost:3200/address?private=false"),
        ]);

        setTypeEvent(typeEventData);

        const eventsDuClub = eventData.filter(event =>
          typeEventData.some(type => event.eventtypeid === type.id)
        );

        setEvent(eventsDuClub);

        let locationDataLabel = [];
        for(let location of locationData){
            let locationObj ={
                value : location.id,
                label: location.street + " , " + location.postalcode + " " + location.city
            }
            locationDataLabel.push(locationObj)
        }
        setLocations(locationDataLabel)
        
        // setLocations(locationData)
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, []);

  const getDataForSelectFromTypeEvent = useMemo(() => {
    return [
      { value: 0, label: "Tous" },
      ...typeEvent.map(type => ({ value: type.id, label: type.label }))
    ];
  }, [typeEvent]);

  const handleTypeChange = (selectedOptions) => {
    setSelectedTypes(selectedOptions.map(option => option.value));
  };

//   const locations = [
//     { value: 'loc1', label: 'Salle A' },
//     { value: 'loc2', label: 'Salle B' },
//     { value: 'loc3', label: 'Terrain extérieur' },
//   ];

  const teams = [
    { value: 'team1', label: 'Équipe 1' },
    { value: 'team2', label: 'Équipe 2' },
    { value: 'team3', label: 'Équipe 3' },
  ];

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
      const eventsForDay = event.filter(e => {
        const eventDate = new Date(e.dd);
        return eventDate.getDate() === day && 
               eventDate.getMonth() === month && 
               eventDate.getFullYear() === year &&
               (!selectedTypes.length || selectedTypes.includes(e.eventtypeid));
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
              {e.title}
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  const getEventColor = (eventTypeId) => {
    // Ici, vous pouvez définir une logique pour attribuer des couleurs en fonction du type d'événement
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33F1', '#33FFF1'];
    return colors[eventTypeId % colors.length];
  };

  const handleEventClick = (event) => {
    console.log('Informations de l\'événement :', event);
  };

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
            options={locations}
            className={styles.select}
            onChange={setSelectedLocation}
            placeholder="Sélectionner un lieu"
          />
        </div>

        <div className={styles.filterSection}>
          <h3>Équipe</h3>
          <Select
            options={teams}
            className={styles.select}
            onChange={setSelectedTeam}
            placeholder="Sélectionner une équipe"
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