import { toast } from 'react-toastify';
import cookie from 'js-cookie';
import { takeLatest, call, put, all } from 'redux-saga/effects';
import { clientHttp } from '../../utils/services/httpClient';
import { loginFailure, loginSuccess, throwError } from './auth.actions';

import AuthTypes from './auth.types';

export function* loginStartAsync({ payload }) {
  try {
    const requestData = {
      mail: payload.email,
      password: payload.password,
    };

    const result = yield clientHttp.post('/signin', requestData);
    if (result && result.data) {
      const { twoFA, token } = result.data;
      if (twoFA) {
        toast.info('4-digit verication code is sent to your email');
        payload.history.push(`/confirm-code/${token}`);
      } else {
        cookie.set('Auth', true);
        yield put(loginSuccess(result.data));
        //localStorage.setItem('user', JSON.stringify(result.data.user));
        localStorage.setItem('token', result.data.token);
        toast.success('Successfully login');
        payload.history.push('/');
      }
    }
  } catch (error) {
    yield put(loginFailure(error));
  }
}

export function* onLoginStart() {
  yield takeLatest(AuthTypes.LOGIN_START, loginStartAsync);
}

export function* resetPasswordAsync({ payload }) {
  const requestData = {
    password: payload.password,
  };
  const token = payload.token;

  try {
    const result = yield clientHttp.post(`/newpassword/${token}`, requestData);
    if (result) {
      toast.success('Password successfuly updated');
      const { history } = payload;
      history.push('/login');
    }
  } catch (error) {
    yield put(throwError(error));
  }
}

export function* onResetPasswordStart() {
  yield takeLatest(AuthTypes.RESET_PASSWORD, resetPasswordAsync);
}

export function* authSagas() {
  yield all([
    call(onLoginStart),
    call(onResetPasswordStart),
    call(onAuthReset),
  ]);
}
