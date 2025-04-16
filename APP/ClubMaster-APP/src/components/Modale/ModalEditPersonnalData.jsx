import React, { useState, useEffect } from 'react';
import api from '../../js/App/Api';
import useStore from '../../store/store';
import AddressForm from '../User/AdressesForm';
import CustomConfirm from '../CustomConfirm';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../js/authService';
import PhoneInput from '../PhoneInput';
import { formatPhoneNumber, PHONE_PREFIXES } from '../../js/phoneUtils';

function ModalEditPersonnalData({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { currentUser, setItems } = useStore();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [personnalData, setPersonnalData] = useState({
    firstname: currentUser.firstname || '',
    lastname: currentUser.lastname || '',
    login: currentUser.login || '',
    phonenumber: currentUser.phonenumber || '',
    naissancedate: currentUser.naissancedate || '',
    pseudo: currentUser.pseudo || '',
  });

  const extractPhoneComponents = (phoneNumber) => {
    const prefixes = PHONE_PREFIXES.map(p => p.value.replace('+', ''));
    const prefix = prefixes.find(p => phoneNumber.startsWith(p));
    const number = prefix ? phoneNumber.substring(prefix.length) : phoneNumber;
    return { prefix: '+' + prefix, number };
  };

  const handleChangePersonnalData = (name, value) => {
    if (name === 'phonePrefix' || name === 'phoneNumber') {
      const prefix = name === 'phonePrefix' ? value : extractPhoneComponents(personnalData.phonenumber).prefix;
      const number = name === 'phoneNumber' ? value : extractPhoneComponents(personnalData.phonenumber).number;
      const fullNumber = formatPhoneNumber(prefix, number);
      setPersonnalData(prevData => ({ ...prevData, phonenumber: fullNumber }));
    } else {
      setPersonnalData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const hasChanges = Object.keys(personnalData).some(
        key => personnalData[key] !== currentUser[key]
      );
  
      if (hasChanges) {
        const payload = {
          id: currentUser.id,
          firstname: personnalData.firstname,
          lastname: personnalData.lastname,
          login: personnalData.login,
          phonenumber: personnalData.phonenumber,
          naissancedate: personnalData.naissancedate,
          pseudo: personnalData.pseudo
        };
  
        const response = await api.put(`/login/${currentUser.id}`, payload);
        setItems('currentUser', response);
        handleClose();
      }
    } catch (error) {
      console.error('Erreur lors de la modification de l\'utilisateur:', error);
    }
  };

  const handleClose = () => {
    setConfirmDeleteOpen(false);
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const changePassword = () => {
    console.log('changePassword');
    // navigate('/auth/change-password');
  };

  const addPassword = () => {
    console.log('addPassword');
    // navigate('/auth/add-password');
  };

  const handleDelete = async () => {
    await api.delete(`/login/${login.id}`);
    setItems('currentUser', null);
    setPersonnalData(null);
    AuthService.logout();
    navigate('/auth/login');
  };

  if (!isOpen) return null;

  const phoneComponents = extractPhoneComponents(personnalData.phonenumber);

  return (
    <div className="fixed -top-[10px] inset-0 bg-black/30 z-50 flex justify-end" onClick={handleClose}>
        <div 
            className={`bg-white w-full max-w-3xl h-full overflow-y-auto transition-all duration-300 ${
                isClosing ? 'slide-out' : 'slide-in'
            }`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="p-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Modifier mes informations personnelles
                    </h2>
                    <button 
                        onClick={handleClose}
                        className="text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                    <div className="space-y-6">                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="pseudo" className="block text-sm font-medium text-gray-700">
                                    Pseudo
                                </label>
                                <input
                                    type="text"
                                    id="pseudo"
                                    name="pseudo"
                                    value={personnalData.pseudo}
                                    onChange={(e) => handleChangePersonnalData('pseudo', e.target.value)}
                                    className="p-3 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                                    Prénom
                                </label>
                                <input
                                    type="text"
                                    id="firstname"
                                    name="firstname"
                                    value={personnalData.firstname}
                                    onChange={(e) => handleChangePersonnalData('firstname', e.target.value)}
                                    required
                                    className="p-3 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                                    Nom
                                </label>
                                <input
                                    type="text"
                                    id="lastname"
                                    name="lastname"
                                    value={personnalData.lastname}
                                    onChange={(e) => handleChangePersonnalData('lastname', e.target.value)}
                                    required
                                    className="p-3 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="naissancedate" className="block text-sm font-medium text-gray-700">
                                    Date de naissance
                                </label>
                                <input
                                    type="date"
                                    id="naissancedate"
                                    name="naissancedate"
                                    value={personnalData.naissancedate ? new Date(personnalData.naissancedate).toISOString().split('T')[0] : ''}
                                    onChange={(e) => handleChangePersonnalData('naissancedate', e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="p-3 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700">
                                    Téléphone
                                </label>
                                <PhoneInput
                                    phonePrefix={phoneComponents.prefix}
                                    phoneNumber={phoneComponents.number}
                                    onChange={handleChangePersonnalData}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Adresse</h3>
                        <AddressForm />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Informations de connexion</h3>
                        
                        {currentUser.isVerified && ( 
                            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
                                <strong className="font-bold">Attention !</strong>
                                <span className="block sm:inline"> Votre email n'est pas verifier</span>
                                <span className="block sm:inline"> Veuillez vérifier votre email le plus rapidement possible.</span>
                            </div>
                        )}

                        <div>
                            <label htmlFor="login" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="login"
                                name="login"
                                value={personnalData.login}
                                onChange={handleChangePersonnalData}
                                className="p-3 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={changePassword}
                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Changer mon mot de passe
                        </button>

                        {currentUser.isPassword ? (
                            <button
                                type="button"
                                onClick={changePassword}
                                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                Changer mon mot de passe
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={addPassword}
                                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                Ajouter un mot de passe
                            </button>
                        )}

                        {currentUser.isGoogle ? (
                            <div className="flex items-center gap-2">
                                <span>Vous etes connecter avec Google</span>
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                                />
                                <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                                />
                                <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                                />
                                <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                                />
                            </svg>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span>Vous n'etes pas connecter avec Google</span>
                                <button>
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                                />
                                <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                                />
                                <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                                />
                                <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                                />
                            </svg>
                            </button>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => setConfirmDeleteOpen(true)}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Supprimer mon compte
                        </button>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t mt-8">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                        >
                            Enregistrer les modifications
                        </button>
                    </div>
                </form>

                <CustomConfirm
                    isOpen={confirmDeleteOpen}
                    onClose={() => setConfirmDeleteOpen(false)}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmDeleteOpen(false)}
                    message="Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible. Toutes vos données seront perdues."
                />
            </div>
        </div>
    </div>
  );
}

export default ModalEditPersonnalData;
