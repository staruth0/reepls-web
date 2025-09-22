import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserRole } from "../../../models/datamodels";

const initialState: User = {
  username: "",
  email: "",
  password: "",
  phone: "",
  role: UserRole.Reader, 
  interests: [], 
  is_verified_writer: false, 
 
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUserName(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    getUserPassword(state, action: PayloadAction<string>) {
        state.password = action.payload;
    },
    getUserEmail(state, action: PayloadAction<string>) {
        state.email= action.payload;
    },
    getUserPhone(state, action: PayloadAction<string>) {
        state.phone= action.payload;
    },
    getUserInterests(state, action: PayloadAction<string[]>) {
        const interests = action.payload;
        interests.map(interest => (
            state.interests?.push(interest)
        ))
    },
    clearUserData(state) {
        state.username = "";
        state.email = "";
        state.password = "";
        state.phone = "";
        state.interests = [];
    },
  },
});


export const { getUserName,getUserEmail,getUserPassword,getUserInterests,getUserPhone,clearUserData } = userSlice.actions;
export default userSlice.reducer;