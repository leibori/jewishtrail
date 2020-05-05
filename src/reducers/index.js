import statusReducer from './logStatus'
import positionReducer from './position'
import siteFavoritesReducer from './siteFavorites'
import trailFavoritesReducer from './trailFavorites'
import { combineReducers } from 'redux'


const allReducers = combineReducers({
    status: statusReducer,
    position: positionReducer,
    siteFavorites: siteFavoritesReducer,
    trailFavorites: trailFavoritesReducer,
})

export default allReducers