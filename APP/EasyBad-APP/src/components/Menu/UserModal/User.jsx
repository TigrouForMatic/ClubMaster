import { User } from 'iconoir-react';
import '../../../styles/navbarStyles.css';

function UserInSideBarModal() {
   return(
    <div className='modal-item'>
        <User className='icon--detail__modal' />Nom utilisateur
    </div>
   );
}

export default UserInSideBarModal;