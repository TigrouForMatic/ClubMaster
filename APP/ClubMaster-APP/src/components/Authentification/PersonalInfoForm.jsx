import React, { useState, useEffect } from 'react';
import useStore from '../../store/store';
import api from '../../js/App/Api';
import { OpenInWindow } from 'iconoir-react';
import PrivacyPolicyModal from '../Modale/PrivacyPolicyModal';
import GeneralConditionModal from '../Modale/GeneralConditionModal';
import { useNavigate } from 'react-router-dom';
import AuthCarousel from './AuthCarousel';
import AuthService from '../../js/authService';

function PersonalInfoForm() {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    bornDate: '',
  });

  const [addressInfo, setAddressInfo] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  const [consentGivenPolitique, setConsentGivenPolitique] = useState(false);
  const [consentGivenConditions, setConsentGivenConditions] = useState(false);
  const [error, setError] = useState('');
  const [modalIsOpenPolitique, setModalIsOpenPolitique] = useState(false);
  const [modalIsOpenConditions, setModalIsOpenConditions] = useState(false);
  const navigate = useNavigate();
  const setItems = useStore((state) => state.setItems);
  const currentUser = useStore((state) => state.currentUser);

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      if (AuthService.isPersonalInfoSet()) {
        navigate('/auth/find-club');
      }
    } else {
      navigate('/auth/login');
    }
  }, [navigate]);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consentGivenPolitique || !consentGivenConditions) {
      setError("Veuillez accepter la politique de confidentialité et les conditions générales pour continuer.");
      return;
    }

    if (!currentUser.id) {
      setError('ID de connexion non trouvé. Veuillez vous reconnecter.');
      return;
    }

    try {
      const personalInfoResponse = await api.post('/login/createAccount/'+currentUser.id, {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        naissanceDate: personalInfo.bornDate,
        phoneNumber: personalInfo.phoneNumber,
        generalConditions: consentGivenConditions,
        privacyPolicy: consentGivenPolitique
      });

      const currentUserUpdate = {
        ...currentUser,
        ...personalInfoResponse.user
      }

      setItems('currentUser', currentUserUpdate);

      const addressResponse = await api.post('/address/', {
        ...addressInfo,
        referenceid: personalInfoResponse.id,
        private: true,
        validate: true
      });

      setItems('currentAddressesPerson', addressResponse)

      localStorage.setItem('personalInfo', JSON.stringify(personalInfoResponse));
      navigate('/auth/find-club');
    } catch (err) {
      console.log(err);
      if (err.status === 400) {
        setError('Un compte est deja lié à ce numéro de téléphone');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    }
  };

  const openModalPolitique = () => {
    setModalIsOpenPolitique(true);
  };

  const closeModalPolitique = () => {
    setModalIsOpenPolitique(false);
  };

  const openModalConditions = () => {
    setModalIsOpenConditions(true);
  };

  const closeModalConditions = () => {
    setModalIsOpenConditions(false);
  };

  const handleAcceptPolitique = () => {
    setConsentGivenPolitique(true);
    closeModalPolitique();
  };

  const handleAcceptConditions = () => {
    setConsentGivenConditions(true);
    closeModalConditions();
  };

  const handleReturnToLogin = () => {
    AuthService.logout();
    navigate('/auth/login');
  };

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-[1fr,1fr] lg:px-0 sm:mx-0">
      <button
        onClick={handleReturnToLogin}
        className="absolute top-4 right-4 px-4 py-2 text-sm bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-md transition-colors"
      >
        Retour à la connexion
      </button>

      <AuthCarousel />

      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] px-4 sm:px-0">
          <div className="flex flex-col space-y-2 w-full">
            <h1 className="text-2xl font-semibold tracking-tight">
              Informations personnelles
            </h1>
            <p className="text-sm text-muted-foreground">
              Complétez vos informations pour finaliser votre inscription
            </p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Prénom"
                    value={personalInfo.firstName}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Nom"
                    value={personalInfo.lastName}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Numéro de téléphone"
                  value={personalInfo.phoneNumber}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="date"
                  name="bornDate"
                  placeholder="Date de naissance"
                  value={personalInfo.bornDate}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="space-y-2 mt-6">
                  <h2 className="text-lg font-medium">Adresse</h2>
                  {Object.entries(addressInfo).map(([key, value]) => (
                    <input
                      key={key}
                      type="text"
                      name={key}
                      placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                      value={value}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                </div>

                <div className="space-y-4 mt-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={consentGivenPolitique}
                      onChange={(e) => setConsentGivenPolitique(e.target.checked)}
                      className="rounded border-zinc-300 text-zinc-900 focus:ring-blue-500"
                    />
                    <span className="text-sm">
                      J'ai lu et j'accepte la politique de confidentialité
                    </span>
                    <OpenInWindow
                      onClick={openModalPolitique}
                      className="h-4 w-4 cursor-pointer text-zinc-500 hover:text-blue-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={consentGivenConditions}
                      onChange={(e) => setConsentGivenConditions(e.target.checked)}
                      className="rounded border-zinc-300 text-zinc-900 focus:ring-blue-500"
                    />
                    <span className="text-sm">
                      J'ai lu et j'accepte les conditions générales d'utilisation
                    </span>
                    <OpenInWindow
                      onClick={openModalConditions}
                      className="h-4 w-4 cursor-pointer text-zinc-500 hover:text-blue-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!consentGivenPolitique || !consentGivenConditions}
                className="w-full py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enregistrer et continuer
              </button>
            </form>
          </div>
        </div>
      </div>
      <PrivacyPolicyModal 
        isOpen={modalIsOpenPolitique} 
        onRequestClose={closeModalPolitique} 
        onAccept={handleAcceptPolitique} 
      />
      <GeneralConditionModal 
        isOpen={modalIsOpenConditions} 
        onRequestClose={closeModalConditions} 
        onAccept={handleAcceptConditions} 
      />
    </div>
  );
}

export default PersonalInfoForm;