import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the usersList state domain
 */

const selectUsersListDomain = state => state.get('usersList', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by UsersList
 */

const makeSelectUsersList = () =>
  createSelector(selectUsersListDomain, substate => substate.toJS());

export default makeSelectUsersList;
export { selectUsersListDomain };
