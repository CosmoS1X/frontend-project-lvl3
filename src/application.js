import onChange from 'on-change';
import i18next from 'i18next';
import _ from 'lodash';
import validateURL from './validator.js';
import getDocument from './getDocumentFromUrl.js';
import resources from './locales';
import { checkIsRss, addRss } from './handlers.js';
import { parseFeeds, parsePosts } from './parsers.js';
import watchers from './watchers.js';

export default async () => {
  const i18n = i18next.createInstance();
  const init = await i18n.init({
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

  const updatePosts = () => {
    const updateTimeout = 5000;
    watchedState.downloadedFeeds.forEach((feed) => {
      const updates = getDocument(feed).then((doc) => {
        const postData = parsePosts(doc);
        const newPosts = _.differenceBy(postData, watchedState.form.data.posts.flat(), 'guid');
        watchedState.form.data.posts.unshift(newPosts);
        watchedState.form.processState = 'posts downloaded';
      });
      Promise.all([updates]).then(() => setTimeout(updatePosts, updateTimeout));
    });
  };

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    const error = validateURL(url, watchedState.downloadedFeeds, i18n);
    watchedState.form.error = error;

    if (watchedState.form.error !== '') {
      watchedState.form.processState = 'failed';
      return;
    }

    watchedState.form.url = url;

    getDocument(url, i18n)
      .then((data) => checkIsRss(data, i18n))
      .then((rss) => addRss(rss, watchedState, i18n))
      .then((rss) => parseFeeds(rss, watchedState))
      .then((rss) => {
        watchedState.form.data.posts.unshift(parsePosts(rss));
        watchedState.form.processState = 'posts downloaded';
      })
      .then(() => form.reset())
      .then(() => updatePosts())
      .catch((err) => {
        watchedState.form.error = err.message;
        watchedState.form.processState = 'failed';
      });
  });

  return init;
};
