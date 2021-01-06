import './css/LeftChat.css';
import CircleIMG from './CircleIMG';
import menuIcon from './menu.svg';
import FriendChat from './FriendChat';
import BtnWithMenu from './BtnWithMenu';
import {serverHost} from '../host';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SearchBar from './SearchBar';

function LeftChat(props)
{
    const user = useSelector(state => state.login);
    const socket = useSelector(state => state.socket);
    const [fotoProfilo, setFotoProfilo] = useState('none');
    const [friendChatArr, setFriendChatArr] = useState([]);

    const logout = () =>
    {
        socket.emit('disconnetti', {});
        fetch(serverHost + '/logout', {method: 'GET', credentials: 'include'});
        setTimeout(() => {
            props.logHandle();
        }, 300);
    }

    useEffect(() => {
        fetch(serverHost + `/foto/${user}.jpg`)
        .then(res => res.blob())
        .then(img => setFotoProfilo(URL.createObjectURL(img)));

        setTimeout(() => {
            getChat();
        }, 100);

        socket.on('userSerched', data => {
            let obj;
            const arrObj = [];

            data.forEach(el => {
                obj = {};
                obj.username = el;
                obj.last = "";
                obj.is_letto = true;
                obj.non_letti = 0;
                obj.data = null;
                arrObj.push(obj);
            });

            setFriendChatArr(arrObj);
        });

        document.getElementById('type_mex_input').addEventListener('keyup', e => {
            if(e.keyCode === 13 && e.target.value)
            {
                getChat();
            }
        });

        socket.on('newMexFromAnyFriend', () => {
            getChat();
        });

        socket.on('setchat', chats => {
            console.log('ciao');
            console.log('cha', chats);
            setFriendChatArr(chats);
        });
    }, []);

    const notSearching = () => {
        getChat();
    }

    const getChat = () => {
        socket.emit('getchat', {});
    }

    return(
        <div className="LeftChat noselect">
            <div className="topLeftChat">
                <CircleIMG width="40px" img={fotoProfilo} nome={user}/>
                <div className="topLeftChatRigth">
                    <BtnWithMenu icon={menuIcon} arrMenu={[['Profilo'], ['Disconnetti', logout]]}/>
                </div>
            </div>

            <div className="searchLeftChat">
                <SearchBar handleEmpty={notSearching}/>
            </div>

            <div className="friendsLeftChat">
                {
                    friendChatArr.map(el => <FriendChat key={el.username} username={el.username} lastMex={el.last} isLetto={el.is_letto} nonLetti={el.non_letti} ora={el.data}/>)
                } 
            </div>
        </div>
    );
}

export default LeftChat;
