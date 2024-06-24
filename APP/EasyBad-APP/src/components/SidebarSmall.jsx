import { Menu } from 'iconoir-react';
import '../styles/navbarStyles.css';

function SidebarSmall({ onMenuClick, isSmall }) {
  return (
    <div className={`sidebar ${isSmall ? 'sidebarSmall' : ''}`}> 
      <div className="menu-icon menuSmall-icon" onClick={onMenuClick}>
        <Menu className='icon-detail' />
      </div>
    </div>
  );
}

export default SidebarSmall;
