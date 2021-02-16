import { fromJS } from 'immutable';
import myContactReducer from '../reducer';

describe('myContactReducer', () => {
  it('returns the initial state', () => {
    expect(myContactReducer(undefined, {})).toEqual(fromJS({}));
  });
});
