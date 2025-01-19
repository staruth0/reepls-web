import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Article } from "../../../models/datamodels";

const sPostInitialState: Article = {
  content: "",
  media: [],
  author_id: "",
};

const sPostSlice = createSlice({
  name: "sPost",
  initialState: sPostInitialState,
  reducers: {
    updateContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    },
    addMedia: (state, action: PayloadAction<string[]>) => {
      const mediaItems = action.payload;
      mediaItems.forEach((item) => state.media?.push(item));
    },
    assignAuthorId: (state, action: PayloadAction<string>) => {
      state.author_id = action.payload;
    },
    
  },
});

export const {
  updateContent,
  addMedia,
  assignAuthorId,
} = sPostSlice.actions;
export default sPostSlice.reducer;
