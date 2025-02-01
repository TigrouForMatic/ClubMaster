import { Menu } from 'iconoir-react';

function SidebarSmall({ onMenuClick, isSmall }) {
  return (
    <div 
      className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-white shadow-lg dark:bg-gray-900 
        transform transition-all duration-300 ease-in-out ${
        isSmall ? 'w-16' : 'w-64 translate-x-64'
      }`}
    >
      <div className="flex h-16 items-center justify-center border-b">
        <button 
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
}

export default SidebarSmall;
