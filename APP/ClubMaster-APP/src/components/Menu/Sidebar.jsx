import { NavLink } from 'react-router-dom';
import '../../styles/navbarStyles.css';
import { Menu, User, Home, ArcheryMatch, Calendar, Shop } from 'iconoir-react';

function Sidebar({ onClose }) {

  return (
    <div className="sidebar">
      <div className="menu-icon" onClick={onClose}>
        <Menu className='icon-detail' />
      </div>
      <hr />
      <div className='menu-items'>
        <NavLink to="/" exact activeClassName="active-link">
          <div className="menu-item">
            <Home className='icon-detail' />
            <p>News</p>
          </div>
        </NavLink>
        <NavLink to="/match" activeClassName="active-link">
          <div className="menu-item">
            <ArcheryMatch className='icon-detail' />
            <p>Matchs</p>
          </div>
        </NavLink>
        <NavLink to="/calendar" activeClassName="active-link">
          <div className="menu-item">
            <Calendar className='icon-detail' />
            <p>Calendrier</p>
          </div>
        </NavLink>
        {/* <NavLink to="/chat" className="menu-item" activeClassName="active-link">
          <ChatBubble className='icon-detail' />
          <p>Chat</p>
        </NavLink> */}
        <NavLink to="/shop" activeClassName="active-link">
          <div className="menu-item">
            <Shop className='icon-detail' />
            <p>Shop</p>
          </div>
        </NavLink>
      </div>
      <hr />
      <div className="menu-profileIcon" >
        <hr />
        <NavLink to="/user" activeClassName="active-link">
          <div className="menu-item">
            <User className='icon-detail' />
            <p>User</p>
          </div>
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
