import { useState } from 'react';
import './css/CircleIMG.css';

function CircleIMG(props)
{
    const [charDisplay, setCharDisplay] = useState('none');
    const halfPX = strPX => {
        const len = strPX.length;
        let onlyNumber = "";

        for(let i=0; i<len; i++)
        {
            if(strPX[i] === 'p')
                break;

            onlyNumber += strPX[i];
        }

        return (Number(onlyNumber)/2) + "px";
    }

    function changeDisplay(e) {
        if(props.img !== 'none')
        {
            setCharDisplay('block');
            e.target.style.display = 'none';
        }
    }

    return(
        <button className="CircleIMG" style={{width: props.width, height: props.width, fontSize: halfPX(props.width)}}>
            <p style={{margin: "0", display: charDisplay}}>{props.nome.charAt(0).toUpperCase()}</p>
            <img className="circleImg" src={props.img} onError={(e) => changeDisplay(e)}/>
        </button>
    );
}

export default CircleIMG;