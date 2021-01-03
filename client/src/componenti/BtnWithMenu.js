import { useState } from 'react';
import './css/BtnWithMenu.css';

function BtnWithMenu(props)
{
    const [isOpen, setIsOpen] = useState(false);
    const [btnBG, setBtnBG] = useState('transparent');
    const [dropDownDisplay, setDropDownDisplay] = useState('none');

    const changeBtnBG = () => {
        if(isOpen)
        {
            setBtnBG('transparent');
            setDropDownDisplay('none');
        }
        else
        {
            setBtnBG('#d8d8d8');
            setDropDownDisplay('block');
        }

        setIsOpen(!isOpen);
    }

    return(
        <button className="BtnWithMenu" style={{backgroundColor: btnBG}} onClick={() => changeBtnBG()}>
            <img className="btnWithMenuIcon" src={props.icon}></img>
            <div className="dropDownMenu" style={{display: dropDownDisplay}}>
                {
                    props.arrMenu.map(el => <p onClick={() => el[1]()}>{el[0]}</p>)
                }
            </div>
        </button>
    );
}

export default BtnWithMenu;