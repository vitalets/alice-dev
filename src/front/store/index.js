/**
 * Global redux store for app.
 */

import { createStore } from 'redux';
import { rootReducer } from './reducers';
import persistentState from './persistent-state';

export * from './const';
export * from './actions';

export const store = createStore(rootReducer);

persistentState.handleUpdates(store);
