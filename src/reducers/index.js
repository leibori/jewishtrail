import statusReducer from './logStatus'
import positionReducer from './position'
import { combineReducers } from 'redux'


const allReducers = combineReducers({
    status: statusReducer,
    position: positionReducer,
})

export default allReducers