// lib/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './root-reducer';
import { baseAPI , publicBaseAPI} from '../services';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseAPI.middleware, publicBaseAPI.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
