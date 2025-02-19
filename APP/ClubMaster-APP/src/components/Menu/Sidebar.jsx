import { NavLink } from 'react-router-dom';
import useStore from '../../store/store';
import { Menu, User, Home, ArcheryMatch, Calendar, Shop } from 'iconoir-react';
import ClubIcon from './ClubIcon';
import { useEffect } from 'react';

const menuItems = [
  { to: "/", icon: Home, text: "News" },
  { to: "/match", icon: ArcheryMatch, text: "Matchs" },
  { to: "/calendar", icon: Calendar, text: "Calendrier" },
  { to: "/shop", icon: Shop, text: "Shop" },
];

function Sidebar({ onClose }) {
  const { currentUserRoles, userClubs } = useStore();
  const isHighLevel = currentUserRoles.some(r => r.level >= 3);
  const isPro = userClubs.some(c => c.personmoralplan === 'Pro');

  return (
    <div className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-lg dark:bg-gray-900">
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <h2 className="text-lg font-semibold">ClubMaster</h2>
        <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {menuItems.map(({ to, icon: Icon, text }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 ${
                isActive ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100' : ''
              }`
            }
          >
            <Icon className="h-7 w-7 ml-1" />
            <span>{text}</span>
          </NavLink>
        ))}

        {isHighLevel && isPro && (
          <NavLink
            to="/manage"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 ${
                isActive ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100' : ''
              }`
            }
          >
            <ClubIcon className="h-5 w-5" />
            <span>Gestion</span>
          </NavLink>
        )}
      </nav>

      <div className="border-t p-4">
        <NavLink
          to="/user"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 ${
              isActive ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100' : ''
            }`
          }
        >
          <User className="h-7 w-7 ml-1" />
          <span>Profil</span>
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;