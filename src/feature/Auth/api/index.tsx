import {  apiClient2 } from "../../../services/apiClient";
import { CodeVerify, EmailCode, PhoneCode, PhoneVerify, User } from "../../../models/datamodels";


const registerUser = async (user: User) => {
    console.log("second",user)
    const { data } = await apiClient2.post("/api-V1/auth/register", user);
    return data
}

const loginUser = async (user: User) => {
    console.log(user)
    const { data } = await apiClient2.post("/api-V1/auth/login", user);
    return data
}

const getEmailVerificationCode = async (user: EmailCode) => {
    console.log(user)
    const { data } = await apiClient2.post("/api-v1/auth/send-verification-email",user);
    return data
}

const verifyEmailCode = async (user: CodeVerify) => {
    console.log(user)
    const { data } = await apiClient2.post("/api-v1/auth/verify-email", user);
    return data
}

const getPhoneVerificationCode = async (user: PhoneCode) => {
    console.log(user)
    const { data } = await apiClient2.post("/api-v1/auth/send-verification-sms",user);
    return data
}

const verifyPhoneCode = async (user: PhoneVerify) => {
    console.log(user)
    const { data } = await apiClient2.post("/api-v1/auth/verify-phone", user);
    return data
}

export {verifyEmailCode,getEmailVerificationCode,loginUser,registerUser,getPhoneVerificationCode,verifyPhoneCode}
