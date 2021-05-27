import axios from 'axios';

const addProxy = (url) => {
  console.log('orogin url', url);
  const proxyLink = 'https://hexlet-allorigins.herokuapp.com/';
  const newUrl = new URL('get', proxyLink);
  newUrl.searchParams.set('disableCache', 'true');
  newUrl.searchParams.set('url', url);
  return newUrl.toString();
};

export default (url, i18n) => {
  const proxifiedUrl = addProxy(url);
  console.log('proxified Url', proxifiedUrl);

  return axios
    .get(proxifiedUrl)
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
};
