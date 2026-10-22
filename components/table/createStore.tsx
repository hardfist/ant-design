import assign from 'object-assign';
import { createKeySet, KeySet } from '../_util/keyMap';

export interface Store {
  setState: (partial: Object) => void;
  getState: () => any;
  subscribe: (listener: () => void) => () => void;
  // Parallel to state.selectedRowKeys. Kept off state so getState()
  // stays the plain object row-selection tests compare against.
  getSelectedKeySet: () => KeySet;
}

export default function createStore(initialState): Store {
  let state = initialState;
  let selectedRowKeySet = createKeySet(initialState && initialState.selectedRowKeys);
  const listeners: any[] = [];

  function setState(partial) {
    state = assign({}, state, partial);
    if (partial && 'selectedRowKeys' in partial) {
      selectedRowKeySet = createKeySet(state.selectedRowKeys);
    }
    for (let i = 0; i < listeners.length; i++) {
      listeners[i]();
    }
  }

  function getState() {
    return state;
  }

  function subscribe(listener) {
    listeners.push(listener);

    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  function getSelectedKeySet() {
    return selectedRowKeySet;
  }

  return {
    setState,
    getState,
    subscribe,
    getSelectedKeySet,
  };
}
