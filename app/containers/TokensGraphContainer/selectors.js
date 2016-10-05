import { createSelector } from 'reselect';

/**
 * Direct selector to the tokensGraphContainer state domain
 */
const selectTokensGraphContainerDomain = () => (state) => state.get('tokensGraphContainer');

/**
 * Other specific selectors
 */


/**
 * Default selector used by TokensGraphContainer
 */

const selectTokensGraphContainer = () => createSelector(
  selectTokensGraphContainerDomain(),
  (substate) => substate.toJS()
);

export default selectTokensGraphContainer;
export {
  selectTokensGraphContainerDomain,
};
