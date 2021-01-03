import {combineReducers} from 'redux';
import btnLoginReducer from './btnLogin';
import loginReducer from './login';
import socketReducer from './socket';
import chatReducer from './chat';

const rootReducer = combineReducers({
    btnLogin: btnLoginReducer,
    login: loginReducer,
    socket: socketReducer,
    chat: chatReducer
});

export default rootReducer;