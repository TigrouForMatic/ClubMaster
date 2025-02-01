import React, { useState, useMemo, useEffect } from 'react';   
import api from '../../js/App/Api';
import useStore from '../../store/store';

function EditEvent({ event, onClose }) {    
  const { currentUserRoles, userClubs, addresses, typesEvent } = useStore();
  const updateItem = useStore((state) => state.updateItem);
  const [selectedClubId, setSelectedClubId] = useState(typesEvent.find(type => type.id === event.eventtypeid)?.clubid);
  const [startDate, setStartDate] = useState(event.dd.split('T')[0]);
  const [startTime, setStartTime] = useState(new Date(new Date(event.dd).getTime()+60*60*1000).toISOString().split('T')[1].slice(0, 5));
  const [endTime, setEndTime] = useState(new Date(new Date(event.df).getTime()+60*60*1000).toISOString().split('T')[1].slice(0, 5));
  const [hasMaxPerson, setHasMaxPerson] = useState(event.maxperson ? true : false);

  const [eventData, setEventData] = useState({
    Label: event.label,
    Description: event.description,
    EventTypeId: event.eventtypeid,
    Dd: event.dd,
    Df: event.df,
    AddressId: event.addressid,
    MaxPerson: event.maxperson,
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const date = startDate || new Date().toISOString().split('T')[0];
      const finalEventData = {
        ...eventData,
        Dd: new Date(`${date}T${startTime}`).toISOString(),
        Df: new Date(`${date}T${endTime === '' ? startTime : endTime}`).toISOString(),
      };

      const response = await api.put(`/event/${event.id}`, finalEventData);
      updateItem('events', event.id, response);
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
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
    onClose();
  };

  const eventTypeSorted = filteredTypes.sort((a, b) => a.label.localeCompare(b.label));

  const handleToggleMaxPerson = () => {
    setHasMaxPerson(!hasMaxPerson);
    if (!hasMaxPerson) {
      setEventData(prevData => ({ ...prevData, MaxPerson: null }));
    }
  };

  return (
    <div className="p-6">
      {filteredClubs.length > 1 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Sélectionner un club</h3>
          <div className="flex flex-wrap gap-2">
            {filteredClubs.map(club => (
              <button
                key={club.id}
                onClick={() => handleClubSelect(club.id)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  selectedClubId === club.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {club.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="EventTypeId" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Type d'événement
            </label>
            <select
              id="EventTypeId"
              name="EventTypeId"
              value={eventData.EventTypeId}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Sélectionnez un type d'événement</option>
              {eventTypeSorted.map((type) => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="Label" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Nom de l'événement
            </label>
            <input
              type="text"
              id="Label"
              name="Label"
              value={eventData.Label}
              onChange={handleChange}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="Description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Description
            </label>
            <textarea
              id="Description"
              name="Description"
              value={eventData.Description}
              onChange={handleChange}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="AddressId" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Adresse
            </label>
            <select
              id="AddressId"
              name="AddressId"
              value={eventData.AddressId}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Sélectionnez une adresse</option>
              {addresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {`${address.street}, ${address.postalcode} ${address.city}`}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Date</label>
              <input
                type="date"
                name="startDate"
                value={startDate || new Date().toISOString().split('T')[0]}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toLocaleDateString('fr-CA')}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Horaires</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">de</span>
                <input
                  type="time"
                  name="startTime"
                  value={startTime}
                  onChange={handleChange}
                  required
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <span className="text-sm text-muted-foreground">à</span>
                <input
                  type="time"
                  name="endTime"
                  value={endTime}
                  onChange={handleChange}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="maxPerson"
                checked={hasMaxPerson}
                onChange={handleToggleMaxPerson}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="maxPerson" className="text-sm font-medium leading-none">
                Limiter le nombre de participants
              </label>
            </div>

            {hasMaxPerson && (
              <input
                type="number"
                id="MaxPerson"
                name="MaxPerson"
                value={eventData.MaxPerson || ''}
                onChange={handleChange}
                placeholder="Nombre maximum de participants"
                min="1"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Modifier l'événement
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditEvent;