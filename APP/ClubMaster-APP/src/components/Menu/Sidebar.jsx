import { NavLink } from 'react-router-dom';
import useStore from '../../store/store';
import '../../styles/navbarStyles.css';
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
    <div className="sidebar">
      <div className="menu-icon" onClick={onClose}>
        <Menu className='icon-detail' />
      </div>
      <hr />
      <nav className='menu-items'>
        {menuItems.map(({ to, icon: Icon, text }) => (
          <NavLink key={to} to={to} exact={to === "/"} activeClassName="active-link">
            <div className="menu-item">
              <Icon className='icon-detail' />
              <p>{text}</p>
            </div>
          </NavLink>
        ))}
        {isHighLevel && isPro && (
          <NavLink to="/manage" activeClassName="active-link">
            <div className="menu-item">
              <ClubIcon className='icon-detail' />
            </div>
          </NavLink>
        )}
      </nav>
      <hr />
      <div className="menu-profileIcon">
        <hr />
        <NavLink to="/user" activeClassName="active-link">
          <div className="menu-item">
            <User className='icon-detail' />
            <p>Profil</p>
          </div>
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;