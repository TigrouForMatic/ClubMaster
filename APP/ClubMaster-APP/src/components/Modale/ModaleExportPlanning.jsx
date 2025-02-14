import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import useStore from '../../store/store';
import { saveAs } from 'file-saver';
import ical from 'ical-generator';
import { Calendar, X } from 'lucide-react';

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
      className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto mt-10 overflow-hidden"
      overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div className="flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Exporter le planning
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {/* Date Range */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date de début
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date de fin
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Export Format */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Format d'export
            </label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ics">iCalendar (.ics) - Apple Calendar</option>
              <option value="google">Google Calendar</option>
            </select>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Annuler
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Exporter le planning
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ModalExportPlanning;
