import './css/RigthChat.css';
import CircleIMG from './CircleIMG';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {serverHost} from '../host';
import Messaggio from './Messaggio';
import TypeMex from './TypeMex';

function RigthChat(){
    const [introDisp, setIntroDisp] = useState('flex');
    const [chatDivDisp, setChatDivDisp] = useState('none');
    const [fotoProfilo, setFotoProfilo] = useState('none');
    const chat = useSelector(state => state.chat);
    const socket = useSelector(state => state.socket);
    const myName = useSelector(state => state.login);
    const [lastAccess, setLastAccess] = useState(null);
    const [chatId, setChatId] = useState('none');
    const [messaggi, setMessaggi] = useState([]);
    const [scrollBtnDisp, setScrollBtnDisp] = useState('none');

    const getMex = chatId => {
        if(chatId !== 'none')
        {
            socket.emit('getmex', chatId);
        }
    }

    useEffect(() => {
        if(chat !== 'none')
        {
            setIntroDisp('none');
            setChatDivDisp('flex');
            document.getElementById('bottom_chat').click();

            //chiamata per foto
            fetch(serverHost + `/foto/${chat}.jpg`)
            .then(res => res.blob())
            .then(img => setFotoProfilo(URL.createObjectURL(img)));

            //constrollo se è online
            socket.emit('getLastAccess', chat);

            socket.on('chatOffline', () => {
                socket.emit('getLastAccess', chat);
            });

            socket.on('scrivendo', data => {
                if(data)
                {
                    setLastAccess('sta scrivendo...');
                }
                else
                {
                    socket.emit('getLastAccess', chat);
                }
            });
        }
        else
        {
            setChatDivDisp('none');
            setIntroDisp('flex');
        }

        //chiamata creazione chat se non esiste
        fetch(serverHost + '/create_chat', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                users: [chat]
            })
        })
        .then(res => res.text())
        .then(res => {
            setChatId(res);
            getMex(res);
        });
    }, [chat]);

    useEffect(() => {
        socket.on('newMex', () => {
            getMex(chatId);
        });
    }, [chatId]);

    useEffect(() => {
        socket.on('lastAccess', data => {
            setLastAccess(data.lastAccess);
        });
        socket.on('setmex', data => {
            setMessaggi(data);
        });
    }, []);

    const lastAccessText = () => {
        if(lastAccess === 'online' || lastAccess === 'sta scrivendo...')
        {
            return lastAccess;
        }
        else if(!lastAccess)
        {
            return "";
        }
        else
        {
            const data = new Date(lastAccess);
            const anno = data.getFullYear();
            const mese = data.getMonth();
            const giorno = data.getDate();

            const dateOfNow = new Date();
            const dateOfNowYear = dateOfNow.getFullYear();
            const dateOfNowMonth = dateOfNow.getMonth();
            const dateOfNowDay = dateOfNow.getDate();

            if(anno === dateOfNowYear && mese === dateOfNowMonth && giorno === dateOfNowDay)
            {
                return 'ultimo accesso oggi alle ' + insertZero(data.getHours()) + ':' + insertZero(data.getMinutes());
            }
            else
            {
                return 'ultimo accesso il ' + insertZero(giorno) + '/' + insertZero(mese+1) + '/' + anno + ' alle ' + insertZero(data.getHours()) + ':' + insertZero(data.getMinutes());
            }
        }
    }

    //inserisce uno zero se il numero è minore di 10
    const insertZero = number => {
        let strNum = String(number);
        if(number < 10)
        {
            strNum = '0' + number;
        }

        return strNum;
    }

    const onSend = (testo) => {
        const mexClone = [...messaggi];
        const mexObj = {
            testo: testo,
            _id: Date.now(),
            mittente: myName,
            data_ora: Date.now()
        }

        mexClone.push(mexObj);
        setMessaggi(mexClone);
    }

    const onScrolling = e => {
        if( (e.target.scrollTop + 100) >= (e.target.scrollHeight - e.target.offsetHeight))
        {
            setScrollBtnDisp('none');
        }
        else
        {
            setScrollBtnDisp('block');
        }
    }

    useEffect(() => {
        setTimeout(() => {
            document.getElementById('bottom_chat').click();
        }, 10)
    }, [messaggi]);

    return(
        <div className="RigthChat">
            <div className="rigthChatIntro" style={{display: introDisp}}>
                <div className="rigthChatIntroDiv">
                    <div className="rigthChatIntroContainer">
                        <img src="https://web.whatsapp.com/img/intro-connection-light_c98cc75f2aa905314d74375a975d2cf2.jpg"></img>
                        <p className="rigthChatIntroTitle">Clone By Aniello Galluccio</p>
                        <p>WhatsApp Web Clone, realizzato con React e Node JS.</p>
                        <p>A breve realizzerò anche la versione mobile.</p>
                        <div className="rigthChatIntroContainerFooter">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 18" width="21" height="18"><path fill="rgba(0, 0, 0, 0.45)" d="M10.426 14.235a.767.767 0 0 1-.765-.765c0-.421.344-.765.765-.765s.765.344.765.765-.344.765-.765.765zM4.309 3.529h12.235v8.412H4.309V3.529zm12.235 9.942c.841 0 1.522-.688 1.522-1.529l.008-8.412c0-.842-.689-1.53-1.53-1.53H4.309c-.841 0-1.53.688-1.53 1.529v8.412c0 .841.688 1.529 1.529 1.529H1.25c0 .842.688 1.53 1.529 1.53h15.294c.841 0 1.529-.688 1.529-1.529h-3.058z"></path></svg>
                            <p className="rigthChatIntroContainerText">Puoi visualizzare il codice sorgente su <a href="https://github.com/aniello-galluccio/whatsapp_clone" target="_blank" style={{color: "rgb(7, 188, 76)", textDecoration: "none"}}>GitHub</a>.</p>
                        </div>
                    </div>
                </div>
                <div className="rigthChatIntroFooterColor"></div>
            </div>

            <div className="RigthChatContainer" style={{display: chatDivDisp}}>
                <div className="RigthChatContainerTop">
                    <div className="RigthChatContainerTopLeft">
                        <CircleIMG width="40px" img={fotoProfilo} nome={chat}/>
                        <div className="RigthChatContainerTopInfo">
                            <p className="RigthChatContainerTopUser">{chat}</p>
                            <p className="RigthChatContainerTopLast">{lastAccessText()}</p>
                        </div>
                    </div>

                    <div className="RigthChatContainerTopIcon">
                        
                    </div>
                </div>

                <div className="RigthChatMexContainer">
                    <div className="MexContainer" id="mex_container" onScroll={e => onScrolling(e)}>
                        <button id="bottom_chat" style={{display: "none"}} onClick={() => document.getElementById("fineMex").scrollIntoView(true)}></button>
                        {
                            messaggi.map(el => <Messaggio isMyMex={(el.mittente === myName)? true : false} text={el.testo} key={el._id} isLetto={el.is_letto} ora={el.data_ora}/>)
                        }
                        <div id="fineMex"></div>
                    </div>
                </div>

                <div className="RigthChatTypeMex">
                    <TypeMex chatId={chatId} handleSend={onSend} dest={chat}/>
                </div>

                <button id="bottom_chat" style={{display: scrollBtnDisp}} onClick={() => document.getElementById("fineMex").scrollIntoView(true)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 20" width="19" height="20"><path fill="rgb(152, 152, 152)" d="M3.8 6.7l5.7 5.7 5.7-5.7 1.6 1.6-7.3 7.2-7.3-7.2 1.6-1.6z"></path></svg></button>
            </div>
        </div>
    );
}

export default RigthChat;
