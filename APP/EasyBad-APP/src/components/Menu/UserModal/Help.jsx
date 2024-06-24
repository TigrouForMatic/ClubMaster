import '../../../styles/navbarStyles.css';
import { HelpCircle } from 'iconoir-react';


function HelpInSideBarModal (){
    return(
    <div className="modal-item">
        <HelpCircle className='icon--detail__modal' />
       Aide
    </div>
    );
}

export default HelpInSideBarModal;