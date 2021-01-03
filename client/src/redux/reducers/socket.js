const socketReducer = (state = 'none', action) => {
    switch(action.type)
    {
        case 'set':
            state = action.ref;
            return state;
        default :
            return state;
    }
}

export default socketReducer;