import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import reservationReducer from './slices/reservationSlice';

const authPersistConfig = {
  key: 'auth',
  storage,
};

const reservationPersistConfig = {
  key: 'reservations',
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedReservationReducer = persistReducer(reservationPersistConfig, reservationReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    reservations: persistedReservationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);

export default store;
