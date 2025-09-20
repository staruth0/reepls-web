import { useDispatch } from "react-redux";
import {
  getUserEmail,
  getUserInterests,
  getUserName,
  getUserPassword,
  getUserPhone,
  clearUserData,
} from "../redux";

export const useStoreCredential = () => {
  const dispatch = useDispatch();

  function storePhone(value: string) {
    dispatch(getUserPhone(value));
  }

  function storeEmail(value: string) {
    dispatch(getUserEmail(value));
  }

  function storeInterests(value: string[]) {
    dispatch(getUserInterests(value));
  }

  function storePassword(value: string) {
    dispatch(getUserPassword(value));
  }

  function storeName(value: string) {
    dispatch(getUserName(value));
  }

  function clearAllUserData() {
    dispatch(clearUserData());
  }

  return { storeEmail, storeInterests, storeName, storePassword, storePhone, clearAllUserData };
};
