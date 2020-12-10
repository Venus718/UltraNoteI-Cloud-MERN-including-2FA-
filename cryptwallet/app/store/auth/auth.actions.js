import AuthTypes from './auth.types';

export const signupStart = (payload) => ({
    type: AuthTypes.SIGNUP_START,
    payload
});

export const signupSuccess = () => ({
    type: AuthTypes.SIGNUP_SUCCESS
});

export const signupFailure = (error) => ({
    type: AuthTypes.ERROR,
    payload: error
});

export const loginStart = (payload) => ({
    type: AuthTypes.LOGIN_START,
    payload
});

export const loginSuccess = (payload) => ({
    type: AuthTypes.LOGIN_SUCESS,
    payload
});

export const loginFailure = (error) => ({
    type: AuthTypes.ERROR,
    payload: error
});

export const resetPasswordStart = (payload) => ({
    type: AuthTypes.RESET_PASSWORD,
    payload
});

export const resetPasswordSuccess = (payload) => ({
    type: AuthTypes.RESET_PASSWORD_SUCCESS,
    payload
});

export const resetPasswordFailure = (payload) => ({
    type: AuthTypes.ERROR,
    payload
});

export const requestEmailResetStart = (payload) => ({
    type: AuthTypes.REQUEST_EMAIL_RESET,
    payload
});

export const requestEmailResetSuccess = (payload) => ({
    type: AuthTypes.REQUEST_EMAIL_RESET_SUCCESS,
    payload
});

export const requestEmailResetFailure = (payload) => ({
    type: AuthTypes.ERROR,
    payload
});


export const enableTwoAuthStart = (payload) => ({
    type: AuthTypes.ENABLE_TWO_AUTH,
    payload
});

export const enableTwoAuthSuccess = (payload) => ({
    type: AuthTypes.ENABLE_TWO_AUTH_SUCCESS,
    payload
});

export const enableTwoAuthFailure = (payload) => ({
    type: AuthTypes.ERROR,
    payload
});

export const autoLogin = (payload) => ({
    type: AuthTypes.AUTO_LOGIN,
    payload
});


export const sendTwoCodeStart = (payload) => ({
    type: AuthTypes.SEND_CODE_TWO_AUTH,
    payload
});

export const sendTwoCodeSuccess = (payload) => ({
    type: AuthTypes.SEND_CODE_TWO_AUTH_SUCCESS,
    payload
});

export const sendTwoCodeFailure = (payload) => ({
    type: AuthTypes.ERROR,
    payload
});
