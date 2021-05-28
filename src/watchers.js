import { renderFeeds, renderPosts, renderError } from './renderers.js';

export default (state, i18n) => (path, value) => {
  if (path === 'processState') {
    switch (value) {
      case 'feed downloaded':
        renderFeeds(state, i18n);
        break;
      case 'posts downloaded':
        renderPosts(state, i18n);
        break;
      case 'failed':
        renderError(state);
        break;
      default:
        throw new Error(`${value} is unknown state`);
    }
  }
};
