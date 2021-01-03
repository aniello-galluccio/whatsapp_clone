const chatReducer = (state = 'none', action) => {
    switch(action.type)
    {
        case 'cambio':
            state = action.user;
            return state;
        default :
            return state;
    }
}

export default chatReducer;