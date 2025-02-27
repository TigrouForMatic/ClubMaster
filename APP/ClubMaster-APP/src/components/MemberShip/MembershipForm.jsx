import React, { useEffect, useState } from 'react';
import useStore from '../../store/store';

import MembershipFormApplicant from './MembershipFormApplicant';
import MembershipFormEditor from './MembershipFormEditor';

const MembershipForm = ({ clubId }) => {
    const { userClubs, membershipForms } = useStore();

    const [membershipForm, setMembershipForm] = useState(null);
    const [club, setClub] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    
    useEffect(() => {
        const membershipFormFiltered = membershipForms.find(membershipForm => membershipForm.clubid == clubId);
        const clubFiltered = userClubs.find(club => club.id == clubId);
        if (membershipFormFiltered) {
            setMembershipForm(membershipFormFiltered);
        } else {
            setMembershipForm(null);
        }
        if (clubFiltered) {
            setClub(clubFiltered);
        } else {
            setClub(null);
        }
        setIsLoading(false);
    }, [membershipForms, clubId]);

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900"></div>
        </div>
    );
    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-2xl font-semibold tracking-tight">
                    Fiches d'adhésion
                </h2>
                <div className="flex items-center gap-2">
                    {membershipForm && (
                        <>
                            <button className="bg-zinc-900 text-white px-4 py-2 rounded-md hover:bg-zinc-800" onClick={() => setMembershipForm(null)}>
                                Télécharger
                            </button>
                            <button className="bg-zinc-900 text-white px-4 py-2 rounded-md hover:bg-zinc-800" onClick={() => setIsEditing(true)}>
                                Modifier
                            </button>
                        </>
                    )}
                </div>
            </div>
            {isEditing ? (
                <MembershipFormEditor club={club} membershipForm={membershipForm} onClose={() => setIsEditing(false)}/>
            ) : (
                <>
                {membershipForm ? (
                    <MembershipFormApplicant club={club} membershipForm={membershipForm} />
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Aucune fiche d'adhésion n'est disponible pour ce club.</p>
                        <button 
                            className="mt-4 bg-zinc-900 text-white px-4 py-2 rounded-md hover:bg-zinc-800" 
                            onClick={() => setIsEditing(true)}
                        >
                            Créer une fiche d'adhésion
                        </button>
                    </div>
                )}
                </>
            )}
        </div>
    );
};

export default MembershipForm;