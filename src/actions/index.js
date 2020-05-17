export const setPosition = (position) => {
    return {
        type: 'SET_POSITION',
        position
    }
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

export const setLikes = (likes) => {
    return {
        type: 'SET_LIKES',
        likes: likes
    }
}

export const setDislikes = (dislikes) => {
    return {
        type: 'SET_DISLIKES',
        dislikes: dislikes
    }
}
