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