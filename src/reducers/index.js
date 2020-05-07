import statusReducer from './logStatus'
import positionReducer from './position'
import siteFavoritesReducer from './siteFavorites'
import trailFavoritesReducer from './trailFavorites'
import likesReducer from './likes'
import dislikesReducer from './dislikes'
import { combineReducers } from 'redux'


const allReducers = combineReducers({
    status: statusReducer,
    likes: likesReducer,
    dislikes: dislikesReducer,
    position: positionReducer,
    siteFavorites: siteFavoritesReducer,
    trailFavorites: trailFavoritesReducer,
})

export default allReducers