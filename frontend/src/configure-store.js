import { configureStore } from '@reduxjs/toolkit';
import doctorReducer from './doctorslice';
import treatmentReducer from './treatmentslice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, doctorReducer)

export const store = configureStore({
  reducer: {
    doctor: persistedReducer,
    // treatment: treatmentReducer
  },
  middleware: [thunk]
});

// export default store;
export const persistor = persistStore(store)