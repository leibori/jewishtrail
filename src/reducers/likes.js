const likesReducer = (status = [], action) => {
    switch(action.type) {
        case 'SET_LIKES':
            return action.likes
        default:
            return status
    }
};

export default likesReducer;