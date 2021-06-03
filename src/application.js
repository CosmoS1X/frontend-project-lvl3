import 'bootstrap';
import i18n from 'i18next';
import _ from 'lodash';
import validateURL from './validator.js';
import fetchData from './fetchData.js';
import resources from './locales';
import parseRss from './parseRss.js';
import view from './view.js';

const updateTimeout = 5000;

const addRss = (state) => {
  state.processState = 'loading';
  fetchData(state.form.url)
    .then((data) => {
      const { title, description, posts } = parseRss(data);
      state.channels.unshift(state.form.url);
      const feed = { title, description };
      state.data.feeds.unshift(feed);
      state.data.posts.unshift(...posts);
      state.processState = 'downloaded';
    })
    .catch((err) => {
      console.log(err);
      state.form.error = err.message;
      state.processState = 'failed';
    });
};

const updatePosts = (state) => {
  state.channels.forEach((feedUrl) => {
    const updates = fetchData(feedUrl)
      .then((data) => {
        const { posts } = parseRss(data);
        const newPosts = _.differenceBy(posts, state.data.posts, 'guid');
        state.data.posts.unshift(...newPosts);
      })
      .catch((err) => console.log(err));
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
    channels: [],
  };

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    submitButton: document.querySelector('[type="submit"]'),
    feedback: document.querySelector('.feedback'),
  };

  return i18n.createInstance().init({
    lng: 'ru',
    debug: false,
    resources,
  })
    .then((t) => {
      const watchedState = view(state, elements, t);

      const form = document.querySelector('form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');
        const error = validateURL(url, watchedState.channels, t);
        watchedState.form.error = error;

        if (error) {
          watchedState.processState = 'failed';
          return;
        }

        watchedState.form.url = url;
        addRss(watchedState);
      });
      setTimeout(() => updatePosts(watchedState), updateTimeout);
    });
};
