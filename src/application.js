import onChange from 'on-change';
import i18next from 'i18next';
import validateURL from './validator.js';
import { renderState, renderError } from './renderers.js';
import parse from './parser.js';
import getDocument from './getDocumentFromUrl.js';
import resources from './locales';
import { isRss } from './handlers.js';

const clearProcessState = (state) => {
  state.form.processState = 'clear';
};

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

  const form = document.querySelector('form');

  const watchedState = onChange(state, (path, value) => {
    // console.log('STATE:', state);
    // console.log('PATH:', path);
    // console.log('VALUE:', value);
    if (path === 'form.processState') {
      switch (value) {
        case 'downloaded':
          renderState(state, i18n);
          break;
        case 'failed':
          renderError(state.form.error);
          break;
        default:
          throw new Error(`${value} is unknown state`);
      }
    }
    if (path === 'form.error') {
      clearProcessState(state);
    }
  });

  const addRss = (doc) => {
    const feedback = document.querySelector('.feedback');
    feedback.textContent = '';

    const rss = doc.querySelector('rss');

    parse(rss, watchedState);

    feedback.classList.add('text-success');
    feedback.textContent = `${i18n.t('success')}`;
    watchedState.form.processState = 'downloaded';
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    const error = validateURL(url, watchedState.downloadedFeeds, i18n);
    watchedState.form.error = error;

    if (watchedState.form.error.length === 0) {
      watchedState.downloadedFeeds.push(url);
      watchedState.form.url = url;

      getDocument(url)
        .then((doc) => isRss(doc, i18n))
        .then((doc) => addRss(doc))
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
