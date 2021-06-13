import 'bootstrap';
import i18n from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import * as yup from 'yup';
import yupLocale from './locales/yupLocale.js';
import resources from './locales';
import parseRss from './parseRss.js';
import view from './view.js';

const updateTimeout = 5000;
const proxyLink = 'https://hexlet-allorigins.herokuapp.com/';

const addProxy = (url) => {
  const newUrl = new URL('get', proxyLink);
  newUrl.searchParams.set('disableCache', 'true');
  newUrl.searchParams.set('url', url);
  return newUrl.toString();
};

const fetchData = (url) => axios
  .get(url)
  .then((response) => response.data.contents)
  .catch(() => {
    throw new Error('errors.network');
  });

const validateURL = (url, channels) => {
  const feedURLs = channels.map((feed) => feed.url);
  const schema = yup.string().required().url().notOneOf(feedURLs);
  try {
    schema.validateSync(url);
    return null;
  } catch (err) {
    return err.message;
  }
};

const addRss = (state) => {
  state.loadingProcess.status = 'loading';
  fetchData(addProxy(state.form.url))
    .then((data) => {
      const channelID = _.uniqueId();
      const { title, description, items } = parseRss(data);
      state.channels.unshift({ url: state.form.url, id: channelID });
      const feed = { title, description, id: channelID };
      const posts = items.map((item) => ({ ...item, channelID, postId: _.uniqueId() }));
      state.data.feeds.unshift(feed);
      state.data.posts.unshift(...posts);
      state.loadingProcess.status = 'standby';
    })
    .catch((err) => {
      state.loadingProcess.error = err.message;
      state.loadingProcess.status = 'failed';
    });
};

const updatePosts = (state) => {
  const updates = state.channels.map((channel) => fetchData(addProxy(channel.url))
    .then((data) => {
      const { items } = parseRss(data);
      const newPosts = items.map((item) => ({ ...item, channelID: channel.id }));
      const oldPosts = state.data.posts.filter((post) => post.channelID === channel.id);
      const diff = _.differenceBy(newPosts, oldPosts, 'link')
        .map((post) => ({ ...post, postId: _.uniqueId() }));
      state.data.posts.unshift(...diff);
    })
    .catch((err) => console.log(err)));
  Promise.all(updates).finally(() => setTimeout(() => updatePosts(state), updateTimeout));
};

const resetErrors = (state) => {
  state.form.error = null;
  state.loadingProcess.error = null;
};

export default () => {
  const state = {
    loadingProcess: {
      status: 'standby',
      error: null,
    },
    form: {
      url: '',
      error: null,
    },
    data: {
      feeds: [],
      posts: [],
    },
    channels: [],
    viewedPostIds: new Set(),
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
      yup.setLocale(yupLocale);

      const watchedState = view(state, elements, t);

      const form = document.querySelector('form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');
        const error = validateURL(url, watchedState.channels);

        if (error) {
          watchedState.form.error = error;
          return;
        }

        watchedState.form.url = url;
        resetErrors(watchedState);
        addRss(watchedState);
      });

      setTimeout(() => updatePosts(watchedState), updateTimeout);
    });
};
