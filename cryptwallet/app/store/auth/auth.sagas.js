import { takeLatest, call, put, all } from 'redux-saga/effects';
import { clientHttp } from '../../utils/services/httplClient';
import { loginFailure, signupFailure, signupSuccess, loginSuccess } from './auth.actions';

import AuthTypes from './auth.types';

export function* signupStartAsync(payload) {
    try {
        console.log(payload);
        const result = yield clientHttp.post('/signup', payload);
        if (result && result.data) {
            yield put(signupSuccess());
        }
    }
    catch(error) {
        console.log('here')
        yield put(signupFailure(error));
    }
}

export function* onSignupStart() {
    yield takeLatest(AuthTypes.SIGNUP_START, signupStartAsync);
}

export function* loginStartAsync(payload) {
    try {
        const result = yield clientHttp.post('/singin',payload);
        if (result && result.data) {
            yield put(loginSuccess(result.data));
        }
    }
    catch(error) {
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