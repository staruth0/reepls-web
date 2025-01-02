import { useDispatch } from "react-redux";
import {
  setAuthorId,
  setCategory,
  setContent,
  setMedia,
  setSubTitle,
  setTitle,
} from "../redux/LongFormPostSlice";

const useStorePostData = () => {
  const dispatch = useDispatch();

  function storeTitle(title: string) {
    dispatch(setTitle(title));
  }

  function storeSubTitle(subTitle: string) {
    dispatch(setSubTitle(subTitle));
  }

  function storeContent(content: string) {
    dispatch(setContent(content));
  }

  function storeMedia(media: string[]) {
    dispatch(setMedia(media));
  }

  function storeCategory(category: string[]) {
    dispatch(setCategory(category));
  }

  function storeAuthorId(authorId: string) {
    dispatch(setAuthorId(authorId));
  }

  return {
    storeTitle,
    storeSubTitle,
    storeContent,
    storeMedia,
    storeCategory,
    storeAuthorId,
  };
};

export default useStorePostData;
