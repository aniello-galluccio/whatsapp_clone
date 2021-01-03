import { useSelector } from 'react-redux';
import './css/TypeMex.css';

function TypeMex(props)
{
    const socket = useSelector(state => state.socket);

    const sendMex = e => {
        if(e.keyCode === 13 && e.target.value)
        {
            socket.emit('sendMex', {
                chatId: props.chatId,
                mex: e.target.value,
                dest: props.dest
            });
            props.handleSend(e.target.value);
            e.target.value = "";
            writeEvent(e);
        }
    }

    const writeEvent = e => {
        socket.emit('write', {
            dest : props.dest,
            text: e.target.value
        });
    }

    return(
        <div className="TypeMex">
            <div className="typemexContainer">
                <input type="text" className="typeMexInput" id="type_mex_input" autocomplete="off" placeholder="Scrivi un messaggio" onKeyUp={e => sendMex(e)} onChange={e => writeEvent(e)}></input>
            </div>
        </div>
    );
}

export default TypeMex;