export default (url, i18n) => fetch(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`)
  .then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(`${i18n.t('errors.network')}`);
  })
  .then((data) => {
    const parser = new DOMParser();

    return parser.parseFromString(data.contents, 'application/xml');
  });
