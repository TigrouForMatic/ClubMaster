import React from "react";

const ClubList = React.memo(({ clubs, selectedClubId, onClubSelect }) => (
  <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold tracking-tight">Clubs</h2>
    </div>

    <div className="relative w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nom du club</th>
            <th className="h-12 w-[100px] px-4"></th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {clubs.map(club => (
            <tr 
              key={club.id} 
              onClick={() => onClubSelect(club.id)}
              className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer ${
                selectedClubId === club.id ? 'bg-muted' : ''
              }`}
            >
              <td className="p-4 align-middle">{club.label}</td>
              <td className="p-4 align-middle">
                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  selectedClubId === club.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  {selectedClubId === club.id ? 'Sélectionné' : 'Choisir'}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {clubs.length === 0 && (
        <p className="text-center text-muted-foreground py-6">Aucun club disponible.</p>
      )}
    </div>
  </div>
));

export default ClubList;