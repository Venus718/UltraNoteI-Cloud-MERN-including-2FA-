import AuthTypes from './auth.types';

export const signupStart = (payload) => ({
    type: AuthTypes.SIGNUP_START
});

export const signupSuccess = () => ({
    type: AuthTypes.SIGNUP_SUCCESS
});

export const signupFailure = (error) => ({
    type: AuthTypes.ERROR,
    payload: error
});

export const loginStart = (payload) => ({
    type: AuthTypes.LOGIN_START
});

export const loginSuccess = () => ({
    type: AuthTypes.LOGIN_SUCESS
});

export const loginFailure = (error) => ({
    type: AuthTypes.ERROR,
    payload: error
});