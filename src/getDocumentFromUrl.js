import axios from 'axios';

export default (url, i18n) => axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${url}`)
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
