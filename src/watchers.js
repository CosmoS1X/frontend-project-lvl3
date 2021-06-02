import { renderFeeds, renderPosts, renderError } from './renderers.js';

export default (state, t) => (path, value) => {
  if (path === 'processState') {
    switch (value) {
      case 'feed downloaded':
        renderFeeds(state, t);
        break;
      case 'posts downloaded':
        renderPosts(state, t);
        break;
      case 'failed':
        renderError(state);
        break;
      default:
        throw new Error(`${value} is unknown state`);
    }
  }
};
