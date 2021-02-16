import { fromJS } from 'immutable';
import usersListReducer from '../reducer';

describe('usersListReducer', () => {
  it('returns the initial state', () => {
    expect(usersListReducer(undefined, {})).toEqual(fromJS({}));
  });
});
