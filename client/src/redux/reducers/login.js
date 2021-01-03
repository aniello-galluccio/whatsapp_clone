const loginReducer = (state = 'none', action) => {
    switch(action.type)
    {
        case 'change':
            state = action.user;
            return state;
        default :
            return state;
    }
}

export default loginReducer;