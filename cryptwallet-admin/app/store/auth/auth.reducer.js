import AuthTypes from './auth.types';

const INITIAL_STATE = {
  isRegistred: false,
  isLoggedIn: false,
  isLoading: false,
  user: null,
  token: '',
  error: null,
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AuthTypes.LOGIN_START:
      return {
        ...state,
        isLoading: true,
      };
    case AuthTypes.LOGIN_SUCESS:
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        isRegistred: true,
        isLoading: false,
        isLoggedIn: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case AuthTypes.AUTH_RESET_SUCCESS:
      return { ...INITIAL_STATE };
    case AuthTypes.ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
