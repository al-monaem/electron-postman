import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import tabReducer from './mock/tabSlice'
import userReducer from './user/userSlice'

const persistConfig = {
  key: 'root',
  version: 1,
  storage
}

const reducer = combineReducers({
  tabReducer: tabReducer,
  userReducer: userReducer
})

const persistedReducer = persistReducer(persistConfig, reducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export default store
