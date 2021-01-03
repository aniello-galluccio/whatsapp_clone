import './css/InputLog.css';
import SvgColor from 'react-svg-color';
import { useState } from 'react';

function InputLog(props)
{
    const [color, setColor] = useState('#cecece');

    return(
        <div className="InputLog" style={{borderBottom: "1px solid " + color}}>
            <SvgColor 
                svg={props.icon} 
                width={35} 
                colors={[color]}   
            />
            <input className="inputLogText" type={props.type} name={props.name} placeholder={props.text} onFocus={() => setColor('#31afab')} onBlur={() => setColor('#cecece')} autoComplete="off"></input>
        </div>
    )
}

export default InputLog;