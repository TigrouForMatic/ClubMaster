import React, { useState } from 'react';
import Modal from 'react-modal';
import api from '../../js/App/Api';
import useStore from '../../store/store';
import AddressForm from '../User/AdressesForm';
import CustomConfirm from '../CustomConfirm';
import { useNavigate } from 'react-router-dom';

function ModalEditPersonnalData({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { currentUser, login, setCurrentUser, setLogin, setShowApp } = useStore();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const [personnalData, setPersonnalData] = useState({
    name: currentUser.name || '',
    emailaddress: currentUser.emailaddress || '',
    phonenumber: currentUser.phonenumber || '',
    naissancedate: currentUser.naissancedate || '',
  });

  const [loginData, setLoginData] = useState({
    login: login.login,
    pseudo: login.pseudo,
  });

  const handleChangePersonnalData = (e) => {
    const { name, value } = e.target;
    setPersonnalData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    if (name === 'login') {
      setLoginData(prevData => ({ ...prevData, [name]: value }));
      setPersonnalData(prevData => ({ ...prevData, ['emailaddress']: value }));
    } else {
      setLoginData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (loginData.login !== login.login || loginData.pseudo !== login.pseudo) {
        const loginPayload = {
          ...login,
          login: loginData.login,
          pseudo: loginData.pseudo,
        };
        const loginResponse = await api.put(`/login/${login.id}`, loginPayload);
        setLogin(loginResponse);
      }

      if (personnalData.name !== currentUser.name || 
          personnalData.emailaddress !== currentUser.emailaddress || 
          personnalData.phonenumber !== currentUser.phonenumber || 
          personnalData.naissancedate !== currentUser.naissancedate) {

        const personalPayload = {
          ...currentUser,
          name: personnalData.name,
          emailaddress: personnalData.emailaddress,
          phonenumber: personnalData.phonenumber,
          naissancedate: personnalData.naissancedate,
        };

        const personalResponse = await api.put(`/personphysic/${currentUser.id}`, personalPayload);
        setCurrentUser(personalResponse);
      }
      
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la création/modification de l\'utilisateur:', error);
    }
  };

  const handleClose = () => {
    setConfirmDeleteOpen(false);
    onClose();
  };

  const changePassword = () => {
    console.log('changePassword');
  };

  const handleDelete = async () => {
    await api.delete(`/login/${login.id}`);
    await api.delete(`/personphysic/${currentUser.id}`);
    localStorage.removeItem('token');
    setCurrentUser(null);
    setLogin(null);
    navigate('/');
    setShowApp();
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
            Modifier mes informations personnelles
          </h2>
          <button 
            onClick={handleClose}
            className="text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations personnelles</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={personnalData.name}
                  onChange={handleChangePersonnalData}
                  required
                  className="p-2 mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="pseudo" className="block text-sm font-medium text-zinc-700">
                  Pseudo
                </label>
                <input
                  type="text"
                  id="pseudo"
                  name="pseudo"
                  value={loginData.pseudo}
                  onChange={handleChangeLogin}
                  className="p-2 mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="naissancedate" className="block text-sm font-medium text-zinc-700">
                  Date de naissance
                </label>
                <input
                  type="date"
                  id="naissancedate"
                  name="naissancedate"
                  value={personnalData.naissancedate ? new Date(personnalData.naissancedate).toISOString().split('T')[0] : ''}
                  onChange={handleChangePersonnalData}
                  max={new Date().toISOString().split('T')[0]}
                  className="p-2 mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="phonenumber" className="block text-sm font-medium text-zinc-700">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phonenumber"
                  name="phonenumber"
                  value={personnalData.phonenumber}
                  onChange={handleChangePersonnalData}
                  className="p-2 mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
            
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-zinc-700">
                Email
              </label>
              <input
                type="email"
                id="login"
                name="login"
                value={loginData.login}
                onChange={handleChangeLogin}
                className="p-2 mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <button
              type="button"
              onClick={changePassword}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Changer mon mot de passe
            </button>

            <button
              type="button"
              onClick={() => setConfirmDeleteOpen(true)}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Supprimer mon compte
            </button>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Modifier
            </button>
          </div>
        </form>

        <CustomConfirm
          isOpen={confirmDeleteOpen}
          onClose={() => setConfirmDeleteOpen(false)}
          onConfirm={handleDelete}
          message="Voulez-vous vraiment supprimer votre compte ?"
        />
      </div>
    </Modal>
  );
}

export default ModalEditPersonnalData;
