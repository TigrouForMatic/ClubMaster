import React, { useState } from 'react';
import { GithubIcon } from 'lucide-react';
import useStore from '../../store/store';
import api from '../../js/App/Api';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setItems = useStore((state) => state.setItems);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('auth/create-account', {
        login: email,
        password: 'defaultPassword123' // À modifier selon vos besoins
      });

      if (response.token) {
        localStorage.setItem('token', response.token);
        setItems('login', { 
          id: response.user.id, 
          login: response.user.login, 
          pseudo: response.user.pseudo 
        });
      }
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-zinc-900 p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img src="/logo.png" alt="ClubMaster" className="h-8 w-8 mr-2" />
          ClubMaster
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Cette application m'a permis de gérer mon club de sport plus efficacement que jamais."
            </p>
            <footer className="text-sm">Sophie Martin</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Créer un compte
            </h1>
            <p className="text-sm text-muted-foreground">
              Entrez votre email ci-dessous pour créer votre compte
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <input
                  type="email"
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className={`w-full py-2 bg-black text-white rounded-md hover:bg-zinc-800 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Chargement...' : 'S\'inscrire avec Email'}
              </button>
            </div>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Ou continuer avec
              </span>
            </div>
          </div>
          <button
            type="button"
            className="w-full py-2 border rounded-md flex items-center justify-center gap-2 hover:bg-zinc-50"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </button>
          <p className="px-8 text-center text-sm text-muted-foreground">
            En cliquant sur continuer, vous acceptez nos{" "}
            <a href="#" className="underline hover:text-zinc-800">
              Conditions d'utilisation
            </a>{" "}
            et notre{" "}
            <a href="#" className="underline hover:text-zinc-800">
              Politique de confidentialité
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;