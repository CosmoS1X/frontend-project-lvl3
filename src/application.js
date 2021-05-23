import onChange from 'on-change';
import i18next from 'i18next';
import validateURL from './validator.js';
import getDocument from './getDocumentFromUrl.js';
import resources from './locales';
import { isRss, addRss } from './handlers.js';
import { parseFeeds, parsePosts } from './parsers.js';
import watchers from './watchers.js';

export default () => {
  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: false,
    resources,
  });

  const state = {
    form: {
      processState: '',
      url: '',
      data: {
        feeds: [],
        posts: [],
      },
      error: '',
    },
    downloadedFeeds: [],
  };

  const watchedState = onChange(state, watchers(state, i18n));

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    const error = validateURL(url, watchedState.downloadedFeeds, i18n);
    watchedState.form.error = error;

    if (watchedState.form.error.length === 0) {
      watchedState.form.url = url;

      getDocument(url)
        .then((data) => isRss(data, i18n))
        .then((rss) => addRss(rss, watchedState, i18n))
        .then((rss) => parseFeeds(rss, watchedState))
        .then((rss) => parsePosts(rss, watchedState))
        .then(() => form.reset())
        .catch((err) => {
          watchedState.form.error = err.message;
          watchedState.form.processState = 'failed';
        });
    } else {
      watchedState.form.processState = 'failed';
    }
  });
};
