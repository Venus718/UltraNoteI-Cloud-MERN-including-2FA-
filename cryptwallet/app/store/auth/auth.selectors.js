import { createSelector } from "reselect";


const authSelector = (state) => {
  const authState = state._root.entries.find(item => item[0]==='auth');
  return authState[1];
};

export const selectToken = createSelector(
  [authSelector],
  (auth) => auth.token
);

export const selectUser = createSelector(
    [authSelector],
    (auth) => auth.user
  );

  export const selectIsLoggedIn = createSelector(
    [authSelector],
    (auth) => auth.isLoggedIn
  );