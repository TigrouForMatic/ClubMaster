import UserInSideBarModal from './UserModal/User';
import CompanyInSideBarModal from './UserModal/Company';
import SettingsInSideBarModal from './UserModal/Settings';
import HelpInSideBarModal from './UserModal/Help';
import ThemeInSideBarModal from './UserModal/Theme';
import DisconnectInSideBarModal from './UserModal/Disconnect';
import '../../styles/navbarStyles.css';

function UserModal() {
  return (
    <div className="modal">
      <div className="modal-content">
        
        <UserInSideBarModal />
      
        <CompanyInSideBarModal />
        
        <SettingsInSideBarModal />
        
        <HelpInSideBarModal />
        
        <ThemeInSideBarModal />
        
        <DisconnectInSideBarModal />
        
      </div>
    </div>
  );
}

export default UserModal;