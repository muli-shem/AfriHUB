import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default storage (localStorage)
import rootReducer from '../RootReducer/rootReducer'; // Your combined reducers
import {PersistPartial} from 'redux-persist/es/persistReducer';


// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth','login', 'posts', 'education'],// Reducers that you want to persist

};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Ignore redux-persist actions
            },
        }),
});

// Create the persisted store
const persistedStore = persistStore(store);

// Type exports
export type RootState = ReturnType<typeof rootReducer>& PersistPartial;
export type AppDispatch = typeof store.dispatch;

// Export store and persisted store
export { store, persistedStore };
