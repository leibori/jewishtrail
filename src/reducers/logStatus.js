const statusReducer = (status = { claims: 'guest', uid: '', isVerified: false }, action) => {
    switch(action.type) {
        case 'SET_STATUS':
            return action.status
        default:
            return status
    }
};

export default statusReducer;