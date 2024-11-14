import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../feature/Auth/redux/index"

const store = configureStore({
    reducer: {
        user:userReducer,
    }
})

export { store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;