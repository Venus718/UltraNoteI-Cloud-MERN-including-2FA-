import { toast } from 'react-toastify';
import cookie from 'js-cookie';
import { takeLatest, call, put, all } from 'redux-saga/effects';
import { clientHttp } from '../../utils/services/httpClient';
import { loginFailure, signupFailure, signupSuccess, loginSuccess, enableTwoAuthSuccess, sendTwoCodeFailure, sendTwoCodeSuccess,
         updateProfileStart, updateProfileSuccess, updateProfileFailure, depositAndWithdrawSuccess, authResetSuccess, addContactSuccess, 
         getContactListSuccess, getUsersSuccess } from './auth.actions';

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
            const {twoFA, token} = result.data;
            if (twoFA) {
                toast.info('4-digit verication code is sent to your email');
                payload.history.push(`/confirm-code/${token}`);
            }
            else {
                cookie.set('Auth', true);
            localStorage.setItem('user', JSON.stringify(result.data.user));
            localStorage.setItem('token', result.data.token);
            toast.success('Successfully login');
            payload.history.push('/dashboard');
            yield put(loginSuccess(result.data));
            }
        }
    }
    catch(error) {
        yield put(loginFailure(error));
    }
}

export function* onLoginStart() {
    yield takeLatest(AuthTypes.LOGIN_START, loginStartAsync);
}


export function* resetPasswordAsync({payload}) {
    const requestData = {
        password: payload.password
    };
    const token = payload.token;

    try {
        const result = yield clientHttp.post(`/newpassword/${token}`, requestData);
        if (result) {
            toast.success("Password successfuly updated");
            const {history} = payload;
            history.push('/login');
        }
    }
    catch(error) {
        yield put(resetPasswordFailure(error));
    }
}


export function* onResetPasswordStart() {
    yield takeLatest(AuthTypes.RESET_PASSWORD, resetPasswordAsync);
}

export function* UpdateProfileAsync({payload}) {
    const requestData = {
        image: payload.image,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
    };
    const token = payload.token;

    try {
        const result = yield clientHttp.post(`/update_profile/${token}`, requestData);
        if (result) {
            console.log("result", result);
            localStorage.setItem('user', JSON.stringify(result.data.user));
            toast.success("Profile Successfuly Updated");
        }
    }
    catch(error) {
        yield put(updateProfileFailure(error));
    }
}


export function* onUpdateProfileStart() {
    yield takeLatest(AuthTypes.UPDATE_PROFILE_START, UpdateProfileAsync);
}

export function* requestEmailResetAsync({payload}) {
    console.log(payload);
    const requestData = {
        mail: payload.email
    };

    try {
        const result = yield clientHttp.post('/resetmail', requestData);
        if (result) {
            toast.info("You should soon receive an email allowing you to reset your password. Please make sure to check your spam and trash if you can't find the email.");
            const {history} = payload;
            history.push('/');
        }
    }
    catch(error) {
        yield put(requestEmailResetFailure(error));
    }
}


export function* onRequestEmailResetPasswordStart() {
    yield takeLatest(AuthTypes.REQUEST_EMAIL_RESET, requestEmailResetAsync);
}


export function* enableTwoAuthAsync({payload}) {
    console.log(payload);
    try {
        const result = yield clientHttp.post('/settings/change2fa', payload);
        if (result) {
            const msg = payload.isActive ? 'Authenticator app is enabled' : 'Authenticator app is disabled'; 
            toast.success(msg);
            yield put(enableTwoAuthSuccess(payload))
        }
    }
    catch(error) {
        yield put(enableTwoAuthFailure(error));
    }
}


export function* onEnableTwoAuth() {
    yield takeLatest(AuthTypes.ENABLE_TWO_AUTH, enableTwoAuthAsync);
}


export function* sendTwoAuthVerifAsync({payload}) {
    
    try {
        const requestData = {
            code: payload.code,
        }
        const result = yield clientHttp.post(`/twofacode/${payload.token}`, requestData);
        if (result && result.data) {
            const {user, token} = result.data;
            cookie.set('Auth', true);
            localStorage.setItem('user', JSON.stringify(result.data.user));
            localStorage.setItem('token', result.data.token);
            toast.success('Successfully login');
            payload.history.push('/dashboard');
            yield put(sendTwoCodeSuccess({user, token}));
        }
    }
    catch(error) {
        yield put(sendTwoCodeFailure(error));
    }
}


export function* onSendTwoAuthVerif() {
    yield takeLatest(AuthTypes.SEND_CODE_TWO_AUTH, sendTwoAuthVerifAsync);
}

export function* DepositAndWithdrawAsync({payload}) {
    try {
        const result = yield clientHttp.post(`/user/dashboard`, {id: payload});
        if (result && result.data) {
            console.log("Result Data", result.data);
            yield put(depositAndWithdrawSuccess(result.data));
        }
    }
    catch(error) {
        console.log(error);
    }
}


export function* onDepositAndWithdraw() {
    yield takeLatest(AuthTypes.DEPOSIT_AND_WITHDRAW_START, DepositAndWithdrawAsync);
}


export function* authResetAsync() {
    try {
        console.log('Reset Auth States');
        yield put(authResetSuccess());
        }
    catch(error) {
        yield put(throwError(error));
    }
}

export function* onAuthReset() {
    yield takeLatest(AuthTypes.AUTH_RESET, authResetAsync);
}

export function* getUsersAsync() {
    try {
        const result = yield clientHttp.get(`/user/get_users`);
        if (result && result.data) {
            yield put(getUsersSuccess(result.data));
        }    
    }
    catch(error) {
        yield put(throwError(error));
    }
}

export function* onGetUsers() {
    yield takeLatest(AuthTypes.GET_USERS, getUsersAsync);
}


export function* addContactAsync({payload}) {
    try {
        const result = yield clientHttp.post(`/user/add_contact`, payload);
        if (result && result.data) {
            toast.success('Contact Added Successfully');
            yield put(addContactSuccess());
        }
    }
    catch(error) {
        yield put(throwError(error));
    }
}

export function* onAddContact() {
    yield takeLatest(AuthTypes.ADD_CONTACT, addContactAsync);
}


export function* getContactListAsync({payload}) {
    try {
        const result = yield clientHttp.post(`/user/get_contact_list`, {id: payload});
        if (result && result.data) {
            yield put(getContactListSuccess(result.data));
        }
    }
    catch(error) {
        yield put(throwError(error));
    }
}

export function* onGetContactList() {
    yield takeLatest(AuthTypes.GET_CONTACT_LIST, getContactListAsync);
}


export function* authSagas() {
    yield all([
        call(onSignupStart),
        call(onLoginStart),
        call(onResetPasswordStart),
        call(onUpdateProfileStart),
        call(onRequestEmailResetPasswordStart),
        call(onEnableTwoAuth),
        call(onSendTwoAuthVerif),
        call(onDepositAndWithdraw),
        call(onAuthReset),
        call(onGetUsers),
        call(onAddContact),
        call(onGetContactList)
    ]);
};