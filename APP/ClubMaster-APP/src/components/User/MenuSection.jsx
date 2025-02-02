import React, { useState } from 'react';
import useStore from '../../store/store';
import { getDisplayFormatedDate } from "../../js/date";
import { EditPencil } from 'iconoir-react';
import ModalEditPersonnalData from '../Modale/ModalEditPersonnalData';

const MenuItem = ({ title, content, isOpen, toggleItem }) => (
  <div className="mb-2 border-b border-gray-200 last:border-b-0">
    <div 
      onClick={toggleItem}
      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
    >
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
        →
      </span>
    </div>
    {isOpen && (
      <div className="p-4 bg-gray-50 rounded-b-lg">
        {content}
      </div>
    )}
  </div>
);

const MenuSection = () => {
  const { currentUser, currentUserAddresses, userClubs } = useStore();
  const [openItem, setOpenItem] = useState(null);
  const [isModalPersonnalDataOpen, setIsModalPersonnalDataOpen] = useState(false);

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  const menuItems = [
    {
      title: "Club(s)",
      content: (
        <ul className="space-y-4">
          {userClubs.map((club, index) => (
            <li key={index} className="bg-white p-3 rounded-lg shadow-sm">
              <span className="font-semibold text-gray-900">{club.label}</span>
              {club.oldlabel && (
                <span className="text-gray-600 text-sm"> (Ancien nom : {club.oldlabel})</span>
              )}
              <div className="text-sm text-gray-500 mt-1">
                Créé le : {getDisplayFormatedDate(new Date(club.creationdate))}
              </div>
            </li>
          ))}
        </ul>
      )
    },
    {
      title: "Paiements",
      content: (
        <div className="text-gray-600">
          <p className="font-medium">Liste des moyens de paiement :</p>
          {/* Contenu des paiements */}
        </div>
      )
    },
    {
      title: "Informations Personnelles",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900">Informations</h4>
            <button 
              onClick={() => setIsModalPersonnalDataOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <EditPencil className="w-5 h-5 text-blue-600" />
            </button>
          </div>
          
          <div className="space-y-2 text-gray-600">
            <p><span className="font-medium">Nom :</span> {currentUser.name}</p>
            <p><span className="font-medium">Date de naissance :</span> {new Date(currentUser.naissancedate).toLocaleDateString()}</p>
            <p><span className="font-medium">Téléphone :</span> {currentUser.phonenumber}</p>
            <p><span className="font-medium">Email :</span> {currentUser.emailaddress}</p>
          </div>

          <div className="mt-4">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Adresses</h4>
            <ul className="space-y-2">
              {currentUserAddresses.map((add, index) => (
                <li key={index} className="bg-white p-3 rounded-lg shadow-sm text-gray-600">
                  {add.street}, {add.city}, {add.state} {add.postalcode}, {add.country}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Inviter des amis",
      content: (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Vous souhaitez inviter un ami ?</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Inviter un ami
          </button>
        </div>
      )
    }
  ];

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 space-y-2">
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          title={item.title}
          content={item.content}
          isOpen={openItem === index}
          toggleItem={() => toggleItem(index)}
        />
      ))}
      <ModalEditPersonnalData
        isOpen={isModalPersonnalDataOpen}
        onClose={() => setIsModalPersonnalDataOpen(false)}
      />
    </section>
  );
};

export default MenuSection;