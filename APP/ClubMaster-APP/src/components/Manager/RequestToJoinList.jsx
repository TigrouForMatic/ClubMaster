import React, { useState, useMemo } from "react";
import { getDisplayFormatedDate } from "../../js/date";
import Select from 'react-select';
import UserImage from "../UserImage";
import CustomConfirm from "../CustomConfirm";
import ModalAcceptRequestToJoin from "../Modale/ModalAcceptRequestToJoin";

const RequestToJoinList = React.memo(({ requests, selectedClubId, licenceTypes, roles }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState({ value: 'pending', label: 'En attente' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const statusOptions = [
    { value: 'accepted', label: 'Accepté', color: '#22c55e' },
    { value: 'pending', label: 'En attente', color: '#f97316' },
    { value: 'rejected', label: 'Rejetée', color: '#ef4444' }
  ];

  const filteredRequests = useMemo(() => {
    return requests
      .filter(request => request.clubid === selectedClubId)
      .filter(request => {
        if (!searchQuery) return true;
        return request.personname.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .filter(request => {
        switch (statusFilter.value) {
          case 'accepted': return request.status === 'accepted';
          case 'rejected': return request.status === 'rejected';
          default: return request.status === 'pending';
        }
      });
  }, [requests, searchQuery, selectedClubId, statusFilter]);

  const handleAccept = async (request) => {
    // TODO: Implémenter la logique d'acceptation
    // console.log("Accepter la demande:", request);
    const response = await api.put(`/requestToJoin/${request.id}`, { status: 'accepted' });
    updateItem('requestToJoin', request.id, response);
    // console.log(response);

    try {
        const roleId = roles.find(role => role.clubid == selectedClubId && role.level == 0)?.id;
        const licenceTypeId = licenceTypes.find(licTyp => licTyp.clubid == selectedClubId && licTyp.label == "Licence Visiteur")?.id;
        const licenceData = await api.post('/licence', {
            label: "Licence Visiteur",
            dd: toSqlDate(new Date()),
            df: toSqlDate(getDateEndLicence()),
            licenceTypeId: licenceTypeId,
            personPhysicId: request.personphysicid,
            roleId: roleId,
        });

        addItem('licences', licenceData);

    } catch (err) {
      console.error('Erreur lors de la création du club:', err.message);
      setError(err.message);
    }
  };

  const handleReject = async (requestId) => {
    const response = await api.put(`/requestToJoin/${requestId}`, { status: 'rejected' });
    const requestRejected = {
        ...selectedRequest,
        status: 'rejected'
    }
    updateItem('requestToJoin', requestId, requestRejected);
    setIsConfirmOpen(false);
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Demandes d'adhésion</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="flex justify-start items-center gap-4">
          <input 
            type="text" 
            placeholder="Rechercher" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-3 pr-4 py-1.5 bg-white rounded-md cursor-default react-select-container border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            className="w-64 z-20"
            classNamePrefix="react-select"
            styles={{
              option: (styles, { data }) => ({
                ...styles,
                color: data.color,
                fontWeight: 500
              }),
              singleValue: (styles, { data }) => ({
                ...styles,
                color: data.color,
                fontWeight: 500
              })
            }}
          />
        </div>
      </div>

      <div className="relative w-full overflow-y-auto overflow-x-hidden scrollbar-hide">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b sticky top-0 bg-white z-10">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Personne</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contact</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date de demande</th>
              <th className="h-12 w-[150px] px-4"></th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {filteredRequests.map(request => (
              <tr key={request.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-3">
                    <UserImage name={request.personname} size={40} />
                    <div className="flex flex-col">
                      <span className="font-medium">{request.personname}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <div className="flex flex-col gap-1">
                    <a href={`mailto:${request.personemailaddress}`} className="text-sm cursor-pointer">{request.personemailaddress}</a>
                    <a href={`tel:${request.personphonenumber}`} className="text-sm text-muted-foreground cursor-pointer">{request.personphonenumber}</a>
                  </div>
                </td>
                <td className="p-4 align-middle">{getDisplayFormatedDate(request.dc)}</td>
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setSelectedRequest(request);
                        setIsModalOpen(true);
                      }}
                      className="inline-flex items-center justify-center rounded-md w-24 h-8 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-green-100 text-green-700"
                    >
                      Accepter
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedRequest(request);
                        setIsConfirmOpen(true);
                      }}
                      className="inline-flex items-center justify-center rounded-md w-24 h-8 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-red-100 text-red-700"
                    >
                      Refuser
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRequests.length === 0 && (
          <p className="text-center text-muted-foreground py-6">Aucune demande d'adhésion en attente.</p>
        )}
      </div>
      <ModalAcceptRequestToJoin 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        request={selectedRequest} 
        licenceTypes={licenceTypes} 
        roles={roles}
      />
      <CustomConfirm 
        isOpen={isConfirmOpen} 
        onCancel={() => setIsConfirmOpen(false)} 
        onConfirm={() => handleReject(selectedRequest.id)} 
        message="Êtes-vous sûr de vouloir refuser cette demande ?"
      />
    </div>
  );
});

RequestToJoinList.displayName = 'RequestToJoinList';

export default RequestToJoinList;