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
    phonePrefix: '+33',
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

  const formatPhoneNumber = (prefix, number) => {
    // Supprimer le '+' du préfixe et le '0' initial du numéro si présent
    const cleanPrefix = prefix.replace('+', '');
    const cleanNumber = number.startsWith('0') ? number.substring(1) : number;
    return cleanPrefix + cleanNumber;
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
        phoneNumber: formatPhoneNumber(personalInfo.phonePrefix, personalInfo.phoneNumber),
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

                <div className="flex">
                  <select
                    name="phonePrefix"
                    value={personalInfo.phonePrefix}
                    onChange={handlePersonalInfoChange}
                    className="bg-white px-2 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-r-0 focus:z-10 appearance-none"
                    style={{ 
                      scrollbarWidth: 'none',
                      '-ms-overflow-style': 'none'
                    }}
                  >
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+1242">🇧🇸 +1242</option>
                    <option value="+1246">🇧🇧 +1246</option>
                    <option value="+1264">🇦🇬 +1264</option>
                    <option value="+1284">🇻🇬 +1284</option>
                    <option value="+1340">🇻🇮 +1340</option>
                    <option value="+1441">🇧🇲 +1441</option>
                    <option value="+1473">🇬🇩 +1473</option>
                    <option value="+1649">🇧🇸 +1649</option>
                    <option value="+1670">🇬🇺 +1670</option>
                    <option value="+1671">🇬🇾 +1671</option>
                    <option value="+1684">🇻🇬 +1684</option>
                    <option value="+1758">🇱🇨 +1758</option>
                    <option value="+1767">🇩🇬 +1767</option>
                    <option value="+1784">🇻🇨 +1784</option>
                    <option value="+1809">🇩🇴 +1809</option>
                    <option value="+1829">🇩🇨 +1829</option>
                    <option value="+1849">🇩🇨 +1849</option>
                    <option value="+1868">🇹🇹 +1868</option>
                    <option value="+1869">🇰🇳 +1869</option>
                    <option value="+1876">🇯🇲 +1876</option>
                    <option value="+1939">🇵🇷 +1939</option>
                    <option value="+7">🇷🇺 +7</option>
                    <option value="+20">🇪🇬 +20</option>
                    <option value="+30">🇬🇷 +30</option>
                    <option value="+31">🇳🇱 +31</option>
                    <option value="+32">🇧🇪 +32</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+34">🇪🇸 +34</option>
                    <option value="+36">🇭🇺 +36</option>
                    <option value="+39">🇮🇹 +39</option>
                    <option value="+40">🇷🇴 +40</option>
                    <option value="+41">🇨🇭 +41</option>
                    <option value="+43">🇦🇹 +43</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+46">🇸🇪 +46</option>
                    <option value="+47">🇳🇴 +47</option>
                    <option value="+48">🇵🇱 +48</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+51">🇵🇪 +51</option>
                    <option value="+52">🇲🇽 +52</option>
                    <option value="+53">🇨🇺 +53</option>
                    <option value="+54">🇦🇷 +54</option>
                    <option value="+55">🇧🇷 +55</option>
                    <option value="+56">🇨🇱 +56</option>
                    <option value="+57">🇨🇴 +57</option>
                    <option value="+58">🇻🇪 +58</option>
                    <option value="+60">🇲🇾 +60</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+62">🇮🇩 +62</option>
                    <option value="+63">🇵🇭 +63</option>
                    <option value="+64">🇳🇿 +64</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+66">🇹🇭 +66</option>
                    <option value="+77">🇰🇿 +77</option>
                    <option value="+81">🇯🇵 +81</option>
                    <option value="+82">🇰🇷 +82</option>
                    <option value="+84">🇻🇳 +84</option>
                    <option value="+86">🇨🇳 +86</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+92">🇵🇰 +92</option>
                    <option value="+93">🇦🇫 +93</option>
                    <option value="+94">🇱🇰 +94</option>
                    <option value="+95">🇲🇲 +95</option>
                    <option value="+98">🇮🇷 +98</option>
                    <option value="+211">🇸🇸 +211</option>
                    <option value="+212">🇲🇦 +212</option>
                    <option value="+213">🇩🇿 +213</option>
                    <option value="+216">🇹🇳 +216</option>
                    <option value="+218">🇱🇾 +218</option>
                    <option value="+220">🇬🇲 +220</option>
                    <option value="+221">🇸🇳 +221</option>
                    <option value="+222">🇲🇷 +222</option>
                    <option value="+223">🇲🇱 +223</option>
                    <option value="+224">🇬🇳 +224</option>
                    <option value="+225">🇨🇮 +225</option>
                    <option value="+226">🇧🇫 +226</option>
                    <option value="+227">🇳🇪 +227</option>
                    <option value="+228">🇹🇬 +228</option>
                    <option value="+229">🇧🇯 +229</option>
                    <option value="+230">🇲🇺 +230</option>
                    <option value="+231">🇱🇷 +231</option>
                    <option value="+232">🇸🇱 +232</option>
                    <option value="+233">🇬🇭 +233</option>
                    <option value="+234">🇳🇬 +234</option>
                    <option value="+235">🇹🇩 +235</option>
                    <option value="+236">🇨🇫 +236</option>
                    <option value="+237">🇨🇲 +237</option>
                    <option value="+238">🇨🇽 +238</option>
                    <option value="+239">🇸🇨 +239</option>
                    <option value="+240">🇬🇶 +240</option>
                    <option value="+241">🇬🇦 +241</option>
                    <option value="+242">🇨🇬 +242</option>
                    <option value="+243">🇨🇩 +243</option>
                    <option value="+244">🇨🇦 +244</option>
                    <option value="+245">🇬🇼 +245</option>
                    <option value="+246">🇬🇾 +246</option>
                    <option value="+248">🇸🇨 +248</option>
                    <option value="+249">🇸🇩 +249</option>
                    <option value="+250">🇷🇼 +250</option>
                    <option value="+251">🇪🇹 +251</option>
                    <option value="+252">🇸🇸🇸 +252</option>
                    <option value="+253">🇩🇯 +253</option>
                    <option value="+254">🇰🇪 +254</option>
                    <option value="+255">🇹🇿 +255</option>
                    <option value="+256">🇺🇬 +256</option>
                    <option value="+257">🇧🇮 +257</option>
                    <option value="+258">🇲🇿 +258</option>
                    <option value="+260">🇿🇲 +260</option>
                    <option value="+261">🇲🇫 +261</option>
                    <option value="+262">🇷🇪 +262</option>
                    <option value="+263">🇿🇼 +263</option>
                    <option value="+264">🇳🇦 +264</option>
                    <option value="+265">🇲🇼 +265</option>
                    <option value="+266">🇱🇸 +266</option>
                    <option value="+267">🇧🇼 +267</option>
                    <option value="+268">🇸🇿 +268</option>
                    <option value="+269">🇰🇷 +269</option>
                    <option value="+290">🇸🇽 +290</option>
                    <option value="+291">🇪🇷 +291</option>
                    <option value="+298">🇫🇴 +298</option>
                    <option value="+299">🇬🇫 +299</option>
                    <option value="+350">🇬🇲 +350</option>
                    <option value="+351">🇵🇹 +351</option>
                    <option value="+352">🇱🇺 +352</option>
                    <option value="+353">🇮🇪 +353</option>
                    <option value="+354">🇮🇸 +354</option>
                    <option value="+355">🇦🇱 +355</option>
                    <option value="+356">🇲🇹 +356</option>
                    <option value="+357">🇨🇾 +357</option>
                    <option value="+358">🇫🇮 +358</option>
                    <option value="+359">🇧🇬 +359</option>
                    <option value="+370">🇱🇮 +370</option>
                    <option value="+371">🇱🇻 +371</option>
                    <option value="+372">🇱🇹 +372</option>
                    <option value="+373">🇲🇩 +373</option>
                    <option value="+374">🇦🇲 +374</option>
                    <option value="+375">🇧🇾 +375</option>
                    <option value="+376">🇱🇮 +376</option>
                    <option value="+377">🇲🇨 +377</option>
                    <option value="+378">🇸🇲 +378</option>
                    <option value="+380">🇺🇦 +380</option>
                    <option value="+381">🇷🇸 +381</option>
                    <option value="+382">🇲🇪 +382</option>
                    <option value="+385">🇭🇷 +385</option>
                    <option value="+387">🇧🇦 +387</option>
                    <option value="+389">🇲🇰 +389</option>
                    <option value="+420">🇨🇿 +420</option>
                    <option value="+421">🇸🇰 +421</option>
                    <option value="+423">🇱🇮 +423</option>
                    <option value="+673">🇧🇳 +673</option>
                    <option value="+685">🇼🇸 +685</option>
                    <option value="+691">🇫🇲 +691</option>
                    <option value="+852">🇭🇰 +852</option>
                    <option value="+994">🇦🇿 +994</option>
                    <option value="+998">🇺🇿 +998</option>
                  </select>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Numéro de téléphone"
                    value={personalInfo.phoneNumber}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-l-0 focus:z-10"
                  />
                </div>

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