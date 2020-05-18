import statusReducer from './logStatus'
import positionReducer from './position'
import siteFavoritesReducer from './siteFavorites'
import trailFavoritesReducer from './trailFavorites'
import likesReducer from './likes'
import dislikesReducer from './dislikes'
import searchResultsReducer from './searchResults'
import { combineReducers } from 'redux'


const allReducers = combineReducers({
    status: statusReducer,
    likes: likesReducer,
    dislikes: dislikesReducer,
    position: positionReducer,
    siteFavorites: siteFavoritesReducer,
    trailFavorites: trailFavoritesReducer,
    searchResults: searchResultsReducer,
})

export default allReducers