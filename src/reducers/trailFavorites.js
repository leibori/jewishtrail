const trailFavoritesReducer = (state = [], action) => {
    switch(action.type) {
        case 'SET_TRAIL_FAVORITES':
            return action.trailFavorites
        default:
            return state
    }
}

export default trailFavoritesReducer;