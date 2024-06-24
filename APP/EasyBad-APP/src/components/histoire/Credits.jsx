import React, {useState} from 'react';
import Chloe from '../../assets/photos/photo_chloe.jpg';
import Chloe_fun from '../../assets/photos/photo_chloe_fun.jpg';
import Jules from '../../assets/photos/photo_jules.jpg';
import Jules_fun from '../../assets/photos/photo_fun_jules.jpg';
import Ewan from '../../assets/photos/photo_ewan.jpg';
import Ewan_fun from '../../assets/photos/photo_cleo_fun.jpg';
import Marianna from '../../assets/photos/photo_mariachi.png';
import Marianna_fun from '../../assets/photos/photo_mariachi_fun.png';
import Corentin from '../../assets/photos/photo_corentin.jpg';
import Corentin_fun from '../../assets/photos/photo_corentin_fun.jpg';
import "../../App.css"


const Credits = ({ showCredit, setShowCredit }) => {

    const [fun, setFun] = useState(false);

  return (
    <div className='blockCredit'>
        {!fun && 
            <div>
                <img src={Chloe} alt="photo Chloe"  className='photo'/>
                <img src={Jules} alt="photo Jules" className='photo'/>
                <img src={Ewan} alt="photo Ewan" className='photo'/>
                <img src={Marianna} alt="photo Marianna" className='photo'/>
                <img src={Corentin} alt="photo Corentin" className='photo'/>
            </div>
        
        }
        {fun && 
            <div>   
                <img src={Chloe_fun} alt="photo chloe fun" className='photo'/>
                <img src={Jules_fun} alt="photo Jules fun" className='photo'/>
                <img src={Ewan_fun} alt="photo Ewan fun" className='photo'/>
                <img src={Marianna_fun} alt="photo Marianna fun" className='photo' />
                <img src={Corentin_fun} alt="photo Corentin fun" className='photo'/>
            </div>
        }
        <button onClick={() => setShowCredit(!showCredit)}>Retour</button>
        <button onClick={() => setFun(!fun)} style={{margin: '10px'}}>Photo fun !</button>
    </div>
  );
};

export default Credits;
