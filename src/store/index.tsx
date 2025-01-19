import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../feature/Auth/redux/index"
import lPostReducer from "../feature/Blog/redux/LongFormPostSlice"


const store = configureStore({
    reducer: {
        user: userReducer,
        lPost:lPostReducer,
    }
})

export { store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;