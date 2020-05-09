import { createStore } from 'redux'
import allReducers from './reducers'


function saveTolLocalStorage(state) {
    try {
        const serializedState = JSON.stringify(state)
        localStorage.setItem('state', serializedState)
    } catch(e) {
        console.log(e)
    }
}

function loadFromLocalStorage() {
    try {
        const serializedState = localStorage.getItem('state')
        if (serializedState === null) return undefined
        return JSON.parse(serializedState)
    } catch(e) {
        console.log(e)
        return undefined
    }
}

export const persistConfig = {
    key: 'root',
    version: 0,
}

const persistedState = loadFromLocalStorage()

export var store = createStore(
    allReducers,
    persistedState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

store.subscribe(() => saveTolLocalStorage(store.getState()))
