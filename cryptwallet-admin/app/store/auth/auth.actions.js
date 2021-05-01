import AuthTypes from './auth.types';

export const loginStart = payload => ({
  type: AuthTypes.LOGIN_START,
  payload,
});

export const loginSuccess = payload => ({
  type: AuthTypes.LOGIN_SUCESS,
  payload,
});

export const loginFailure = error => ({
  type: AuthTypes.ERROR,
  payload: error,
});

export const resetPasswordStart = payload => ({
  type: AuthTypes.RESET_PASSWORD,
  payload,
});

export const resetPasswordSuccess = payload => ({
  type: AuthTypes.RESET_PASSWORD_SUCCESS,
  payload,
});

export const resetPasswordFailure = payload => ({
  type: AuthTypes.ERROR,
  payload,
});

export const requestEmailResetStart = payload => ({
  type: AuthTypes.REQUEST_EMAIL_RESET,
  payload,
});

export const requestEmailResetSuccess = payload => ({
  type: AuthTypes.REQUEST_EMAIL_RESET_SUCCESS,
  payload,
});

export const requestEmailResetFailure = payload => ({
  type: AuthTypes.ERROR,
  payload,
});
export const authReset = () => ({
  type: AuthTypes.AUTH_RESET,
});

export const authResetSuccess = () => ({
  type: AuthTypes.AUTH_RESET_SUCCESS,
});

export const throwError = error => ({
  type: AuthTypes.ERROR,
  payload: error,
});
