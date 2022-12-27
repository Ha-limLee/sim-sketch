import { configureStore } from "@reduxjs/toolkit";
import toolBoxReducer from '../features/toolBox/toolBoxSlice';

export const store = configureStore({
    reducer: {
        toolBox: toolBoxReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;