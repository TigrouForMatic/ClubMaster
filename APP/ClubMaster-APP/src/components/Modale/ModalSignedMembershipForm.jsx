import React, { useRef, useState, useCallback } from 'react';
import MembershipFormApplicant from '../MemberShip/MembershipFormApplicant';
import SignaturePad from '../SignaturePad';
import api from '../../js/App/Api';
import useStore from '../../store/store';
import { downloadMembershipForm } from '../../js/download';

const ModalSignedMembershipForm = ({ isOpen, onClose, club, membershipForm, onSubmit }) => {
    if (!isOpen) return null;

    const { currentUser } = useStore();

    const [isClosing, setIsClosing] = useState(false);
    const [signature, setSignature] = useState(null);

    const signaturePadRef = useRef(null);

    const handleSubmit = async () => {
        if (signature) {
            try {
                await api.post("/membershipFormSignature", {
                    signature: signature,
                    membershipFormId: membershipForm.id,
                    personPhysicId: currentUser.id
                });
                onSubmit(club.id);
                handleClose();
            } catch (err) {
                console.error('Erreur lors de la récupération des signatures:', err.message);
            }
        }
    };

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
          setIsClosing(false);
          onClose();
        }, 300);
      }, [onClose]);

    const handleDownload = async (id) => {
        try {
            const response = await api.get(`/membershipForm/${id}/download`, {
                responseType: 'blob',
                headers: {
                    'Accept': 'application/pdf'
                }
            });
            
            downloadMembershipForm(response, club.label);
        } catch (err) {
            console.error('Erreur lors du téléchargement du formulaire:', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-end" onClick={handleClose}>
            <div 
                className={`bg-white w-full max-w-3xl h-full overflow-y-auto p-4 transition-all duration-300 ${
                isClosing ? 'slide-out' : 'slide-in'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => handleDownload(membershipForm.id)}
                            className="text-zinc-500 hover:text-zinc-900 transition-colors"
                            title="Télécharger"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </button>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Signature du formulaire d'adhésion
                        </h2>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <div className="mt-6 space-y-6">
                    <div className="space-y-4">
                        <MembershipFormApplicant membershipForm={membershipForm} club={club} />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Signature</h3>
                        <div className="space-y-2">
                            <p className="text-sm text-zinc-600">
                                Veuillez signer ci-dessous pour confirmer votre demande d'adhésion :
                            </p>
                            <div className="border border-zinc-300 rounded-lg bg-white">
                                <SignaturePad 
                                    onChange={(signature) => setSignature(signature)}
                                    className="w-full h-full"
                                    ref={signaturePadRef} 
                                    options={{ 
                                        backgroundColor: 'rgb(255, 255, 255)',
                                        height: 200
                                    }} 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md shadow-sm hover:bg-zinc-50"
                        >
                            Abandonner
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                        >
                            Demander à rejoindre
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalSignedMembershipForm;