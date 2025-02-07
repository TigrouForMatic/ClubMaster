import React from "react";
import { EditPencil, Trash } from 'iconoir-react';

const RoleList = React.memo(({ roles }) => (
  <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold tracking-tight">Rôles</h2>
      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-black text-white hover:bg-gray-800 h-10 px-4 py-2">
        Ajouter
      </button>
    </div>

    <div className="relative w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Label</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Niveau</th>
            <th className="h-12 w-[100px] px-4"></th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {roles.map(role => (
            <tr key={role.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td className="p-4 align-middle">{role.label}</td>
              <td className="p-4 align-middle">{role.level}</td>
              <td className="p-4 align-middle">
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center justify-center rounded-md w-8 h-8 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-muted">
                    <EditPencil className="h-4 w-4" />
                  </button>
                  <button className="inline-flex items-center justify-center rounded-md w-8 h-8 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-red-100 text-red-700">
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
));

export default RoleList;