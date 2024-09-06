import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import toolBoxReducer from '../features/toolBox/toolBoxSlice';
import drawBoardReducer from '../features/drawBoard/drawBoardSlice';

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ["toolBox", "drawBoard"],
};

const drawBoardConfig = {
    key: 'toolBox',
    storage,
    blacklist: ["draft"],
}

const reducers = combineReducers({
    toolBox: toolBoxReducer,
    drawBoard: persistReducer(drawBoardConfig, drawBoardReducer),
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            }
        }), 
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;