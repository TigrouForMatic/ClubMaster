import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import useStore from '../../store/store';
import styles from "../../styles/ModaleCreateEvent.module.css";
import { saveAs } from 'file-saver';
import ical from 'ical-generator';

function ModalExportPlanning({ isOpen, onClose }) {

  const { userClubs, addresses,events, typesEvent } = useStore();

  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().split('T')[0]);
  const [exportFormat, setExportFormat] = useState('ics');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventsFiltered = events.filter(event => {
      return new Date(event.dd) >= new Date(startDate) && new Date(event.df) <= new Date(endDate);
    });

    const getDescription = (event, type) => {
        let description = "- ClubMaster - ";
        description += "\n";
        
        if (userClubs && userClubs.length > 0) {
            const club = userClubs.find(club => club.id === type.clubid);
            description += "Club : " + (club?.label || "Non spécifié");
            description += "\n";
        } else {
            description += "Club : Non spécifié\n";
        }
        
        if (event.description) {
            description += event.description;
            description = description.replace(/<[^>]*>?/g, ''); 
        } else {
            description += "Aucune description";
        }
        return description;
    }

    const getLocation = (event) => {
        if (!addresses || addresses.length === 0) {
            return "Adresse non spécifiée";
        }
        const address = addresses.find(address => address.id === event.addressid);
        if (!address) {
            return "Adresse non trouvée";
        }
        return address.street + " " + address.postalcode + " " + address.city;
    }

    const eventsToExport = eventsFiltered.map(event => {
        const type = typesEvent.find(type => type.id === event.eventtypeid);
        
        return {
            ...event,
            location: getLocation(event),
            type: type?.label || "Type non spécifié",
            description: getDescription(event, type)
        }
    });

    const dateEventEnd = (event) => {
        let dateEventEnd = event.df;
        if (event.df < event.dd) {
            dateEventEnd = new Date(new Date(event.df).setDate(new Date(event.df).getDate() + 1));
        }
        return dateEventEnd;
    }
    
    const calendar = ical({
      name: 'Planning ClubMaster',
      timezone: 'Europe/Paris'
    });

    eventsToExport.forEach(event => {
      calendar.createEvent({
        start: new Date(event.dd),
        end: dateEventEnd(event),
        summary: event.label,
        description: event.description,
        location: event.location,
        categories: event.type ? [{name: event.type}] : [] 
      });
    });

    if (exportFormat === 'ics') {
      const blob = new Blob([calendar.toString()], { type: 'text/calendar' });
      saveAs(blob, 'planning.ics');
    } else if (exportFormat === 'google') {
        // const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${startDate}/${endDate}&text=Planning%20ClubMaster`;
        // window.open(googleUrl, '_blank');
        window.alert("Fonctionnalité en maintenance");
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.headerModal}>
        <h2 className={styles.title}>Exporter le planning</h2>
        <button onClick={handleClose} className={styles.closeButton}>&times;</button>
      </div>

      <form onSubmit={handleSubmit} className={styles.content}>
        
        <div className={styles.dateTimeSection}>
          <div className={styles.dateTimeBlock}>
            <div className={styles.dateTimeContainer}>
              <div className={styles.inputGroup}>
                <label>Date de début</label>
                <div className={styles.dateInput}>
                  <input
                    type="date"
                    name="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Date de début"
                    required
                  />
                </div>
                <label>Date de fin</label>
                <div className={styles.dateInput}>
                  <input
                    type="date"
                    name="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="Date de fin"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr/>

        <div className={styles.formatSelection}>
          <label>Format d'export</label>
          <select 
            value={exportFormat} 
            onChange={(e) => setExportFormat(e.target.value)}
            className={styles.selectFormat}
          >
            <option value="ics">iCalendar (.ics) - Apple Calendar</option>
            <option value="google">Google Calendar</option>
          </select>
        </div>

        <div className={styles.buttonContainer}>
          <button type="button" onClick={handleClose} className={styles.unregisterButton}>Annuler</button>
          <button type="submit" className={styles.registerButton}>Exporter le planning</button>
        </div>
      </form>
    </Modal>
  );
}

export default ModalExportPlanning;
