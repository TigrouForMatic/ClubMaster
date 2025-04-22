import React, { useState, useMemo, useEffect } from 'react';
import Modal from 'react-modal';
import api from '../../js/App/Api';
import useStore from '../../store/store';
import { dateFormat } from '../../js/date';
import Select from 'react-select';

const RECURRENCE_OPTIONS = [
  { value: 'weekly', label: 'Toutes les semaines' },
  { value: '2weeks', label: 'Toutes les 2 semaines' },
  { value: 'monthly', label: 'Tous les mois' },
  { value: 'quarterly', label: 'Tous les trimestres' },
  { value: 'biannual', label: 'Tous les 6 mois' },
  { value: 'yearly', label: 'Tous les ans' }
];

const DURATION_OPTIONS = [
  { value: 'week', label: 'Pendant une semaine' },
  { value: '2weeks', label: 'Pendant 2 semaines' },
  { value: 'month', label: 'Pendant 1 mois' },
  { value: 'quarter', label: 'Pendant 1 trimestre' },
  { value: 'biannual', label: 'Pendant 6 mois' },
  { value: 'year', label: 'Pendant 1 an' }
];

const RECURRENCE_UNITS = [
  { value: 'days', label: 'jours' },
  { value: 'weeks', label: 'semaines' },
  { value: 'months', label: 'mois' }
];

function ModalCreateEvent({ isOpen, onClose, date }) {
  const { currentUserRoles, userClubs, addresses, typesEvent, events } = useStore();
  const addItem = useStore((state) => state.addItem);
  const addItems = useStore((state) => state.addItems);
  const [selectedClubId, setSelectedClubId] = useState(userClubs[0].id);
  const [hasMaxPerson, setHasMaxPerson] = useState(false);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [recurrenceUnit, setRecurrenceUnit] = useState('jours');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isMatch, setIsMatch] = useState(false);
  const [error, setError] = useState('');

  const [eventData, setEventData] = useState({
    Label: '',
    Description: '',
    EventTypeId: null,
    Dd: null,
    Df: null,
    AddressId: null,
    MaxPerson: null
  });

  const [recurrenceData, setRecurrenceData] = useState({
    isEnabled: false,
    isCustomConfig: false,
    option: RECURRENCE_OPTIONS[0].value,
    duration: DURATION_OPTIONS[0].value,
    interval: 1,
    unit: RECURRENCE_UNITS[0].value,
    endDate: ''
  });

  useEffect(() => {
    if(date) {
      setStartDate(date.toISOString().split('T')[0]);
    }
  }, [date]);

  const filteredClubs = useMemo(() => {
    const highLevelClubIds = new Set(
      currentUserRoles
        .filter(role => role.level >= 3)
        .map(role => role.clubid)
    );

    return userClubs.filter(club => highLevelClubIds.has(club.id));
  }, [userClubs, currentUserRoles]);

  const filteredTypes = useMemo(() => {
    return typesEvent.filter(type => selectedClubId ? type.clubid === selectedClubId : true);
  }, [typesEvent, selectedClubId]);

  const handleClubSelect = (clubId) => {
    setSelectedClubId(clubId);
  };

  // Modifier le handleChange pour les nouveaux champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'startTime') {
      setStartTime(value);
    } else if (name === 'endTime') {
      setEndTime(value);
    } else {
      setEventData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleRecurrenceChange = (field, value) => {
    setRecurrenceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getRecurrenceConfig = () => {
    if (!recurrenceData.isEnabled) return null;

    if (recurrenceData.isCustomConfig) {
      return {
        interval: parseInt(recurrenceData.interval),
        unit: recurrenceData.unit,
        endDate: recurrenceData.endDate
      };
    }

    // Configuration automatique basée sur l'option sélectionnée
    let interval = 1;
    let unit = 'weeks';
    const endDate = new Date(startDate);

    // Configuration de l'intervalle et de l'unité
    switch (recurrenceData.option) {
      case 'weekly':
        interval = 1;
        unit = 'weeks';
        break;
      case '2weeks':
        interval = 2;
        unit = 'weeks';
        break;
      case 'monthly':
        interval = 1;
        unit = 'months';
        break;
      case 'quarterly':
        interval = 3;
        unit = 'months';
        break;
      case 'biannual':
        interval = 6;
        unit = 'months';
        break;
      case 'yearly':
        interval = 1;
        unit = 'years';
        break;
    }

    // Configuration de la date de fin selon la durée choisie
    switch (recurrenceData.duration) {
      case 'week':
        endDate.setDate(endDate.getDate() + 7);
        break;
      case '2weeks':
        endDate.setDate(endDate.getDate() + 14);
        break;
      case 'month':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'quarter':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'biannual':
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      case 'year':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }

    return {
      interval: interval,
      unit: unit,
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Réinitialiser l'erreur
    try {
      const date = startDate || new Date().toISOString().split('T')[0];
      const finalEventData = {
        ...eventData,
        Dd: new Date(`${date}T${startTime}`).toISOString(),
        Df: new Date(`${date}T${endTime === '' ? startTime : endTime}`).toISOString(),
        IsMatch : isMatch,
        Recurrence: getRecurrenceConfig()
      };

      const response = await api.post('/event', finalEventData);

      if (Array.isArray(response) && response.length > 0) {
        addItems('events', response);
        const eventIds = response.map(event => event.id);
        try {
          const responseConversations = await api.post('/conversation', { eventIds: eventIds });
          addItems('conversations', responseConversations);
        } catch (error) {
          console.error('Erreur lors de la création des conversations:', error);
        }
      } else if (response && typeof response === 'object') {
        addItem('events', response);
        try {
          const responseConversations = await api.post('/conversation', { eventId: response.id });
          addItem('conversations', responseConversations);
        } catch (error) {
          console.error('Erreur lors de la création des conversations:', error);
        }
      }
      handleClose();
    } catch (error) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        console.error('Erreur lors de la création de l\'événement:', error);
        setError('Une erreur est survenue lors de la création de l\'événement');
      }
    }
  };

  const handleClose = () => {
    // Reset the form
    setEventData({
      Label: '',
      Description: '',
      EventTypeId: null,
      Dd: null,
      Df: null,
      AddressId: null,
      MaxPerson: null,
    });
    setStartDate('');
    setStartTime('');
    setEndTime('');
    setIsMatch(false);
    setHasMaxPerson(false);
    setRecurrenceEndDate('');
    setRecurrenceInterval(1);
    setRecurrenceUnit('jours');
    setError('');
    setRecurrenceData({
      isEnabled: false,
      isCustomConfig: false,
      option: RECURRENCE_OPTIONS[0].value,
      duration: DURATION_OPTIONS[0].value,
      interval: 1,
      unit: RECURRENCE_UNITS[0].value,
      endDate: ''
    });
    onClose();
  };

  const eventTypeSorted = filteredTypes.sort((a, b) => a.label.localeCompare(b.label));

  const handleToggleMaxPerson = () => {
    setHasMaxPerson(!hasMaxPerson);
    if (!hasMaxPerson) {
      setEventData(prevData => ({ ...prevData, MaxPerson: null }));
    }
  };

  const getRecurrenceResume = () => {
    if (!recurrenceEndDate) {
      return '';
    }
    const endDate = dateFormat(recurrenceEndDate);
    const dayOfWeek = new Date(recurrenceEndDate).toLocaleDateString('fr-FR', { weekday: 'long' });
    const displayEndDate = `${dayOfWeek} ${endDate}`;
    if (recurrenceUnit === 'jours') {
      if (recurrenceInterval === 1) {
        return `Tous les jours jusqu'au ${displayEndDate}`;
      } else {
        return `Tous les ${recurrenceInterval} jours jusqu'au ${displayEndDate}`;
      }
    } else if (recurrenceUnit === 'semaines') {
      if (recurrenceInterval === 1) {
        return `Tous les semaines jusqu'au ${displayEndDate}`;
      } else {
        return `Tous les ${recurrenceInterval} semaines jusqu'au ${displayEndDate}`;
      }
    } else if (recurrenceUnit === 'mois') {
      if (recurrenceInterval === 1) {
        return `Tous les mois jusqu'au ${displayEndDate}`;
      } else {
        return `Tous les ${recurrenceInterval} mois jusqu'au ${displayEndDate}`;
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto mt-10 max-h-[90vh] overflow-y-auto scrollbar-hide"
      overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-start justify-center"
    >
      <div className="p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Créer un nouvel événement
          </h2>
          <button 
            onClick={handleClose}
            className="text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {filteredClubs.length > 1 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Clubs</h3>
            <div className="flex flex-wrap gap-2">
              {filteredClubs.map(club => (
                <button
                  key={club.id}
                  onClick={() => handleClubSelect(club.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${selectedClubId === club.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                    }`}
                >
                  {club.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="EventTypeId" className="text-sm font-medium">
              Type d'événement
            </label>
            <select
              id="EventTypeId"
              name="EventTypeId"
              value={eventData.EventTypeId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm"
            >
              <option value="">Sélectionnez un type d'événement</option>
              {eventTypeSorted.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="Label" className="text-sm font-medium">
              Nom de l'événement
            </label>
            <input
              type="text"
              id="Label"
              name="Label"
              value={eventData.Label}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="Description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="Description"
              name="Description"
              value={eventData.Description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="AddressId" className="text-sm font-medium">
              Adresse
            </label>
            <select
              id="AddressId"
              name="AddressId"
              value={eventData.AddressId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm"
            >
              <option value="">Sélectionnez une adresse</option>
              {addresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {`${address.street}, ${address.postalcode} ${address.city}`}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-b py-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={startDate || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toLocaleDateString('fr-CA')}
                  required
                  className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Horaires</label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    name="startTime"
                    value={startTime}
                    onChange={handleChange}
                    required
                    className="flex-1 px-3 py-2 border rounded-md border-input bg-background text-sm"
                  />
                  <span className="text-sm text-zinc-500">à</span>
                  <input
                    type="time"
                    name="endTime"
                    value={endTime}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 border rounded-md border-input bg-background text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isMatch}
                onChange={() => setIsMatch(!isMatch)}
                className="w-4 h-4 rounded border-zinc-300"
              />
              <span className="text-sm font-medium">Es ce que il s'agit d'un match ?</span>
            </label>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={recurrenceData.isEnabled}
                onChange={(e) => handleRecurrenceChange('isEnabled', e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300"
              />
              <span className="text-sm font-medium">Événement récurrent</span>
            </label>

            {recurrenceData.isEnabled && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-sm font-medium">Configuration :</span>
                  <div className="relative inline-flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={recurrenceData.isCustomConfig}
                        onChange={(e) => handleRecurrenceChange('isCustomConfig', e.target.checked)}
                        className="sr-only peer"
                        id="customConfig"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 cursor-pointer"></div>
                      <span className="ml-2 text-sm font-medium">
                        {recurrenceData.isCustomConfig ? 'Personnalisée' : 'Commune'}
                      </span>
                    </label>
                  </div>
                </div>

                {!recurrenceData.isCustomConfig ? (
                  <div className="flex gap-4 ml-6">
                    <Select
                      value={RECURRENCE_OPTIONS.find(opt => opt.value === recurrenceData.option)}
                      onChange={(opt) => handleRecurrenceChange('option', opt.value)}
                      options={RECURRENCE_OPTIONS}
                      className="flex-1"
                      placeholder="Fréquence"
                    />
                    <Select
                      value={DURATION_OPTIONS.find(opt => opt.value === recurrenceData.duration)}
                      onChange={(opt) => handleRecurrenceChange('duration', opt.value)}
                      options={DURATION_OPTIONS}
                      className="flex-1"
                      placeholder="Durée"
                    />
                  </div>
                ) : (
                  <div className="ml-6 space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-sm font-medium">Répéter tous les</label>
                        <div className="flex gap-2 mt-1">
                          <input
                            type="number"
                            min="1"
                            value={recurrenceData.interval}
                            onChange={(e) => handleRecurrenceChange('interval', parseInt(e.target.value))}
                            className="w-20 px-3 py-2 border rounded-md"
                          />
                          <Select
                            value={RECURRENCE_UNITS.find(opt => opt.value === recurrenceData.unit)}
                            onChange={(opt) => handleRecurrenceChange('unit', opt.value)}
                            options={RECURRENCE_UNITS}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Se termine le</label>
                      <input
                        type="date"
                        value={recurrenceData.endDate}
                        onChange={(e) => handleRecurrenceChange('endDate', e.target.value)}
                        min={startDate}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasMaxPerson}
                onChange={handleToggleMaxPerson}
                className="w-4 h-4 rounded border-zinc-300"
              />
              <span className="text-sm font-medium">
                Limiter le nombre de participants
              </span>
            </label>

            {hasMaxPerson && (
              <div className="pl-6">
                <input
                  type="number"
                  id="MaxPerson"
                  name="MaxPerson"
                  value={eventData.MaxPerson || ''}
                  onChange={handleChange}
                  placeholder="Nombre maximum de participants"
                  min="1"
                  className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md shadow-sm hover:bg-zinc-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
              Créer l'événement
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default ModalCreateEvent;


// <ModalCreateEvent 
//   isOpen={modalIsOpen} 
//   onClose={() => setModalIsOpen(false)}
// />
