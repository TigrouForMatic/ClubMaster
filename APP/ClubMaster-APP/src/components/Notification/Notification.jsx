import React from 'react';
import { Xmark } from 'iconoir-react';

const Notification = ({ label, time, handleDeleteNotification }) => {
  return (
    <div className="relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-lg animate-in slide-in-from-right-5">
      <div className="flex flex-1 items-start gap-4">
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">{label}</p>
          <p className="text-sm text-gray-500">{time}</p>
        </div>
      </div>
      <button
        onClick={handleDeleteNotification}
        className="absolute right-2 top-2 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      >
        <Xmark className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Notification;
