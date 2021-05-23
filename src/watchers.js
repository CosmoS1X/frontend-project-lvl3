import { renderState, renderError } from './renderers.js';
import { clearProcessState } from './handlers.js';

export default (state, i18n) => (path, value) => {
  // console.log('STATE:', state);
  // console.log('PATH:', path);
  // console.log('VALUE:', value);
  if (path === 'form.processState') {
    switch (value) {
      case 'downloaded':
        renderState(state, i18n);
        clearProcessState(state);
        break;
      case 'failed':
        renderError(state.form.error);
        clearProcessState(state);
        break;
      default:
        throw new Error(`${value} is unknown state`);
    }
  }
};
