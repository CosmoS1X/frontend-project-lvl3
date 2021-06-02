import 'bootstrap';
import onChange from 'on-change';
import i18n from 'i18next';
import _ from 'lodash';
import validateURL from './validator.js';
import getDocument from './getDocumentFromUrl.js';
import resources from './locales';
import {
  checkIsRss,
  addRss,
  disableUI,
  enableUI,
} from './handlers.js';
import { parseFeeds, parsePosts } from './parsers.js';
import watchers from './watchers.js';

const updatePosts = (state) => {
  console.log('!!!!!!!!!!!!!!!!!!!!!');
  const updateTimeout = 5000;
  state.downloadedFeeds.forEach((feed) => {
    const updates = getDocument(feed).then((doc) => {
      const postData = parsePosts(doc);
      const newPosts = _.differenceBy(postData, state.data.posts.flat(), 'guid');
      state.data.posts.unshift(newPosts);
      state.processState = 'posts downloaded';
    });
    Promise.all([updates]).finally(() => setTimeout(() => updatePosts(state), updateTimeout));
  });
};

export default () => {
  const state = {
    processState: 'standby',
    form: {
      url: '',
      error: null,
    },
    data: {
      feeds: [],
      posts: [],
    },
    downloadedFeeds: [],
  };

  return i18n.createInstance().init({
    lng: 'ru',
    debug: false,
    resources,
  })
    .then((t) => {
      const watchedState = onChange(state, watchers(state, t));

      const form = document.querySelector('form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');
        const error = validateURL(url, watchedState.downloadedFeeds, t);
        watchedState.form.error = error;

        if (error) {
          watchedState.processState = 'failed';
          return;
        }

        watchedState.form.url = url;

        disableUI();

        getDocument(url, t)
          .then((data) => {
            form.reset();
            enableUI();
            return checkIsRss(data, t);
          })
          .then((rss) => addRss(rss, watchedState, t))
          .then((rss) => parseFeeds(rss, watchedState))
          .then((rss) => {
            watchedState.data.posts.unshift(parsePosts(rss));
            watchedState.processState = 'posts downloaded';
          })
          .catch((err) => {
            watchedState.form.error = err.message === 'Network Error'
              ? `${t('errors.network')}`
              : err.message;
            watchedState.processState = 'failed';
          });
      });
      setTimeout(() => updatePosts(watchedState), 5000);
    });
};
