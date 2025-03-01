import { Menu, User, Home, ArcheryMatch, Calendar, Shop } from 'iconoir-react';
import ClubIcon from './ClubIcon';
import useStore from '../../store/store';
import { NavLink } from 'react-router-dom';

function SidebarSmall({ onMenuClick, isSmall }) {
  const { currentUserRoles, userClubs } = useStore();
  const isHighLevel = currentUserRoles.some(r => r.level >= 3);
  const isPro = userClubs.some(c => c.planlabel === 'Pro');

  const menuItems = [
    { to: "/", icon: Home },
    { to: "/match", icon: ArcheryMatch },
    { to: "/calendar", icon: Calendar },
    { to: "/shop", icon: Shop },
  ];

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

      <nav className="flex-1 space-y-1 px-2 py-4">
        {menuItems.map(({ to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => `flex items-center justify-center rounded-lg p-2 transition-colors ${
              isActive ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}>
            <Icon className="h-7 w-14" />
          </NavLink>
        ))}

        {isHighLevel && isPro && (
          <NavLink to="/manage" className={({ isActive }) => `flex items-center justify-center rounded-lg p-2 transition-colors ${
            isActive ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          }`}>
            <ClubIcon className="h-5 w-5" />
          </NavLink>
        )}
      </nav>

      <div className="border-t py-4">
        <NavLink to="/user" className={({ isActive }) => `flex items-center justify-center rounded-lg p-2 transition-colors ${
          isActive ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
        }`}>
          <User className="h-7 w-7" />
        </NavLink>
      </div>
    </div>
  );
}

export default SidebarSmall;
