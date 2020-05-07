import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
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
    storage,
    version: 0,
}

const persistedState = loadFromLocalStorage()

const persistedReducer = persistReducer(persistConfig, allReducers)

export var store = createStore(persistedReducer,
    persistedState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

store.subscribe(() => saveTolLocalStorage(store.getState()))

export var persistor = persistStore(store)
