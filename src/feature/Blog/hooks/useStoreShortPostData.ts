import { useDispatch } from "react-redux";
import {
  updateContent,
  addMedia,
  assignAuthorId,
} from "../redux/ShortFormPost";

const useStoreShortPostData = () => {
  const dispatch = useDispatch();

  function storeContent(content: string) {
    dispatch(updateContent(content));
  }

  function storeMedia(media: string[]) {
    dispatch(addMedia(media));
  }

  function storeAuthorId(authorId: string) {
    dispatch(assignAuthorId(authorId));
  }

  return {
    storeContent,
    storeMedia,
    storeAuthorId,
  };
};

export default useStoreShortPostData;
