import '../../../styles/navbarStyles.css';
import { Settings } from 'iconoir-react';


function SettingsInSideBarModal (){
    return(
    <div className="modal-item">
        <Settings className='icon--detail__modal' />
        Paramètres
    </div>
    );
}

export default SettingsInSideBarModal;