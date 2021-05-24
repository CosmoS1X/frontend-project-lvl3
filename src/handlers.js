export const checkIsRss = (doc, i18n) => {
  const rss = doc.querySelector('rss');

  if (!rss) {
    return Promise.reject(new Error(`${i18n.t('errors.notContain')}`));
  }

  return doc;
};

export const addRss = (doc, watchedState, i18n) => {
  watchedState.downloadedFeeds.push(watchedState.form.url);
  const feedback = document.querySelector('.feedback');
  feedback.textContent = '';
  feedback.classList.add('text-success');
  feedback.textContent = `${i18n.t('success')}`;
  const rss = doc.querySelector('rss');
  return rss;
};

export const clearProcessState = (state) => {
  state.form.processState = '';
};
