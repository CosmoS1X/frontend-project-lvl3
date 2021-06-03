import axios from 'axios';

const addProxy = (url) => {
  const proxyLink = 'https://hexlet-allorigins.herokuapp.com/';
  const newUrl = new URL('get', proxyLink);
  newUrl.searchParams.set('disableCache', 'true');
  newUrl.searchParams.set('url', url);
  return newUrl.toString();
};

export default (url) => {
  const proxifiedUrl = addProxy(url);

  return axios
    .get(proxifiedUrl)
    .then((response) => {
      if (response.statusText === 'OK') {
        return response.data;
      }

      throw new Error('Network Error');
    });
};
