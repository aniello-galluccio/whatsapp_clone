import './App.css';
import './LoginPage.css';
import LeftChat from './componenti/LeftChat';
import RigthChat from './componenti/RigthChat';
import LoginBTN from './componenti/LoginBTN';
import { useEffect, useState } from 'react';
import userIcon from './componenti/user.svg';
import passIcon from './componenti/lock.svg';
import InputLog from './componenti/InputLog';
import FotoInput from './componenti/FotoInput';
import fotoprv from './componenti/avatar.png';
import {serverHost} from './host';
import {useDispatch, useSelector} from 'react-redux';
import {loginAction} from './redux/actions/login';
import {socketAction} from './redux/actions/socket';
import socketIOClient from "socket.io-client";

function App() {
  const user = useSelector(state => state.login);
  const socket = useSelector(state => state.socket);
  const btnLogin = useSelector(state => state.btnLogin);
  const [randomStr, setRandomStr] = useState('none');

  const dispatch = useDispatch();

  const isLoggedUser = () => {
    fetch(serverHost + '/islog', {method: 'GET', credentials: 'include'})
    .then(res => res.text())
    .then(res => dispatch(loginAction('change', res)));
  }

  useEffect(() => {
    isLoggedUser();
  }, [isLoggedUser]);

  useEffect(() => {
    if(user !== 'none' && socket !== 'none')
    {
      socket.emit('iamOnline', user);
    }
  }, [user, socket]);

  useEffect(() => {
    dispatch(socketAction('set', socketIOClient(serverHost)));
  }, []);

  const randomString = length => {
    let result = '';
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = length; i > 0; --i) 
      result += chars[Math.floor(Math.random() * chars.length)];

    return result;
  }

  const getBlob = blob => {
    const rand = randomString(32);
    setRandomStr(rand);
    const formData = new FormData();
    formData.append('blob', blob, rand + '.jpg');
    fetch(serverHost + '/foto', {
      method: 'POST',
      body: formData
    });
  }

  if(user !== 'none')
  {
    return (
      <div className="App">
        <div className="appBG"></div>
        
        <div className="appContainer">
          <div className="marginDiv"></div>
          <div className="whatsappDiv">
            <div className="leftChat">
              <LeftChat logHandle={isLoggedUser}/>
            </div>
  
            <div className="rigthChat">
              <RigthChat />
            </div>
          </div>
          <div className="marginDiv"></div>
        </div>
      </div>
    );
  }
  else
  {
    return(
      <div className="LoginPage">
        <div className="loginLeftIMG">
          <div className="loginLeft">
            <div className="loginBtnContainer">
              <LoginBTN text="LOGIN"/>
              <div className="signinBTN">
                <LoginBTN text="SIGN IN"/>
              </div>
            </div>
          </div>
          
          <div className="alert_mobile">Dispositivo troppo piccolo per eseguire quest'app</div>
        </div>

        <div className="loginRigth">
          <form className="LoginRigthContainer" method="POST" action={(btnLogin === 'LOGIN')? serverHost + '/login' : serverHost + '/signin'}>
            {
              (btnLogin==="SIGN IN")? 
              <div>
                <FotoInput foto={fotoprv} handle={getBlob}/>
                <input type="text" style={{display: 'none'}} value={randomStr} name="random"></input>
              </div> :
              <div></div>
            }
            <InputLog text="Username" icon={userIcon} type="text" name="user"/>
            <InputLog text="Password" icon={passIcon} type="password" name="pass"/>
            <button type="submit" className="loginRigthSubmit">{btnLogin}</button>
          </form>
        </div>
        
        <div className="alert_mobile">Dispositivo troppo piccolo per eseguire quest'app</div>
      </div>
    );
  }
}

export default App;
