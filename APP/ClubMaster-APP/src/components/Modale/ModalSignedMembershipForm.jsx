import React, { useRef } from 'react';
import MembershipFormApplicant from '../MemberShip/MembershipFormApplicant';
import { SignaturePad } from 'react-signature-pad-wrapper';
import Modal from 'react-modal';

const ModalSignedMembershipForm = ({ isOpen, onClose, membershipForm, onSubmit }) => {
    if (!isOpen) return null;

    const signaturePadRef = useRef(null);

    const handleSubmit = () => {
        if (signaturePadRef.current) {
            const signatureData = signaturePadRef.current.toDataURL();
            onSubmit({ ...membershipForm, signature: signatureData });
        }
    };

    const handleClear = () => {
        if (signaturePadRef.current) {
            signaturePadRef.current.clear();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto mt-10 max-h-[90vh] overflow-y-auto scrollbar-hide"
            overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-start justify-center"
        >
            <div className="p-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Signature du formulaire de demande de cotisation
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <div className="mt-6 space-y-6">
                    <div className="space-y-4">
                        <MembershipFormApplicant membershipForm={membershipForm} />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Signature</h3>
                        <div className="space-y-2">
                            <p className="text-sm text-zinc-600">
                                Veuillez signer ci-dessous pour confirmer votre demande d'adhésion :
                            </p>
                            <div className="border border-zinc-300 rounded-lg bg-white">
                                <SignaturePad 
                                    ref={signaturePadRef} 
                                    options={{ 
                                        backgroundColor: 'rgb(255, 255, 255)',
                                        height: 200
                                    }} 
                                />
                            </div>
                            <button
                                onClick={handleClear}
                                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                Effacer la signature
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t">
                        <button
                            onClick={onClose}
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
        </Modal>
    );
};

export default ModalSignedMembershipForm;