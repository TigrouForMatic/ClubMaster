import '../../../styles/navbarStyles.css';
import { SystemShut } from 'iconoir-react';


function DisconnectInSideBarModal (){
    return(
    <div className="modal-item disconnect">
        <SystemShut className='icon--detail__modal' />
       Déconnexion
    </div>
    );
}

export default DisconnectInSideBarModal;