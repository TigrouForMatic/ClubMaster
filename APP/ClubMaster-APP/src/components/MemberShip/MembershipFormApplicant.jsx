import React from 'react';
import useStore from '../../store/store';
import { getImageUrl } from '../../js/photo';
import MDEditor from '@uiw/react-md-editor';

const MembershipFormApplicant = ({ club, membershipForm }) => {
  const photo = useStore((state) => state.photos).find(photo => photo.referenceid == membershipForm.id && photo.referencetype == "membershipForm");

  return (
    <div className="flex justify-center p-6">
      <div className="w-[210mm] h-[297mm] bg-white shadow-lg p-8 relative">
        {/* En-tête */}
        <div className="relative mb-8">
          {photo && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-24 h-24">
              <img 
                src={getImageUrl(photo)} 
                alt="Logo du club" 
                className="w-full h-full object-contain rounded-md"
                crossOrigin="anonymous"
              />
            </div>
          )}
          <div className="text-center">
            <h1 className="text-3xl font-bold">{club.label}</h1>
            <p className="text-lg text-gray-600 mt-2">{membershipForm.period}</p>
          </div>
        </div>

        {/* Titre */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold">{membershipForm.title}</h2>
        </div>

        {/* Description */}
        <div className="mb-8">
          <MDEditor.Markdown 
            source={membershipForm.description} 
            className="text-gray-700"
          />
        </div>

        {/* Texte légal */}
        <div className="mb-8">
          <div className="bg-gray-50 p-4 rounded">
            <MDEditor.Markdown 
              source={membershipForm.legaltext} 
              className="text-sm text-gray-600 bg-gray-50"
            />
          </div>
        </div>

        {/* Zone de signature et prise de connaissance */}
        <div className="absolute bottom-8 left-8 right-8">
          {membershipForm.requiresacknowledgment && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">☐ Je déclare avoir pris connaissance des conditions d'adhésion</p>
            </div>
          )}
          
          {membershipForm.requiresignature && (
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