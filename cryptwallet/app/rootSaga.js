import { all, call } from 'redux-saga/effects';
import {authSagas} from './store/auth/auth.sagas';


export default function* rootSaga() {
    yield all([ // array of generators that we invoke
        call(authSagas)
    ])
}