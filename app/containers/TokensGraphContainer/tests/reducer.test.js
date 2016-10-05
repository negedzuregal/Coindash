import expect from 'expect';
import tokensGraphContainerReducer from '../reducer';
import { fromJS } from 'immutable';

describe('tokensGraphContainerReducer', () => {
  it('returns the initial state', () => {
    expect(tokensGraphContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
