import {User,EmailCode,PhoneCode,CodeVerify,PhoneVerify,} from "../../../models/datamodels";
import { useState } from "react";
import {registerUser,loginUser,getEmailVerificationCode,verifyEmailCode,getPhoneVerificationCode,verifyPhoneCode} from "../api";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState({});

  // Function to create a new user
  async function createUser(credentials: User) {
    setLoading(true);
    setError(false);
    try {
      const response = await registerUser(credentials);
      if (response) {
        setData(response);
      }
      return response;
    } catch (error) {
      void error;
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  // Function to log in a user
  async function login(credentials: User) {
    setLoading(true);
    setError(false);
    try {
      const response = await loginUser(credentials);
      if (response) {
        setData(response);
      }
      return response;
    } catch (error) {
      void error;
      setError(true);
    } finally {
      setLoading(false);
    }
  } 

  // Function to get an email verification code
  async function getEmailCode(credentials: EmailCode) {
    setLoading(true);
    setError(false);
    try {
      const response = await getEmailVerificationCode(credentials);
      if (response) {
        setData(response);
      }
      return response;
    } catch (error) {
      void error;
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  // Function to get a phone verification code
  async function getPhoneCode(credentials: PhoneCode) {
    setLoading(true);
    setError(false);
    try {
      const response = await getPhoneVerificationCode(credentials);
      if (response) {
        setData(response);
      }
      return response;
    } catch (error) {
      void error;
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  // Function to verify an email code
  async function verifyEmail(credentials: CodeVerify) {
    setLoading(true);
    setError(false);
    try {
      const response = await verifyEmailCode(credentials);
      if (response) {
        setData(response);
      }
      return response;
    } catch (error) {
      void error;
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  // Function to verify a phone code
  async function verifyPhone(credentials: PhoneVerify) {
    setLoading(true);
    setError(false);
    try {
      const response = await verifyPhoneCode(credentials);
      if (response) {
        setData(response);
      }
      return response;
    } catch (error) {
      void error;
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return {
    createUser,
    login,
    loading,
    error,
    data,
    getEmailCode,
    getPhoneCode,
    verifyEmail,
    verifyPhone,
  };
};
