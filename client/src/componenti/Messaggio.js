import { useEffect, useState } from 'react';
import './css/Messaggio.css';

function Messaggio(props)
{
    const [orecchiaBG, setOrecchiaBG] = useState('linear-gradient(498deg, #dcf8c6 50%, transparent 50%)');
    const [flexDirection, setFlexDirection] = useState('row-reverse');
    const [bgColor, setBgColor] = useState('#dcf8c6');
    const [borderRadius, setBorderRadius] = useState('10px 0px 10px 10px');
    const [visualizzatoDisp, setVisualizzatoDisp] = useState('none');
    const [visualizzatoColor, setVisualizzatoColor] = useState('rgba(0, 0, 0, 0.3)');

    useEffect(() => {
        if(props.isMyMex)
        {
            setFlexDirection('row-reverse');
            setOrecchiaBG('linear-gradient(498deg, #dcf8c6 50%, transparent 50%)');
            setBgColor('#dcf8c6');
            setBorderRadius('10px 0px 10px 10px');
            setVisualizzatoDisp('block');
        }
        else
        {
            setFlexDirection('row')
            setOrecchiaBG('linear-gradient(231deg, white 50%, transparent 50%)');
            setBgColor('white');
            setBorderRadius('0px 10px 10px 10px');
            setVisualizzatoDisp('none');
        }
    }, [props.isMyMex]);

    useEffect(() => {
        if(props.isLetto)
        {
            setVisualizzatoColor('rgb(79, 195, 247)');
        }
        else
        {
            setVisualizzatoColor('rgba(0, 0, 0, 0.3)');
        }
    }, [props.isLetto]);

    //inserisce uno zero se il numero è minore di 10
    const insertZero = number => {
        let strNum = String(number);
        if(number < 10)
        {
            strNum = '0' + number;
        }

        return strNum;
    }

    const creaOra = data => {
        const date = new Date(data);

        return insertZero(date.getHours()) + ":" + insertZero(date.getMinutes());
    }

    return(
        <div className="Messaggio" style={{flexDirection: flexDirection}}>
            <div className="messaggio_orecchia_white" style={{background: orecchiaBG}}></div>
            <div className="messaggio_container" style={{backgroundColor: bgColor, borderRadius: borderRadius}}>
                {props.text}
                <span className="messaggio_dati">
                    {creaOra(props.ora)} <svg style={{display: visualizzatoDisp, marginLeft: "3px"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" width="16" height="15"><path fill={visualizzatoColor} d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>
                </span>
            </div>
        </div>
    );
}

export default Messaggio;