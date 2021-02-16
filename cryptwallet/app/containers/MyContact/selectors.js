import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the myContact state domain
 */

const selectMyContactDomain = state => state.get('myContact', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by MyContact
 */

const makeSelectMyContact = () =>
  createSelector(selectMyContactDomain, substate => substate.toJS());

export default makeSelectMyContact;
export { selectMyContactDomain };
