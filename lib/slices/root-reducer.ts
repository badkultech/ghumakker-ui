// lib/root-reducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './auth';
import uiReducer from './uiSlice';
import { baseAPI, publicBaseAPI } from '../services';
import { organizerSlice } from '@/app/organizer/-organizer-slice';
import compareReducer from './compareSlice';

export const rootReducer = combineReducers({
  [baseAPI.reducerPath]: baseAPI.reducer,
  [publicBaseAPI.reducerPath]: publicBaseAPI.reducer,
  auth: authSlice.reducer,
  ui: uiReducer, // ✅ global loader
  compare: compareReducer,
  organizer: organizerSlice.reducer,
});
