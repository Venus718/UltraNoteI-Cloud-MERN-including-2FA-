import { toast } from 'react-toastify';
import cookie from 'js-cookie';
import { takeLatest, call, put, all } from 'redux-saga/effects';
import { clientHttp } from '../../utils/services/httpClient';
import { loginFailure, signupFailure, signupSuccess, loginSuccess } from './auth.actions';

import AuthTypes from './auth.types';

export function* signupStartAsync({payload}) {
    try {
        const requestData = {
            firstName: payload.firstName,
            lastName: payload.lastName,
            mail: payload.email,
            phone: payload.phone,
            password: payload.password
        };
        const result = yield clientHttp.post('/signup', requestData);
        if (result && result.data) {
            payload.history.push('/login');
            toast.success('Account created successfully, We have sent an email with a confirmation link to your email address.');
            yield put(signupSuccess());
        }
    }
    catch(error) {
        toast.error(error.message || 'An error has been occured !');
        yield put(signupFailure(error));
    }
}

export function* onSignupStart() {
    yield takeLatest(AuthTypes.SIGNUP_START, signupStartAsync);
}

export function* loginStartAsync({payload}) {
    try {
        const requestData = {
            mail: payload.email,
            password: payload.password
        };

        const result = yield clientHttp.post('/signin',requestData);
        if (result && result.data) {
            cookie.set('Auth', true);
            localStorage.setItem('user', result.data.user);
            localStorage.setItem('token', result.data.token);
            toast.success('Successfully login');
            payload.history.push('/dashboard');
            yield put(loginSuccess(result.data));
        }
    }
    catch(error) {
        toast.error(error.message || 'An error has been occured !');
        yield put(loginFailure(error));
    }
}

export function* onLoginStart() {
    yield takeLatest(AuthTypes.LOGIN_START, loginStartAsync);
}

export function* authSagas() {
    yield all([
        call(onSignupStart),
        call(onLoginStart)
    ]);
};