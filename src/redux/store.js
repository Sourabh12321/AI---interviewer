import {configureStore} from '@reduxjs/toolkit'
import authReducer from './slice/authSlice'
import interviewReducer from './slice/interviewSlice'

export const store = configureStore({
    reducer:{
        auth:authReducer,
        interview:interviewReducer
    }
})