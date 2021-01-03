import { useEffect, useState } from 'react';
import './css/LoginBTN.css';
import {useSelector, useDispatch} from 'react-redux';
import {btnLoginAction } from '../redux/actions/btnLogin';

function LoginBTN(props)
{
    const [textColor, setTextColor] = useState('white');
    const [boxShadowTop, setBoxShadowTop] = useState('none');
    const [boxShadowBottom, setBoxShadowBottom] = useState('none');
    const [bgColor, setBgColor] = useState('transparent');

    const btnLogin = useSelector(state => state.btnLogin);
    const dispatch = useDispatch();

    
    useEffect(() => {
        if(btnLogin === props.text)
        {
            setTextColor('#31b19d');
            setBoxShadowTop('0 30px 0 0 white');
            setBoxShadowBottom('0 -30px 0 0 white');
            setBgColor('white');
        }
        else
        {
            setTextColor('white');
            setBoxShadowTop('none');
            setBoxShadowBottom('none');
            setBgColor('transparent');
        }
    }, [btnLogin]);

    return(
        <div className="LoginBTN noselect">
            <div className="loginBTNTop loginBTNRadius" style={{boxShadow: boxShadowTop}}></div>
            <p className="LoginBTNText" style={{color: textColor, backgroundColor: bgColor}} onClick={() => dispatch(btnLoginAction(props.text))}>{props.text}</p>
            <div className="loginBTNBottom loginBTNRadius" style={{boxShadow: boxShadowBottom}}></div>
        </div>
    );
}

export default LoginBTN;