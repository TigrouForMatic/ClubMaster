import React, { useState, useMemo, useEffect } from "react";
import { getDisplayFormatedDate } from "../../js/date";
import Select from 'react-select';
import UserImage from "../UserImage";
import CustomConfirm from "../CustomConfirm";
import ModalAcceptRequestToJoin from "../Modale/ModalAcceptRequestToJoin";
import api from '../../js/App/Api';
import useStore from '../../store/store';

const RequestToJoinList = React.memo(({ selectedClubId, licenceTypes, roles }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState({ value: 'pending', label: 'En attente' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { updateItem, requestToJoinAdmin } = useStore();
  
  const statusOptions = [
    { value: 'accepted', label: 'Accepté', color: '#22c55e' },
    { value: 'pending', label: 'En attente', color: '#f97316' },
    { value: 'rejected', label: 'Rejetée', color: '#ef4444' }
  ];

  const filteredRequests = useMemo(() => {
    return requestToJoinAdmin
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
  }, [requestToJoinAdmin, searchQuery, selectedClubId, statusFilter]);

  const handleReject = async (requestId) => {
    try {
      const response = await api.put(`/requestToJoin/${requestId}`, { status: 'rejected' });
      const requestRejected = {
        ...selectedRequest,
        status: response.status,
        dm: response.dm
      };

      updateItem('requestToJoinAdmin', requestId, requestRejected);
      
      setIsConfirmOpen(false);
    } catch (error) {
      console.error('Erreur lors du rejet de la demande:', error);
    }
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
              }),
              control: (styles) => ({
                ...styles,
                color: '#f97316'
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
                <td className="p-4 align-start text-left">
                  <div className="flex flex-col gap-3">
                    <a href={`mailto:${request.personemailaddress}`} className="text-sm cursor-pointer flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                      </svg>
                      {request.personemailaddress}
                    </a>
                    <a href={`tel:${request.personphonenumber}`} className="text-sm text-muted-foreground cursor-pointer flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                      </svg>
                      {request.personphonenumber}
                    </a>
                  </div>
                </td>
                <td className="p-4 align-start text-left">{getDisplayFormatedDate(request.dc)}</td>
                <td className="p-4 align-middle">
                  {request.status === 'pending' ? (
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
                  ) : (
                    <div className="flex flex-col gap-1">
                      {request.status === 'accepted' ? (
                        <>
                          <span className="text-sm text-green-600">Accepté</span>
                          <span className="text-sm text-muted-foreground">Le {getDisplayFormatedDate(request.dm)}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm text-red-600">Rejeté</span>
                          <span className="text-sm text-muted-foreground">Le {getDisplayFormatedDate(request.dm)}</span>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRequests.length === 0 && (
          <>
            {statusFilter.value === 'accepted' && (
              <p className="text-center text-muted-foreground py-6">Aucune demande d'adhésion acceptée.</p>
            )}
          {statusFilter.value === 'pending' && (
            <p className="text-center text-muted-foreground py-6">Aucune demande d'adhésion en attente.</p>
          )}
          {statusFilter.value === 'rejected' && (
              <p className="text-center text-muted-foreground py-6">Aucune demande d'adhésion rejetée.</p>
            )}
          </>
        )}
      </div>
      <ModalAcceptRequestToJoin 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        request={selectedRequest} 
        licenceTypes={licenceTypes} 
        roles={roles}
        selectedClubId={selectedClubId}
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