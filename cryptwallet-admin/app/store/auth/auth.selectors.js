import { createSelector } from 'reselect';

const authSelector = state => {
  return state.get('auth');
};

export const selectToken = createSelector(
  [authSelector],
  auth => auth.token,
);

export const selectUser = createSelector(
  [authSelector],
  auth => auth.user,
);

export const selectIsLoggedIn = createSelector(
  [authSelector],
  auth => auth.isLoggedIn,
);
