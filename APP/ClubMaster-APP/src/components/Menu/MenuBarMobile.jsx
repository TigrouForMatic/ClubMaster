import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Home, ArcheryMatch, Calendar, Shop } from 'iconoir-react';
import useStore from '../../store/store';

function MenuBarMobile() {
  const { currentUserRoles, userClubs } = useStore();
  const isHighLevel = currentUserRoles.some(r => r.level >= 3);
  const isPro = userClubs.some(c => c.planlabel === 'Pro');

  const menuItems = [
    { to: "/", icon: Home, text: "News" },
    { to: "/match", icon: ArcheryMatch, text: "Matchs" },
    { to: "/calendar", icon: Calendar, text: "Calendrier" },
    { to: "/shop", icon: Shop, text: "Shop" },
    { to: "/user", icon: User, text: "Profil" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
      <nav className="flex items-center justify-around px-2 py-3">
        {menuItems.map(({ to, icon: Icon, text }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 min-w-[4rem] px-2 py-1 rounded-lg transition-colors ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{text}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default MenuBarMobile;