import React from 'react';
import useStore from '../../store/store';

const MembershipFormApplicant = ({ club, membershipForm }) => {
  const photo = useStore((state) => state.photos).find(photo => photo.referenceid == membershipForm.id);

  return (
    <div className="flex justify-center p-6">
      <div className="w-[210mm] h-[297mm] bg-white shadow-lg p-8 relative">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div className="w-24 h-24">
            {photo && (
              <img 
                src={photo.url} 
                alt="Logo du club" 
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <div className="text-center flex-grow">
            <h1 className="text-3xl font-bold">{club.label}</h1>
            <p className="text-lg text-gray-600 mt-2">Période : {membershipForm.period}</p>
          </div>
        </div>

        {/* Titre */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold">{membershipForm.title}</h2>
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-gray-700 whitespace-pre-wrap">{membershipForm.description}</p>
        </div>

        {/* Texte légal */}
        <div className="mb-8">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{membershipForm.legalText}</p>
          </div>
        </div>

        {/* Zone de signature et prise de connaissance */}
        <div className="absolute bottom-8 left-8 right-8">
          {membershipForm.requiresAcknowledgment && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">☐ Je déclare avoir pris connaissance des conditions d'adhésion</p>
            </div>
          )}
          
          {membershipForm.requiresSignature && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Signature :</p>
              <div className="border-b border-gray-300 h-16"></div>
            </div>
          )}
          
          <div className="mt-4 text-right">
            <p className="text-sm text-gray-500">Fait à _____________, le ____ / ____ / ________</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipFormApplicant;