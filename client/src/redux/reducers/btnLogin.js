const btnLoginReducer = (state = 'LOGIN', action) => {
    switch(action.type)
    {
        case 'LOGIN':
            return 'LOGIN';
        case 'SIGN IN':
            return 'SIGN IN';
        default :
            return state;
    }
}

export default btnLoginReducer;