import { renderFeeds, renderPosts, renderError } from './renderers.js';
import { clearProcessState } from './handlers.js';

export default (state, i18n) => (path, value) => {
  if (path === 'form.processState') {
    switch (value) {
      case 'feed downloaded':
        renderFeeds(state, i18n);
        clearProcessState(state);
        break;
      case 'posts downloaded':
        renderPosts(state, i18n);
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
