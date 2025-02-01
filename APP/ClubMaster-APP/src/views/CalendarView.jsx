import React, { useState, useMemo, useCallback, useRef } from "react";
import DatePicker from "react-datepicker";
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import useStore from '../store/store';
import { dateToTimeFormat } from "../js/date";
import { getColorFromString } from "../js/color";
import { Calendar, Plus } from 'iconoir-react';
import InfoEvent from '../components/Event/InfoEvent';
import ModalCreateEvent from '../components/Modale/ModalCreateEvent';
import ModalExportPlanning from '../components/Modale/ModaleExportPlanning';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentDateForCreate, setCurrentDateForCreate] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedTypesId, setSelectedTypesId] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({ value: 0, label: "Tous les lieux" });
  const [selectedClub, setSelectedClub] = useState({ value: 0, label: "Tous les clubs" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isOpenPlanningModal, setIsOpenPlanningModal] = useState(false);
  const calendarRef = useRef(null);

  
  const { userClubs, addresses,events, typesEvent, inscriptions, user, currentUserRoles } = useStore();
  const updateItems = useStore((state) => state.updateItems);

  const [eventStartIndices, setEventStartIndices] = useState({});

  const getDataForSelectFromTypeEvent = useMemo(() => 
    typesEvent.reduce((acc, type) => {
      const existingType = acc.find(t => t.label === type.label);
      if (existingType) {
        existingType.value.push(type.id);
      } else {
        acc.push({ value: [type.id], label: type.label });
      }
      return acc;
    }, []),
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
    const typesId = [];
    for (let option of selectedOptions) {
      for (let typeId of option.value) {
        typesId.push(typeId);
      }
    }
    setSelectedTypesId(typesId);
    setSelectedTypes(selectedOptions.map(option => option.value));
  }, []);

  const handleClubChange = useCallback((selectedOption) => {
    setSelectedClub(selectedOption);
  }, []);

  const handleLocationChange = useCallback((selectedOption) => {
    setSelectedLocation(selectedOption);
  }, []);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const getEventsForDate = useCallback((year, month, day) => {
    return events.filter(e => {
      if (!e || !e.dd) return false;
      const eventDate = new Date(e.dd);
      return eventDate.getDate() === day &&
             eventDate.getMonth() === month &&
             eventDate.getFullYear() === year &&
             (!selectedTypes.length || selectedTypesId.includes(e.eventtypeid)) &&
             (selectedLocation.value === 0 || e.addressid === selectedLocation.value) &&
             (selectedClub.value === 0 || selectedClub.value === typesEvent.find(type => type.id === e.eventtypeid).clubid);
    });
  }, [events, selectedTypes, selectedTypesId, selectedLocation, selectedClub, typesEvent]);

  const handleEventViewMore = useCallback((day, totalEvents) => {
    setEventStartIndices(prev => {
      const currentIndex = prev[day] || 0;
      const nextIndex = (currentIndex + 2) % totalEvents;
      return { ...prev, [day]: nextIndex };
    });
  }, []);

  const renderCalendar = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
    
    const days = [];
    
    // Ajout des jours du mois précédent
    for (let i = 0; i < firstDayOfMonth; i++) {
      const day = daysInPrevMonth - firstDayOfMonth + i + 1;
      const eventsForDay = getEventsForDate(prevYear, prevMonth, day);
      const startIndex = eventStartIndices[day] || 0;
      const visibleEvents = eventsForDay.slice(startIndex, startIndex + 2);

      days.push(
        <div key={`prev-${i}`} className="min-h-[130px] border border-gray-200 p-2 relative opacity-50 bg-gray-50">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-gray-400">{day}</span>
          </div>
          {visibleEvents.map((e, index) => (
            <div 
              key={index}
              className={`${
                inscriptions.find(inscription => inscription.eventid === e.id)
                  ? 'border-2 border-white shadow-sm'
                  : ''
              } p-1 rounded mb-1 cursor-pointer text-white text-sm overflow-hidden`}
              style={{ backgroundColor: getColorFromString(e.label) }}
              onClick={() => handleEventClick(e)}
            >
              <div className="font-semibold">{e.label}</div>
              <div className="text-xs">
                {e.dd !== e.df ? (
                  `${dateToTimeFormat(e.dd)} à ${dateToTimeFormat(e.df)}`
                ) : (
                  dateToTimeFormat(e.dd)
                )}
              </div>
            </div>
          ))}
          {eventsForDay.length > 2 && (
            <button 
              className="w-full text-center text-sm text-gray-600 hover:bg-gray-100 rounded py-1 mt-1"
              onClick={() => handleEventViewMore(day, eventsForDay.length)}
            >
              +{eventsForDay.length - 2} autres
            </button>
          )}
        </div>
      );
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const eventsForDay = getEventsForDate(year, month, day);
      const startIndex = eventStartIndices[day] || 0;
      const visibleEvents = eventsForDay.slice(startIndex, startIndex + 2);

      days.push(
        <div key={day} className="min-h-[130px] border border-gray-200 p-2 relative">
          <div 
            className="flex justify-between items-center mb-1 cursor-pointer hover:bg-gray-50 rounded"
            onClick={() => openCreateModal(new Date(year, month, day))}
          >
            <span className="font-semibold text-gray-700">{day}</span>
          </div>
          {visibleEvents.map((e, index) => (
            <div 
              key={index}
              className={`${
                inscriptions.find(inscription => inscription.eventid === e.id)
                  ? 'border-2 border-white shadow-sm'
                  : ''
              } p-1 rounded mb-1 cursor-pointer text-white text-sm overflow-hidden`}
              style={{ backgroundColor: getColorFromString(e.label) }}
              onClick={() => handleEventClick(e)}
            >
              <div className="font-semibold">{e.label}</div>
              <div className="text-xs">
                {e.dd !== e.df ? (
                  `${dateToTimeFormat(e.dd)} à ${dateToTimeFormat(e.df)}`
                ) : (
                  dateToTimeFormat(e.dd)
                )}
              </div>
            </div>
          ))}
          {eventsForDay.length > 2 && (
            <button 
              className="w-full text-center text-sm text-gray-600 hover:bg-gray-100 rounded py-1 mt-1"
              onClick={() => handleEventViewMore(day, eventsForDay.length)}
            >
              +{eventsForDay.length - 2} autres
            </button>
          )}
        </div>
      );
    }

    // Calcul du nombre exact de jours nécessaires pour compléter la dernière ligne
    const totalDays = firstDayOfMonth + daysInMonth;
    const remainingDays = 7 - (totalDays % 7);
    const remainingDaysToAdd = remainingDays === 7 ? 0 : remainingDays;
    
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    
    // Ajout des jours du mois suivant uniquement pour compléter la dernière ligne
    for (let i = 1; i <= remainingDaysToAdd; i++) {
      const eventsForDay = getEventsForDate(nextYear, nextMonth, i);
      const startIndex = eventStartIndices[i] || 0;
      const visibleEvents = eventsForDay.slice(startIndex, startIndex + 2);

      days.push(
        <div key={`next-${i}`} className="min-h-[130px] border border-gray-200 p-2 relative opacity-50 bg-gray-50">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-gray-400">{i}</span>
          </div>
          {visibleEvents.map((e, index) => (
            <div 
              key={index}
              className={`${
                inscriptions.find(inscription => inscription.eventid === e.id)
                  ? 'border-2 border-white shadow-sm'
                  : ''
              } p-1 rounded mb-1 cursor-pointer text-white text-sm overflow-hidden`}
              style={{ backgroundColor: getColorFromString(e.label) }}
              onClick={() => handleEventClick(e)}
            >
              <div className="font-semibold">{e.label}</div>
              <div className="text-xs">
                {e.dd !== e.df ? (
                  `${dateToTimeFormat(e.dd)} à ${dateToTimeFormat(e.df)}`
                ) : (
                  dateToTimeFormat(e.dd)
                )}
              </div>
            </div>
          ))}
          {eventsForDay.length > 2 && (
            <button 
              className="w-full text-center text-sm text-gray-600 hover:bg-gray-100 rounded py-1 mt-1"
              onClick={() => handleEventViewMore(i, eventsForDay.length)}
            >
              +{eventsForDay.length - 2} autres
            </button>
          )}
        </div>
      );
    }

    return days;
  }, [currentDate, events, inscriptions, eventStartIndices, getEventsForDate]);

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

  const openCreateModal = useCallback((date) => {
    if (currentUserRoles.some(role => role.level >= 3)) { 
      
      if(date && (typeof date === 'string' || date instanceof Date)) {
        const dateForCreate = new Date(date);
        dateForCreate.setDate(dateForCreate.getDate() + 1);
        setCurrentDateForCreate(dateForCreate);
      }

      setIsCreateModalOpen(true);
    }
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
    setCurrentDateForCreate(null);
  }, []);

  const openPlanningModal = useCallback(() => {
    setIsOpenPlanningModal(true);
  }, []);

  const closePlanningModal = useCallback(() => {
    setIsOpenPlanningModal(false);
  }, []);

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

    if (isLeftSwipe) {
      const nextMonth = new Date(currentDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setCurrentDate(nextMonth);
    }
    
    if (isRightSwipe) {
      const prevMonth = new Date(currentDate);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      setCurrentDate(prevMonth);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl pb-24">
      <div className="space-y-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
            Calendrier
          </h1>
          {currentUserRoles.some(role => role.level >= 3) ? (
            <p className="mt-3 text-lg text-gray-600 max-w-2xl text-center">
              Consultez et gérez tous les événements
            </p>
          ) : (
            <p className="mt-3 text-lg text-gray-600 max-w-2xl text-center">
              Consultez tous les événements
            </p>
          )}
        </div>

        <div className="flex justify-end gap-4 mb-4">
          {currentUserRoles.some(role => role.level >= 3) && (
            <button 
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Événement
            </button>
          )}
          <button 
            onClick={openPlanningModal}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Exporter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Type d'événement</h3>
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

          <div>
            <h3 className="font-semibold text-gray-700">Mois</h3>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
              <DatePicker
                selected={currentDate}
                onChange={setCurrentDate}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                className="w-full pl-10 pr-4 py-1.5 bg-white rounded-md cursor-default react-select-container"
                calendarClassName="react-select-container"
                wrapperClassName="react-select-container"
                popperClassName="react-select-container"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Lieu</h3>
            <Select
              options={locationOptions}
              onChange={handleLocationChange}
              placeholder="Sélectionner un lieu"
              value={selectedLocation}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Club</h3>
            <Select
              options={clubOptions}
              onChange={handleClubChange}
              placeholder="Sélectionner un club"
              value={selectedClub}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
        </div>

        <div 
          className="bg-white rounded-lg shadow-md overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          ref={calendarRef}
        >
          <div className="grid grid-cols-7 bg-gray-50 border-b">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
              <div key={day} className="py-2 text-center font-semibold text-gray-600">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {renderCalendar()}
          </div>
        </div>
      </div>

      {selectedEvent && (
        <InfoEvent isOpen={isModalOpen} onClose={closeModal} eventId={selectedEvent.id} />
      )}
      <ModalCreateEvent isOpen={isCreateModalOpen} onClose={closeCreateModal} date={currentDateForCreate} />
      <ModalExportPlanning isOpen={isOpenPlanningModal} onClose={closePlanningModal} />
    </div>
  );
};

export default CalendarView;
