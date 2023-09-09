import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the Chat state domain
 */

const selectChatDomain = state => state.get('chat', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by Chat
 */

const makeSelectChat = () =>
  createSelector(selectChatDomain, substate => substate.toJS());

export default makeSelectChat;
export { selectChatDomain };
