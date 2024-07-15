import '../../../styles/navbarStyles.css';
import { SystemShut } from 'iconoir-react';
import useStore from '../../../store/store';

function DisconnectInSideBarModal() {

    const setShowApp = useStore((state) => state.setShowApp);
    const setItems = useStore((state) => state.setItems);

    const handleDisconnect = () => {
        localStorage.setItem('token', null);
        setItems('currentUser',null);
        setItems('login',null);
        setShowApp();
    };

    return (
        <div className="modal-item disconnect" onClick={handleDisconnect}>
            <SystemShut className='icon--detail__modal' />
            Déconnexion
        </div>
    );
}

export default DisconnectInSideBarModal;