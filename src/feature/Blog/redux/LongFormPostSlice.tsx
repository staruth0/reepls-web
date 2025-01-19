import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Article } from "../../../models/datamodels";

const lPostInitialState: Article = {
  title: "", 
  subTitle: "", 
  content: "", 
  category: [],  
  media: [],  
  author_id: "",
};


const lPostSlices = createSlice({
  name: "lPost",
 initialState: lPostInitialState,
    reducers: {
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload
        },
        setSubTitle: (state, action: PayloadAction<string>) => {
            state.subTitle = action.payload
        },
        setContent: (state, action: PayloadAction<string>) => {
            state.content = action.payload

        },
        setCategory: (state, action: PayloadAction<string[]>) => {
            const categories = action.payload;
            categories.map((item) => state.category?.push(item))

        },
        setMedia: (state, action: PayloadAction<string[]>) => { 
            const media = action.payload;
            media.map((item) => state.media?.push(item))
        },
        setAuthorId: (state, action: PayloadAction<string>) => {
            state.author_id = action.payload;
         }


    }
});

export const { setTitle, setSubTitle, setContent, setCategory, setMedia, setAuthorId } = lPostSlices.actions
export default lPostSlices.reducer
