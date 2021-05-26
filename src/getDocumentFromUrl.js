import axios from 'axios';

const addProxy = (url) => {
  const proxyLink = 'https://hexlet-allorigins.herokuapp.com/';
  const urlWithProxy = new URL('get', proxyLink);
  urlWithProxy.searchParams.set('disableCache', 'true');
  urlWithProxy.searchParams.set('url', url);
  return urlWithProxy.toString();
};

export default (url, i18n) => axios.get(addProxy(url))
  .then((response) => {
    if (response.statusText === 'OK') {
      return response.data;
    }

    throw new Error(`${i18n.t('errors.network')}`);
  })
  .then((data) => {
    const parser = new DOMParser();

    return parser.parseFromString(data.contents, 'application/xml');
  });
