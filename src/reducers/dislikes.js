const dislikesReducer = (status = [], action) => {
    switch(action.type) {
        case 'SET_DISLIKES':
            return action.dislikes
        default:
            return status
    }
};

export default dislikesReducer;