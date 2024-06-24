import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/navbarStyles.css';
import { Menu, User, Home, Activity, ChatBubble, Contactless, CloudDownload } from 'iconoir-react';
import UserModal from './UserModal';

function Sidebar({ onClose }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const profileIconRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        modalRef.current && !modalRef.current.contains(event.target) &&
        profileIconRef.current && !profileIconRef.current.contains(event.target)
      ) {
        setIsModalOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, profileIconRef]);

  const handleProfileIconClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  // return (
  //   <div className="sidebar">
  //     <div className="menu-icon" onClick={onClose}> 
  //       <Menu className='icon-detail' />
  //     </div>
  //     <hr />
  //     <div className='menu-items'>
  //       <div className="menu-item">
  //         <Home className='icon-detail' />
  //         <p>Home</p>
  //       </div>
  //       <div className="menu-item">
  //         <Activity className='icon-detail' />
  //         <p>Activity list</p>
  //       </div>
  //       <div className="menu-item">
  //         <ChatBubble className='icon-detail' />
  //         <p>Chat</p>
  //       </div>
  //       <div className="menu-item">
  //         <Contactless className='icon-detail' />
  //         <p>Contact</p>
  //       </div>
  //       <div className="menu-item">
  //         <CloudDownload className='icon-detail' />
  //         <p>Export</p>
  //       </div>
  //     </div>
  //     <hr />
  //     <div
  //       ref={profileIconRef}
  //       className={`menu-profileIcon ${isModalOpen ? 'active' : ''}`}
  //       onClick={handleProfileIconClick}
  //     >
  //       <hr />
  //       <div className="menu-icon">
  //         <User className='icon-detail' />
  //       </div>
  //     </div>
  //     {isModalOpen && <div ref={modalRef}><UserModal /></div>}
  //   </div>
  // );
  return (
    <div className="sidebar">
      <div className="menu-icon" onClick={onClose}>
        <Menu className='icon-detail' />
      </div>
      <hr />
      <div className='menu-items'>
        <NavLink to="/" exact className="menu-item" activeClassName="active-link">
          <Home className='icon-detail' />
          <p>Home</p>
        </NavLink>
        <NavLink to="/activity" className="menu-item" activeClassName="active-link">
          <Activity className='icon-detail' />
          <p>Activity list</p>
        </NavLink>
        <NavLink to="/chat" className="menu-item" activeClassName="active-link">
          <ChatBubble className='icon-detail' />
          <p>Chat</p>
        </NavLink>
        <NavLink to="/contact" className="menu-item" activeClassName="active-link">
          <Contactless className='icon-detail' />
          <p>Contact</p>
        </NavLink>
        <NavLink to="/export" className="menu-item" activeClassName="active-link">
          <CloudDownload className='icon-detail' />
          <p>Export</p>
        </NavLink>
      </div>
      <hr />
      <div className="menu-profileIcon" onClick={handleProfileIconClick}>
        <hr />
        <div className="menu-icon">
          <User className='icon-detail' />
        </div>
      </div>
      <UserModal /> {/* Vous pouvez rendre le modal toujours visible ou utiliser un état local pour le contrôler */}
    </div>
  );
}

export default Sidebar;
