export const isRss = (doc, i18n) => {
  const rss = doc.querySelector('rss');

  if (!rss) {
    return Promise.reject(new Error(`${i18n.t('errors.notContain')}`));
  }

  return doc;
};

export const func = () => {};
