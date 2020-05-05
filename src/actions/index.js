export const findPosition = (props) => {
    return props
}

export const setLogStatus = (status) => {
    return {
        type: 'SET_STATUS',
        status
    }
}

export const setSiteFavorites = (favorites) => {
    return {
        type: 'SET_SITE_FAVORITES',
        siteFavorites: favorites
    }
}

export const setTrailFavorites = (favorites) => {
    return {
        type: 'SET_TRAIL_FAVORITES',
        trailFavorites: favorites
    }
}