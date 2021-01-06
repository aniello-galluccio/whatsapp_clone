import './css/FriendChat.css';
import CircleIMG from './CircleIMG';
import { useEffect, useState } from 'react';
import {serverHost} from '../host';
import { useDispatch, useSelector } from 'react-redux';
import { chatAction } from '../redux/actions/chat';

function FriendChat(props)
{
    const [bgColor, setBgColor] = useState('transparent');
    const [lastMexColor, setLastMexColor] = useState('#878787');
    const [displayNewMex, setDisplayNewMex] = useState('none');
    const [foto, setFoto] = useState('none');
    const [isLetto, setIsLetto] = useState(props.isLetto);
    const currentChat = useSelector(state => state.chat);
    const [mouseOverColor, setMouseOverColor] = useState('rgb(241, 241, 241)');
    const [mouseOutColor, setMouseOutColor] = useState('transparent');
    const socket = useSelector(state => state.socket);

    const dispatch = useDispatch();

    useEffect(() => {
        if(isLetto)
        {
            setLastMexColor('#878787');
        }
        else
        {
            setLastMexColor('#303030F5');
        }
    }, [isLetto]);

    useEffect(() => {
        if(props.nonLetti > 0)
        {
            setDisplayNewMex('flex');
        }
        else
        {
            setDisplayNewMex('none');
        }
    }, [props.nonLetti]);

    useEffect(() => {
        if(currentChat === props.username)
        {
            setBgColor('rgb(229, 229, 229)');
            setMouseOverColor('rgb(229, 229, 229)')
            setMouseOutColor('rgb(229, 229, 229)');
        }
        else
        {
            setBgColor('transparent');
            setMouseOverColor('rgb(241, 241, 241)');
            setMouseOutColor('transparent');
        }
    }, [currentChat])

    useEffect(() => {
        fetch(serverHost + `/foto/${props.username}.jpg`)
        .then(res => res.blob())
        .then(img => setFoto(URL.createObjectURL(img)));
    }, []);

    const handleClick = () => {
        dispatch(chatAction('cambio', props.username));

        setIsLetto(true);

        socket.emit('setletto', props.username);
        socket.emit('getchat', {});
    }

    const createOra = date => {
        if(!date)
        {
            return "";
        }
        const data = new Date(date);
        const dateOfNow = new Date();
        const mese = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

        if(data.getMonth() === dateOfNow.getMonth() && data.getDate() === dateOfNow.getDate() && data.getFullYear() === dateOfNow.getFullYear())
        {
            return insertZero(data.getHours()) + ":" + insertZero(data.getMinutes());
        }
        else
        {
            return data.getDate() + ' ' + mese[data.getMonth()];
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

    return(
        <div className="FriendChat" onClick={() => handleClick()} style={{backgroundColor: bgColor}} onMouseOver={() => setBgColor(mouseOverColor)} onMouseOut={() => setBgColor(mouseOutColor)}>
            <div className="friendIMG"><CircleIMG width="49px" img={foto} nome={props.username}/></div>
            <div className="friendChatInfo">
                <div className="friendChatInfoMex">
                    <p>{props.username}</p>
                    <p style={{color: lastMexColor}}>{props.lastMex}</p>
                </div>

                <div className="friendChatRigth">
                    <p className="friendChatHour">{createOra(props.ora)}</p>
                    <div className="friendNewMex" style={{display: displayNewMex}}><p className="friendNewMexNumber">{props.nonLetti}</p></div>
                </div>
            </div>
        </div>
    );
}

export default FriendChat;