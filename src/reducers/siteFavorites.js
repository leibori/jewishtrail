const siteFavoritesReducer = (state = {siteFavorites: []}, action) => {
    switch(action.type) {
        case 'SET_SITE_FAVORITES':
            return action.siteFavorites
        default:
            return state
    }
}

export default siteFavoritesReducer;