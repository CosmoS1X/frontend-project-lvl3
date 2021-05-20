/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import validateURL from './validator.js';
import { renderState, renderError } from './renderers.js';
import parse from './parser.js';
import getDocument from './getDocumentFromUrl.js';

const clearProcessState = (state) => {
  state.form.processState = 'clear';
};

export default () => {
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
        case 'loading':
          getDocument(state.form.url)
            .then((doc) => addRss(doc))
            .then(() => form.reset())
            .catch((err) => {
              throw err;
            });
          break;
        case 'downloaded':
          renderState(state);
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

    if (!rss) {
      watchedState.form.error = 'Ресурс не содержит валидный RSS';
      watchedState.form.processState = 'failed';
    }

    parse(rss, watchedState);

    feedback.classList.add('text-success');
    feedback.textContent = 'RSS успешно загружен';
    watchedState.form.processState = 'downloaded';
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    const error = validateURL(url);
    watchedState.form.error = error;

    if (watchedState.downloadedFeeds.includes(url)) {
      watchedState.form.error = 'RSS уже существует';
      watchedState.form.processState = 'failed';
    } else if (watchedState.form.error.length === 0) {
      watchedState.downloadedFeeds.push(url);
      watchedState.form.url = url;
      watchedState.form.processState = 'loading';
    } else {
      watchedState.form.processState = 'failed';
    }
  });
};
