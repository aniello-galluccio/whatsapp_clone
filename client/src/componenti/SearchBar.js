import { useState } from 'react';
import './css/SearchBar.css';
import { useSelector } from 'react-redux';

function SearchBar(props) 
{
    const [bgColor, setBgColor] = useState('transparent');
    const [placeHolder, setPlaceHolder] = useState('Cerca per username');
    const socket = useSelector(state => state.socket);
    const user = useSelector(state => state.login);

    const handleFocus = () => {
        setBgColor('white');
        setPlaceHolder('');
    }

    const handleFocusOut = () => {
        setBgColor('transparent');
        setPlaceHolder('Cerca per username');
    }

    const searchUser = () => {
        const str = document.getElementById('searchbar_input').value;
        if(str) {
            socket.emit('searchUser', {
                search: str,
                reqUser: user
            });
        }
        else{
            props.handleEmpty();
        }
    }

    return(
        <div className="SearchBar" style={{backgroundColor: bgColor}}>
            <div className="searchbar_comp">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" id="searchbar_icon" onClick={() => document.getElementById('searchbar_input').focus()}><path fill="#8e8e8e" d="M15.009 13.805h-.636l-.22-.219a5.184 5.184 0 0 0 1.256-3.386 5.207 5.207 0 1 0-5.207 5.208 5.183 5.183 0 0 0 3.385-1.255l.221.22v.635l4.004 3.999 1.194-1.195-3.997-4.007zm-4.808 0a3.605 3.605 0 1 1 0-7.21 3.605 3.605 0 0 1 0 7.21z"></path></svg>
                <input type="text" placeholder={placeHolder} id="searchbar_input" onFocus={() => handleFocus()} onBlur={() => handleFocusOut()} onChange={() => searchUser()} autoComplete="off"></input>
            </div>
        </div>
    );
}

export default SearchBar;